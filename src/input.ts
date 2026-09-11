import type { Sample } from './launch';

type Point = { x: number; y: number };
export function bindGesture(host: HTMLElement, options: {
  enabled: () => boolean;
  center: () => Point;
  trail: (points: Point[]) => void;
  release: (samples: Sample[]) => void;
  place: (clientX: number, clientY: number) => void;
}) {
  let pointer: number | null = null;
  let samples: Sample[] = [];
  let points: Point[] = [];
  let origin: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  let placing = false;
  const contacts = new Set<number>();
  let interrupted = false;

  function cancel() {
    interrupted ||= contacts.size > 0;
    const oldPointer = pointer;
    pointer = null; samples = []; points = [];
    options.trail([]);
    if (oldPointer !== null && host.hasPointerCapture(oldPointer)) host.releasePointerCapture(oldPointer);
  }
  function sample(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    const p = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    points.push(p);
    samples.push({ x: p.x - origin.x, y: p.y - origin.y, t: event.timeStamp });
    if (!placing) options.trail(points);
  }
  host.addEventListener('pointerdown', event => {
    if ((event.target as Element).closest('button') || !options.enabled() || event.button !== 0) return;
    contacts.add(event.pointerId);
    if (pointer !== null || interrupted || contacts.size > 1) { cancel(); return; }
    origin = options.center(); start = { x: event.clientX, y: event.clientY };
    const rect = host.getBoundingClientRect();
    placing = Math.hypot(event.clientX - rect.left - origin.x, event.clientY - rect.top - origin.y) > 110;
    pointer = event.pointerId; samples = []; points = [];
    host.setPointerCapture(pointer); sample(event);
  });
  host.addEventListener('pointermove', event => { if (event.pointerId === pointer) sample(event); });
  host.addEventListener('pointerup', event => {
    if (event.pointerId !== pointer) return;
    sample(event);
    const completed = samples;
    const wasPlacing = placing;
    cancel();
    if (!options.enabled()) return;
    if (wasPlacing) {
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) < 8) options.place(event.clientX, event.clientY);
    } else options.release(completed);
  });
  host.addEventListener('pointercancel', cancel);
  host.addEventListener('lostpointercapture', event => { if (event.pointerId === pointer) cancel(); });
  const releaseContact = (event: PointerEvent) => {
    contacts.delete(event.pointerId);
    if (contacts.size === 0) interrupted = false;
  };
  window.addEventListener('pointerup', releaseContact);
  window.addEventListener('pointercancel', releaseContact);
  window.addEventListener('resize', cancel);
  return { cancel };
}
