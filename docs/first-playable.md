# First playable: the launch experiment

## Objective

Answer whether a touch gesture produces an understandable eraser spin, and whether balance, drift and stopping feel worth another attempt. This is the first slice of the approved prototype, not the complete battle game.

Build a mobile-first Three.js scene with one assembled eraser/refill-tip spinner on a school desk. The first launch is guided visually. The player selects a represented grip, traces a short arc and releases. Gesture quality sets initial spin/lean/drift; there is no control after release. A visible dent and an optional imperfect fit allow controlled repeat attempts. Stopping and falling have distinct results. Retry and best spin work locally. Include mouse and keyboard equivalents, pause/resume, mute and recoverable save failures.

## Delivery

Use TypeScript, Vite, Three.js WebGLRenderer, DOM/CSS and an independent fixed-step simulation. Keep Jolt as a development-only experiment comparing supported spinning and numerical behaviour; it is not an additional player-facing engine selector. Source belongs on GitHub and the production build on Pages. Prefer repository name `sbin` under the connected account if available. Existing user content must not be overwritten.

## Sequence and checks

1. Scaffold tooling; record research and this scope in Git.
2. Write behavioural tests for gesture input, energy decay, stop/fall outcomes and frame-schedule independence; implement the small simulation.
3. Build the desk, eraser, visual gesture cue and repeatable play loop. Inspect desktop and mobile layouts in a real browser.
4. Run the bounded Jolt comparison; record limits and the provisional simulation verdict.
5. Verify production asset paths, browser flows and no runtime errors; create a reproducible Pages workflow and publish.

Commands: `npm run dev`, `npm run typecheck`, `npm test`, `npm run test:browser`, `npm run build`, `npm run experiment:jolt`.

## Structure and style

`src/simulation.ts` owns state transitions; `src/launch.ts` maps samples to initial conditions; `src/scene.ts` owns rendering; `src/main.ts` connects UI and lifecycle. Small supporting modules own assets/audio/input if needed. Unit tests are next to the corresponding logic. `tests/` holds browser checks. `experiments/` holds the Jolt comparison. Use explicit TypeScript types, named constants and functions with direct inputs/outputs. Example: `advance(state, seconds)` advances simulation time; meshes never determine the result.

## Acceptance

- First usable screen includes an assembled spinner and a visual launch cue.
- A valid arc launches exactly once; cancelled/extra touches do not launch.
- Upright spin develops visible wobble as it decays; poor fit has a repeatable consequence.
- Supported desk movement and loss of support produce different outcomes. A dent is escapable and does not supply energy.
- Rendering schedule does not determine the same fixed-step simulation outcome.
- Pause and background/resume preserve the match; controls remain reachable on small screens.
- Production build loads under the repository subpath; published URL works without accounts or a backend.
- Automated browser checks and screenshots pass locally. Actual iPhone Safari and subjective feel remain user testing, with no invented device-performance claim.

## Boundaries

The accepted request authorizes implementation, necessary dependencies, repository creation and Pages publication. Keep credentials and local machine data out of published files. Avoid accounts, online play, crowd systems, large progression and full crafting UI in this slice. A first-round bot battle follows once the launch behaviour is useful to test. Do not claim a physics calibration or human playtest that has not occurred.
