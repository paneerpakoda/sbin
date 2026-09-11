// Development-only numerical comparison. Geometry uses the rendered scene's
// arbitrary units; these are not measured eraser material properties.
import initJolt from 'jolt-physics';
import { writeFileSync } from 'node:fs';

const J = await initJolt();
const vector = v => [v.GetX(), v.GetY(), v.GetZ()];
const quaternion = q => [q.GetX(), q.GetY(), q.GetZ(), q.GetW()];
function rotate(v, q) {
  const [x, y, z, w] = q;
  const dot = x * v[0] + y * v[1] + z * v[2];
  return [
    2 * dot * x + (w * w - x * x - y * y - z * z) * v[0] + 2 * w * (y * v[2] - z * v[1]),
    2 * dot * y + (w * w - x * x - y * y - z * z) * v[1] + 2 * w * (z * v[0] - x * v[2]),
    2 * dot * z + (w * w - x * x - y * y - z * z) * v[2] + 2 * w * (x * v[1] - y * v[0]),
  ];
}
const length = v => Math.hypot(...v);
const difference = (a, b) => a.map((v, i) => v - b[i]);
const identity = new J.Quat(0, 0, 0, 1);

function makeWorld(gravity) {
  const settings = new J.JoltSettings();
  settings.mMaxWorkerThreads = 0;
  const pair = new J.ObjectLayerPairFilterTable(1); pair.EnableCollision(0, 0);
  const broad = new J.BroadPhaseLayerInterfaceTable(1, 1);
  broad.MapObjectToBroadPhaseLayer(0, new J.BroadPhaseLayer(0));
  settings.mObjectLayerPairFilter = pair; settings.mBroadPhaseLayerInterface = broad;
  settings.mObjectVsBroadPhaseLayerFilter = new J.ObjectVsBroadPhaseLayerFilterTable(broad, 1, pair, 1);
  const world = new J.JoltInterface(settings);
  J.destroy(settings);
  const physics = world.GetPhysicsSystem();
  const gravityVector = new J.Vec3(0, gravity, 0); physics.SetGravity(gravityVector); J.destroy(gravityVector);
  return { world, bodies: physics.GetBodyInterface() };
}

function addBody(bodies, shape, position, rotation, dynamic, gyro, free) {
  const settings = new J.BodyCreationSettings(shape, position, rotation, dynamic ? J.EMotionType_Dynamic : J.EMotionType_Static, 0);
  settings.mApplyGyroscopicForce = gyro;
  settings.mAllowSleeping = false;
  settings.mMaxAngularVelocity = 250;
  settings.mAngularDamping = free ? 0 : 0.04;
  settings.mLinearDamping = free ? 0 : 0.05;
  settings.mFriction = 0.35;
  settings.mRestitution = 0;
  settings.mNumVelocityStepsOverride = 12;
  settings.mNumPositionStepsOverride = 4;
  if (dynamic) {
    const initial = rotate(free ? [8, 85, 13] : [0, 85, 0], quaternion(rotation));
    settings.mAngularVelocity = new J.Vec3(...initial);
    settings.mLinearVelocity = new J.Vec3(free ? 0 : 0.13, 0, free ? 0 : -0.1);
  }
  const body = bodies.CreateBody(settings);
  bodies.AddBody(body.GetID(), J.EActivation_Activate);
  J.destroy(settings);
  return body;
}

function run(mode, gyro, hz) {
  const free = mode === 'free-box';
  const { world, bodies } = makeWorld(free ? 0 : -9.81);
  const box = new J.BoxShapeSettings(new J.Vec3(0.44, 0.115, 0.275), 0.02);
  let shape;
  if (free) shape = box.Create().Get();
  else {
    const compound = new J.StaticCompoundShapeSettings();
    compound.AddShape(new J.Vec3(0, 0.49, 0), identity, box, 0);
    compound.AddShape(new J.Vec3(0, 0.172, 0), identity, new J.TaperedCylinderShapeSettings(0.17, 0.06, 0.008, 0.002), 1);
    shape = compound.Create().Get();
    const deskShape = new J.BoxShape(new J.Vec3(2.5, 0.115, 1.85), 0.02);
    addBody(bodies, deskShape, new J.RVec3(0, -0.115, 0), identity, false, false, false);
  }
  const q = new J.Quat(Math.sin(0.08 / 2), 0, 0, Math.cos(0.08 / 2));
  const body = addBody(bodies, shape, new J.RVec3(0, free ? 2 : 0.003, 0), q, true, gyro, free);
  const properties = shape.GetMassProperties();
  const inertia = [properties.mInertia.GetAxisX().GetX(), properties.mInertia.GetAxisY().GetY(), properties.mInertia.GetAxisZ().GetZ()];
  function rotationalMetrics() {
    const rotation = quaternion(body.GetRotation());
    const omega = vector(body.GetAngularVelocity());
    const localOmega = rotate(omega, [-rotation[0], -rotation[1], -rotation[2], rotation[3]]);
    const localMomentum = localOmega.map((v, i) => v * inertia[i]);
    return { energy: localOmega.reduce((sum, v, i) => sum + 0.5 * inertia[i] * v * v, 0), momentum: rotate(localMomentum, rotation) };
  }
  const initial = rotationalMetrics();
  let maxEnergyDrift = 0, maxMomentumDrift = 0, toppledAt = null, maxOmega = 0;
  const frames = [];
  const start = performance.now();
  for (let i = 0; i < hz * 10; i++) {
    world.Step(1 / hz, 1);
    const rotation = quaternion(body.GetRotation());
    const omega = length(vector(body.GetAngularVelocity()));
    const up = rotate([0, 1, 0], rotation);
    const tilt = Math.acos(Math.max(-1, Math.min(1, up[1])));
    maxOmega = Math.max(maxOmega, omega);
    if (!Number.isFinite(omega + tilt)) throw new Error('Non-finite Jolt state');
    if (toppledAt === null && tilt > Math.PI / 3) toppledAt = (i + 1) / hz;
    if (free) {
      const metrics = rotationalMetrics();
      maxEnergyDrift = Math.max(maxEnergyDrift, Math.abs(metrics.energy - initial.energy) / initial.energy);
      maxMomentumDrift = Math.max(maxMomentumDrift, length(difference(metrics.momentum, initial.momentum)) / length(initial.momentum));
    }
    if ((i + 1) % hz === 0) frames.push({ seconds: (i + 1) / hz, spin: +omega.toFixed(3), tiltDegrees: +(tilt * 180 / Math.PI).toFixed(2), position: vector(body.GetPosition()).map(v => +v.toFixed(4)) });
  }
  const elapsedMs = performance.now() - start;
  const result = { mode, gyro, hz, toppledAt, maxOmega: +maxOmega.toFixed(3), maxEnergyDriftPercent: free ? +(maxEnergyDrift * 100).toFixed(4) : null,
    maxMomentumVectorDriftPercent: free ? +(maxMomentumDrift * 100).toFixed(4) : null, elapsedMs: +elapsedMs.toFixed(1), frames };
  J.destroy(world);
  return result;
}

const results = [run('free-box', false, 120), run('free-box', true, 120), run('free-box', true, 240), run('free-box', true, 960),
  run('supported-top', false, 120), run('supported-top', true, 60), run('supported-top', true, 120), run('supported-top', true, 240)];
writeFileSync(new URL('./jolt-results.json', import.meta.url), JSON.stringify({ package: 'jolt-physics@1.1.0', simulatedSecondsPerCase: 10, units: 'arbitrary scene units; not material calibration', results }, null, 2) + '\n');
console.table(results.map(({ frames, ...row }) => ({ ...row, finalSpin: frames.at(-1).spin, finalTiltDegrees: frames.at(-1).tiltDegrees })));
