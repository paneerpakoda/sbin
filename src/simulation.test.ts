import { describe, expect, it } from 'vitest';
import { createState, launch, advance, STEP } from './simulation';

const shot = { spin: 85, vx: 0.13, vz: -0.1, tilt: 0.05, quality: 1, direction: 1 };
function run(fit = 0, surface: 'plain' | 'dent' = 'plain') {
  const state = createState({ fit, surface });
  launch(state, shot);
  while (state.phase === 'spinning' && state.elapsed < 60) advance(state, STEP);
  return state;
}

describe('the spinner experiment', () => {
  it('decays to a finite stopped result without an external energy source', () => {
    const state = createState();
    launch(state, shot);
    let previous = state.spin;
    for (let i = 0; i < 5000 && state.phase === 'spinning'; i++) {
      advance(state, STEP);
      expect(state.spin).toBeLessThanOrEqual(previous);
      expect(Number.isFinite(state.tilt)).toBe(true);
      previous = state.spin;
    }
    expect(state.phase).toBe('stopped');
    expect(state.elapsed).toBeGreaterThan(10);
    expect(state.elapsed).toBeLessThan(40);
  });
  it('makes poor fit reduce useful spinning time', () => {
    expect(run(0.75).elapsed).toBeLessThan(run(0).elapsed);
  });
  it('falls when the support point crosses the desk edge', () => {
    const state = createState();
    state.x = 2.49;
    launch(state, { ...shot, vx: 1.5 });
    advance(state, 0.3);
    expect(state.phase).toBe('fallen');
  });
  it('produces the same outcome for different rendering frame schedules', () => {
    const a = createState();
    const b = createState();
    launch(a, shot); launch(b, shot);
    for (let i = 0; i < 600; i++) advance(a, 1 / 60);
    for (let i = 0; i < 300; i++) advance(b, 1 / 30);
    expect(a.x).toBeCloseTo(b.x, 8);
    expect(a.spin).toBeCloseTo(b.spin, 8);
    expect(a.elapsed).toBeCloseTo(b.elapsed, 8);
  });
  it('does not launch twice or simulate while paused', () => {
    const state = createState();
    launch(state, shot); launch(state, { ...shot, spin: 5 });
    state.paused = true;
    advance(state, 1);
    expect(state.spin).toBe(85);
    expect(state.elapsed).toBe(0);
  });
  it('allows a strong launch to escape a dent without gaining spin', () => {
    const state = createState({ surface: 'dent' });
    const startX = state.x;
    launch(state, { ...shot, vx: 1.5, vz: 0 });
    for (let i = 0; i < 120; i++) advance(state, STEP);
    expect(state.x - startX).toBeGreaterThan(0.4);
    expect(state.spin).toBeLessThan(shot.spin);
  });
});
