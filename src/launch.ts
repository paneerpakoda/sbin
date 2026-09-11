export type Grip = 'pinch' | 'flick';
export type Sample = { x: number; y: number; t: number };
export type Launch = {
  spin: number; vx: number; vz: number; tilt: number; quality: number; direction: number;
};

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Coordinates are relative to the gesture ring, in CSS pixels. */
export function readLaunch(samples: Sample[], grip: Grip): Launch | null {
  if (samples.length < 4 || samples.some(p => !Number.isFinite(p.x + p.y + p.t))) return null;
  const radii = samples.map(p => Math.hypot(p.x, p.y));
  const radius = radii.reduce((a, b) => a + b, 0) / radii.length;
  if (radius < 12) return null;
  let angle = 0;
  let travel = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    const delta = Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
    angle += delta;
    travel += Math.abs(delta);
  }
  if (Math.abs(angle) < 0.45 || travel < 0.45) return null;
  const elapsed = Math.max(60, samples.at(-1)!.t - samples[0].t) / 1000;
  const deviation = Math.sqrt(radii.reduce((sum, r) => sum + (r - radius) ** 2, 0) / radii.length) / radius;
  const quality = clamp((1 - deviation * 1.8) * Math.abs(angle) / travel, 0.15, 1);
  const power = clamp(Math.abs(angle) / elapsed / 12, 0.05, 1);
  const direction = Math.sign(angle);
  const last = samples.at(-1)!;
  const tangent = Math.atan2(last.y, last.x) + direction * Math.PI / 2;
  const drift = (grip === 'flick' ? 0.65 : 0.18) * (0.5 + power) + (1 - quality) * 0.55;
  return {
    spin: clamp((30 + power * 65) * (0.55 + quality * 0.45) * (grip === 'flick' ? 1.1 : 1), 18, 110),
    vx: Math.cos(tangent) * drift,
    vz: Math.sin(tangent) * drift,
    tilt: 0.035 + (1 - quality) * 0.4 + (grip === 'flick' ? 0.07 : 0),
    quality, direction,
  };
}

export function demoLaunch(grip: Grip): Launch {
  return { spin: grip === 'pinch' ? 85 : 94, vx: grip === 'pinch' ? 0.16 : 0.68,
    vz: -0.12, tilt: grip === 'pinch' ? 0.04 : 0.11, quality: 1, direction: 1 };
}
