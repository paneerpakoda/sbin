import { clamp, type Launch } from './launch';

export const STEP = 1 / 120;
export const DESK = { halfWidth: 2.5, halfDepth: 1.85 };
export const DENT = { x: -0.9, z: -0.35, radius: 0.38 };
export type Surface = 'plain' | 'dent';
export type Phase = 'ready' | 'spinning' | 'stopped' | 'fallen';
export type SpinState = {
  phase: Phase; paused: boolean; surface: Surface; fit: number;
  x: number; z: number; vx: number; vz: number;
  spin: number; angle: number; tilt: number; initialTilt: number;
  precession: number; direction: number; elapsed: number;
  accumulator: number; aftermath: number; inDent: boolean; quality: number;
};

export function createState(options: { fit?: number; surface?: Surface } = {}): SpinState {
  const surface = options.surface ?? 'plain';
  return {
    phase: 'ready', paused: false, surface, fit: clamp(options.fit ?? 0, 0, 1),
    x: surface === 'dent' ? DENT.x : 0, z: surface === 'dent' ? DENT.z : 0.35,
    vx: 0, vz: 0, spin: 0, angle: -0.28, tilt: 0, initialTilt: 0,
    precession: 0, direction: 1, elapsed: 0, accumulator: 0, aftermath: 0,
    inDent: false, quality: 0,
  };
}

export function launch(state: SpinState, input: Launch): boolean {
  if (state.phase !== 'ready' || !Object.values(input).every(Number.isFinite)) return false;
  state.phase = 'spinning';
  state.spin = clamp(input.spin, 0, 110);
  state.vx = clamp(input.vx, -2, 2); state.vz = clamp(input.vz, -2, 2);
  state.initialTilt = clamp(input.tilt, 0, 0.6);
  state.tilt = state.initialTilt;
  state.quality = clamp(input.quality, 0, 1);
  state.direction = input.direction >= 0 ? 1 : -1;
  return true;
}

function tick(s: SpinState) {
  s.elapsed += STEP;
  const dx = s.x - DENT.x, dz = s.z - DENT.z;
  const distance = Math.hypot(dx, dz);
  s.inDent = s.surface === 'dent' && distance < DENT.radius;
  const confinement = s.inDent ? 1 - distance / DENT.radius : 0;
  // The shallow depression confines translation; it never adds rotational energy.
  if (s.inDent) {
    s.vx -= dx * confinement * 7 * STEP;
    s.vz -= dz * confinement * 7 * STEP;
  }
  const drag = 0.46 + confinement * 2.2;
  s.vx *= Math.exp(-drag * STEP); s.vz *= Math.exp(-drag * STEP);
  s.x += s.vx * STEP; s.z += s.vz * STEP;
  const rotationalLoss = (2.3 + s.spin * 0.025 + s.fit * 4.8 + s.tilt * 1.4) * (1 - confinement * 0.12);
  s.spin = Math.max(0, s.spin - rotationalLoss * STEP);
  const targetTilt = s.initialTilt * 0.65 + s.fit * 0.18 + 0.02 + 0.95 * (12 / (s.spin + 8)) ** 2;
  s.tilt += (targetTilt - s.tilt) * (1 - Math.exp(-3 * STEP));
  s.precession += (1.6 + 18 / (s.spin + 8)) * STEP * s.direction;
  s.angle += s.spin * STEP * s.direction;
  if (Math.abs(s.x) > DESK.halfWidth || Math.abs(s.z) > DESK.halfDepth) s.phase = 'fallen';
  else if (s.spin <= 6 || s.tilt >= 1.02) s.phase = 'stopped';
}

/** A fixed simulation clock; display frame rate never enters the physical model. */
export function advance(state: SpinState, seconds: number) {
  if (state.paused || !Number.isFinite(seconds) || seconds <= 0 || state.phase === 'ready') return;
  if (state.phase !== 'spinning') {
    state.aftermath = Math.min(3, state.aftermath + Math.min(seconds, 0.1));
    return;
  }
  state.accumulator += Math.min(seconds, 0.25);
  while (state.accumulator + 1e-10 >= STEP && state.phase === 'spinning') {
    tick(state);
    state.accumulator -= STEP;
  }
  if (state.phase !== 'spinning') state.accumulator = 0;
}
