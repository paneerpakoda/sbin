export function createAudio() {
  let context: AudioContext | null = null;
  let enabled = false;
  async function unlock() {
    if (!enabled) return;
    try {
      context ??= new AudioContext();
      if (context.state !== 'running') await context.resume();
    } catch { /* Muted play remains available if the browser declines audio. */ }
  }
  function note(kind: 'launch' | 'stop' | 'fall') {
    if (!enabled || !context || context.state !== 'running') return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = kind === 'launch' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(kind === 'launch' ? 700 : 150, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'launch' ? 170 : 55, now + 0.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(now); oscillator.stop(now + 0.25);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  return { unlock, note, toggle: async () => { enabled = !enabled; await unlock(); return enabled; } };
}
