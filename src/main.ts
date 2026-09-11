import './styles.css';
import './responsive.css';
import { createScene } from './scene';
import { advance, createState, launch, type Surface } from './simulation';
import { demoLaunch, readLaunch, type Grip, type Launch } from './launch';
import { bindGesture } from './input';
import { createAudio } from './audio';

const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const app = element('app'), arena = element('arena'), guide = element('gesture-guide');
const timer = element('timer'), bestLabel = element('best'), hint = element('hint');
const instruction = element('instruction'), feedback = element('feedback'), chapter = element('chapter');
const retry = element<HTMLButtonElement>('retry'), demo = element<HTMLButtonElement>('demo');
const setupOpen = element<HTMLButtonElement>('setup-open'), pause = element<HTMLButtonElement>('pause');
const setup = element<HTMLDialogElement>('setup'), pauseOverlay = element('pause-overlay');
const announcement = element('announcement'), sound = element<HTMLButtonElement>('sound');
const trail = document.getElementById('trail-path')!;
const gripButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-grip]')];
let state = createState();
let grip: Grip = 'pinch';
let best = 0;
let attempts = 0;
let resultShown = false;
let drawing = false;
const audio = createAudio();

try {
  const saved = JSON.parse(localStorage.getItem('sbin.v1') ?? '{}');
  if (typeof saved.best === 'number' && Number.isFinite(saved.best) && saved.best > 0 && saved.best < 600) best = saved.best;
} catch { /* A fresh pencil box is usable even when storage is unavailable. */ }
const seconds = (value: number) => value.toFixed(1).padStart(4, '0');
bestLabel.textContent = best > 0 ? `${seconds(best)}s` : '—';

async function boot() {
  const view = createScene(arena);
  element('loading').hidden = true;
  app.dataset.phase = 'ready';
  view.render(state);

  const input = bindGesture(arena, {
    enabled: () => state.phase === 'ready' && !setup.open,
    center: () => view.screenPoint(state),
    trail: points => {
      drawing = points.length > 1;
      trail.setAttribute('d', points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
    },
    release: samples => {
      const shot = readLaunch(samples, grip);
      if (shot) begin(shot);
      else {
        feedback.textContent = 'Follow a little more of the ring, then lift.';
        announcement.textContent = 'Try a longer curve around the eraser.';
      }
    },
    place: (x, y) => {
      const position = view.deskPoint(x, y);
      if (position) { state.x = position.x; state.z = position.z; feedback.textContent = 'New spot. Same eraser. Give it a spin.'; }
    },
  });

  function begin(shot: Launch) {
    if (!launch(state, shot)) return;
    attempts++; resultShown = false;
    app.dataset.phase = 'spinning';
    guide.hidden = true; retry.hidden = true; demo.hidden = true;
    setupOpen.disabled = true; pause.hidden = false;
    gripButtons.forEach(button => button.disabled = true);
    chapter.textContent = 'HANDS OFF · LET IT SPIN';
    instruction.textContent = shot.quality > 0.8 ? 'There it goes.' : 'A wobbly beginning.';
    hint.textContent = 'Watch the tip, the lean, and how far it wanders.';
    feedback.textContent = shot.quality > 0.8 ? 'That was a smooth release.' : 'A smoother curve will start it with less lean.';
    announcement.textContent = 'Spinner launched. Hands off while it spins.';
    void audio.unlock().then(() => audio.note('launch'));
  }

  function reset() {
    input.cancel();
    state = createState({ fit: state.fit, surface: state.surface });
    resultShown = false; drawing = false;
    app.dataset.phase = 'ready'; retry.hidden = true; demo.hidden = false;
    pause.hidden = true; pauseOverlay.hidden = true;
    setupOpen.disabled = attempts === 0;
    gripButtons.forEach(button => button.disabled = false);
    chapter.textContent = attempts ? 'ONE MORE TRY · MAKE IT YOURS' : 'LESSON 01 · THE LAUNCH';
    instruction.textContent = 'Give it a little spin.';
    hint.textContent = 'Touch the ring, sweep around it, then lift your finger.';
    feedback.textContent = attempts ? 'Tap another spot on the desk to try a different start.' : 'A smooth curve beats a hurried flick.';
    announcement.textContent = 'Ready for another spin.';
  }

  function setPaused(value: boolean) {
    if (state.phase !== 'spinning') return;
    input.cancel(); state.paused = value; state.accumulator = 0;
    pauseOverlay.hidden = !value;
    if (value) element<HTMLButtonElement>('resume').focus();
    else { void audio.unlock(); pause.focus(); }
  }

  function finish() {
    resultShown = true;
    const fell = state.phase === 'fallen';
    const isBest = !fell && state.elapsed > best;
    if (isBest) {
      best = state.elapsed; bestLabel.textContent = `${seconds(best)}s`;
      try { localStorage.setItem('sbin.v1', JSON.stringify({ best })); } catch { /* Best remains available for this visit. */ }
    }
    app.dataset.phase = state.phase;
    chapter.textContent = fell ? 'OFF THE DESK · STILL YOUR ERASER' : isBest ? 'A NEW PERSONAL BEST' : 'ONE FOR THE NOTEBOOK';
    instruction.textContent = fell ? 'The edge wins this one.' : isBest ? 'Now that’s a spin.' : 'There’s another spin in it.';
    hint.textContent = fell ? `${seconds(state.elapsed)} seconds before it lost the desk. Try a spot further in.` : `${seconds(state.elapsed)} seconds. Same little eraser. A little more practice.`;
    feedback.textContent = fell ? 'Try starting further from the edge of the desk.' : state.fit > 0 ? 'Try centring the tip in your pencil box.' : 'Change your grip or your spot. See what happens.';
    retry.hidden = false; pause.hidden = true; setupOpen.disabled = false;
    gripButtons.forEach(button => button.disabled = false);
    announcement.textContent = `${fell ? 'Fell off the desk' : 'Spin complete'} after ${state.elapsed.toFixed(1)} seconds. ${isBest ? 'New personal best.' : ''}`;
    audio.note(fell ? 'fall' : 'stop');
  }

  retry.addEventListener('click', reset);
  demo.addEventListener('click', () => begin(demoLaunch(grip)));
  pause.addEventListener('click', () => setPaused(true));
  element('resume').addEventListener('click', () => setPaused(false));
  sound.addEventListener('click', async () => {
    const enabled = await audio.toggle();
    sound.setAttribute('aria-pressed', String(enabled));
    sound.setAttribute('aria-label', enabled ? 'Mute sound' : 'Turn sound on');
    sound.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z${enabled ? 'M17 8c3 2 3 6 0 8M20 5c5 4 5 10 0 14' : 'M17 8l4 8m0-8-4 8'}"/></svg>`;
  });
  for (const button of gripButtons) button.addEventListener('click', () => {
    if (state.phase === 'spinning') return;
    grip = button.dataset.grip as Grip;
    gripButtons.forEach(b => { const selected = b === button; b.classList.toggle('selected', selected); b.setAttribute('aria-pressed', String(selected)); });
    element('grip-label').textContent = grip === 'pinch' ? 'STEADY HANDS' : 'A LITTLE MORE KICK';
    feedback.textContent = grip === 'pinch' ? 'A steady pinch keeps the launch more upright.' : 'More spin, more sideways kick. Watch the edge.';
  });
  setupOpen.addEventListener('click', () => { if (state.phase !== 'spinning') { input.cancel(); setup.showModal(); } });
  element('setup-close').addEventListener('click', () => setup.close());
  element('setup-done').addEventListener('click', () => { setup.close(); reset(); });
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-fit], [data-surface]')) button.addEventListener('click', () => {
    if (button.dataset.fit !== undefined) state.fit = Number(button.dataset.fit);
    if (button.dataset.surface !== undefined) state.surface = button.dataset.surface as Surface;
    document.querySelectorAll<HTMLButtonElement>('[data-fit], [data-surface]').forEach(b => {
      const selected = b.dataset.fit !== undefined ? Number(b.dataset.fit) === state.fit : b.dataset.surface === state.surface;
      b.classList.toggle('selected', selected); b.setAttribute('aria-pressed', String(selected));
    });
  });
  document.addEventListener('visibilitychange', () => { input.cancel(); if (document.hidden) setPaused(true); });
  window.addEventListener('keydown', event => {
    if (setup.open || (event.target as Element).closest('button, a, input, select')) return;
    if (event.code === 'Space') { event.preventDefault(); if (state.phase === 'ready') begin(demoLaunch(grip)); else if (state.phase === 'spinning') setPaused(!state.paused); else reset(); }
  });
  rendererRecovery();
  function rendererRecovery() {
    view.renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault(); setPaused(true);
      announcement.textContent = 'Graphics interrupted. The spin is paused.';
    });
    view.renderer.domElement.addEventListener('webglcontextrestored', () => { feedback.textContent = 'The desk is back. Resume whenever you’re ready.'; });
  }

  let last = performance.now();
  let displayedTime = '';
  view.renderer.setAnimationLoop(now => {
    const dt = (now - last) / 1000; last = now;
    advance(state, dt);
    view.render(state);
    const time = seconds(state.elapsed);
    if (time !== displayedTime) { timer.innerHTML = `${time}<span>s</span>`; displayedTime = time; }
    const center = view.screenPoint(state);
    guide.style.left = `${center.x}px`; guide.style.top = `${center.y}px`;
    guide.hidden = state.phase !== 'ready' || drawing;
    if ((state.phase === 'stopped' || state.phase === 'fallen') && !resultShown) finish();
  });
}

void boot().catch(() => {
  app.dataset.phase = 'error';
  element('loading').textContent = 'The desk could not load. Please reload in a browser with WebGL2 support.';
  hint.textContent = 'Try reloading the page to bring the desk back.';
});
