import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { DESK, DENT, type SpinState } from './simulation';
import { eraserTexture, woodTexture } from './textures';

export function createScene(host: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e6e4d6');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.setAttribute('aria-label', 'School desk with an eraser spinner');
  host.prepend(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 50);
  camera.position.set(0, 7.5, 7); camera.lookAt(0, -0.12, 0);
  scene.add(new THREE.HemisphereLight('#fff2d5', '#777b6d', 1.7));
  const sunlight = new THREE.DirectionalLight('#fff2d8', 2.2);
  sunlight.position.set(-3, 7, 4); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, far: 20 });
  sunlight.shadow.normalBias = 0.03;
  scene.add(sunlight);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#d3d6c5', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.65; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(30, 20, '#b7bdad', '#b7bdad'); grid.position.y = -1.645; scene.add(grid);

  const wood = woodTexture(); wood.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const sideMaterial = new THREE.MeshStandardMaterial({ color: '#825434', roughness: 0.88 });
  const invisibleTop = new THREE.MeshBasicMaterial({ visible: false });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(5, 0.23, 3.7), [sideMaterial, sideMaterial, invisibleTop, sideMaterial, sideMaterial, sideMaterial]);
  desk.position.y = -0.115; desk.castShadow = true; desk.receiveShadow = true; scene.add(desk);
  const deskSurface = new THREE.PlaneGeometry(5, 3.7, 100, 74);
  deskSurface.rotateX(-Math.PI / 2);
  const deskTop = new THREE.Mesh(deskSurface, new THREE.MeshStandardMaterial({ map: wood, roughness: 0.87 }));
  deskTop.receiveShadow = true; scene.add(deskTop);
  const metal = new THREE.MeshStandardMaterial({ color: '#404c47', roughness: 0.75 });
  for (const x of [-2.12, 2.12]) for (const z of [-1.45, 1.45]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), metal);
    leg.position.set(x, -0.92, z); leg.castShadow = true; scene.add(leg);
  }
  for (const x of [-2.12, 2.12]) {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 3), metal);
    brace.position.set(x, -1.25, 0); scene.add(brace);
  }

  const spinner = new THREE.Group();
  const rotor = new THREE.Group(); spinner.add(rotor); scene.add(spinner);
  const eraser = new THREE.Group(); rotor.add(eraser);
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.88, 0.23, 0.55, 3, 0.045), new THREE.MeshStandardMaterial({ color: '#e8dfc4', roughness: 0.96 }));
  body.position.y = 0.49; body.castShadow = true; eraser.add(body);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.49), new THREE.MeshStandardMaterial({ map: eraserTexture(), roughness: 0.95 }));
  label.rotation.x = -Math.PI / 2; label.position.y = 0.606; eraser.add(label);
  const tipMaterial = new THREE.MeshStandardMaterial({ color: '#b8bab2', metalness: 0.8, roughness: 0.27 });
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.008, 0.34, 16), tipMaterial);
  tip.position.y = 0.172; tip.castShadow = true; rotor.add(tip);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.09, 16), tipMaterial);
  collar.position.y = 0.365; rotor.add(collar);

  const contactShadow = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), new THREE.MeshBasicMaterial({ color: '#453821', transparent: true, opacity: 0.11, depthWrite: false }));
  contactShadow.rotation.x = -Math.PI / 2; contactShadow.position.y = 0.004; scene.add(contactShadow);
  const dentMark = new THREE.Mesh(new THREE.RingGeometry(0.30, 0.305, 64), new THREE.MeshBasicMaterial({ color: '#6e573c', transparent: true, opacity: 0.5, depthWrite: false }));
  dentMark.rotation.x = -Math.PI / 2; dentMark.position.set(DENT.x, 0.002, DENT.z); scene.add(dentMark);

  let previousSurface = '';
  const point = new THREE.Vector3();
  const upright = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3();
  const corner = new THREE.Vector3();
  const spinRotation = new THREE.Quaternion();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    const span = width < 650 ? 5.9 : Math.max(6.2, width / height * 4.8);
    const vertical = span * height / width;
    camera.left = -span / 2; camera.right = span / 2;
    camera.top = vertical / 2; camera.bottom = -vertical / 2;
    camera.updateProjectionMatrix(); renderer.setSize(width, height);
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize();

  function render(s: SpinState) {
    if (s.surface !== previousSurface) {
      const positions = deskSurface.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const distance = Math.hypot(positions.getX(i) - DENT.x, positions.getZ(i) - DENT.z);
        const depression = s.surface === 'dent' ? Math.max(0, 1 - (distance / DENT.radius) ** 2) : 0;
        positions.setY(i, -0.035 * depression ** 2);
      }
      positions.needsUpdate = true; deskSurface.computeVertexNormals(); previousSurface = s.surface;
    }
    dentMark.visible = s.surface === 'dent';
    const depression = s.surface === 'dent' ? -0.035 * Math.max(0, 1 - (Math.hypot(s.x - DENT.x, s.z - DENT.z) / DENT.radius) ** 2) ** 2 : 0;
    let tilt = s.tilt;
    let height = depression;
    let angle = s.angle;
    if (s.phase === 'stopped') {
      tilt += (1.16 - tilt) * (1 - Math.exp(-s.aftermath * 5));
      angle += s.direction * 1.2 * (1 - Math.exp(-s.aftermath * 4));
      height = Math.max(depression, (1 - Math.exp(-s.aftermath * 5)) * 0.08);
    } else if (s.phase === 'fallen') {
      height -= 4.9 * s.aftermath ** 2;
      tilt += s.aftermath * 3; angle += s.aftermath * 5;
    }
    axis.set(Math.sin(tilt) * Math.cos(s.precession), Math.cos(tilt), Math.sin(tilt) * Math.sin(s.precession));
    spinner.quaternion.setFromUnitVectors(upright, axis);
    // Let a stopped eraser rest on a face rather than intersecting the desktop.
    if (s.phase === 'stopped') {
      spinRotation.setFromAxisAngle(upright, angle);
      let lowest = 0;
      for (const x of [-0.44, 0.44]) for (const y of [0.375, 0.605]) for (const z of [-0.275, 0.275]) {
        corner.set(x + s.fit * 0.16, y, z).applyQuaternion(spinRotation).applyQuaternion(spinner.quaternion);
        lowest = Math.min(lowest, corner.y);
      }
      height = Math.max(height, depression - lowest + 0.002);
    }
    spinner.position.set(s.x + (s.phase === 'fallen' ? s.vx * s.aftermath : 0), height, s.z + (s.phase === 'fallen' ? s.vz * s.aftermath : 0));
    spinner.visible = height > -2;
    rotor.rotation.y = angle; eraser.position.x = s.fit * 0.16;
    contactShadow.position.set(s.x, depression + 0.003, s.z);
    contactShadow.visible = s.phase !== 'fallen';
    renderer.render(scene, camera);
  }

  function screenPoint(s: SpinState) {
    point.set(s.x, 0.40, s.z).project(camera);
    return { x: (point.x * 0.5 + 0.5) * host.clientWidth, y: (-point.y * 0.5 + 0.5) * host.clientHeight };
  }

  function deskPoint(clientX: number, clientY: number) {
    const rect = host.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((clientX - rect.left) / rect.width * 2 - 1, -(clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
    if (!hit || Math.abs(hit.x) > DESK.halfWidth - 0.2 || Math.abs(hit.z) > DESK.halfDepth - 0.2) return null;
    return { x: hit.x, z: hit.z };
  }

  return { renderer, render, screenPoint, deskPoint, resize, dispose: () => { observer.disconnect(); renderer.dispose(); } };
}
