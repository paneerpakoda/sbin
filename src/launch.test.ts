import { describe, expect, it } from 'vitest';
import { readLaunch } from './launch';

const arc = (duration: number, radius = 60) => Array.from({ length: 25 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 1.2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, t: (i / 24) * duration };
});

describe('gesture launches', () => {
  it('rejects a tap and a motionless hold', () => {
    expect(readLaunch([{ x: 60, y: 0, t: 0 }, { x: 60, y: 0, t: 500 }], 'pinch')).toBeNull();
  });
  it('rewards a faster smooth arc without allowing unlimited spin', () => {
    const slow = readLaunch(arc(1100), 'pinch')!;
    const fast = readLaunch(arc(400), 'pinch')!;
    const instant = readLaunch(arc(5), 'pinch')!;
    expect(fast.spin).toBeGreaterThan(slow.spin);
    expect(instant.spin).toBeLessThanOrEqual(110);
    expect(fast.quality).toBeGreaterThan(0.9);
  });
  it('maps equivalent arcs at different screen sizes to the same launch', () => {
    expect(readLaunch(arc(600, 45), 'pinch')!.spin).toBeCloseTo(readLaunch(arc(600, 90), 'pinch')!.spin);
  });
  it('makes the finger flick a tradeoff in drift and stability', () => {
    const pinch = readLaunch(arc(500), 'pinch')!;
    const flick = readLaunch(arc(500), 'flick')!;
    expect(Math.hypot(flick.vx, flick.vz)).toBeGreaterThan(Math.hypot(pinch.vx, pinch.vz));
    expect(flick.tilt).toBeGreaterThan(pinch.tilt);
  });
  it('rejects non-finite gesture coordinates', () => {
    expect(readLaunch([{ x: NaN, y: 0, t: 0 }, { x: 0, y: 30, t: 200 }], 'pinch')).toBeNull();
  });
});
