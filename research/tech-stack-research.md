# Sbin — technical stack recommendation

**Use TypeScript, Vite, Three.js with WebGL2, and a small independent spinner simulation. Publish the static build to GitHub Pages through GitHub Actions.** Start with ordinary HTML/CSS menus, browser audio and local saves. Compare the proposed simulation with a small Jolt full-3D experiment before expanding the content.

Confidence is high in the application and hosting choices, and moderate in the simulation choice. Documentation establishes capabilities and constraints; it does not establish convincing eraser behaviour or performance on the target phone. No candidate has been installed, benchmarked or deployed for this report.

## Constraints that drive the recommendation

The prototype represents secondary/senior-secondary school in Ranchi. A player assembles an eraser and metal pen-refill tip, selects a hand technique, aims and launches. After release, there is no player control. Battles against a bot are primary; longest-spin challenges are secondary. The desk edge, balance, fit and tip/surface interaction should create understandable consequences.

The first experience is a guided launch with a ready starter, followed by the workshop. Visual guidance is preferred; its precise form needs testing. Stylised 3D and a stable elevated camera should expose lean, wobble and the tip. Nostalgic adults and younger newcomers are equally important. Crowd systems and substantial progression are deferred. The initial test device is an iPhone 17; Safari is the proposed baseline, with the installed OS/browser still to be recorded. Source must live on GitHub and the build on Pages. See the [prototype brief](prototype-brief.md) for the accepted decisions and proposed content counts.

These constraints favour a direct browser project with a small scene and explicit simulation ownership. They do not require an application server, a visual game editor, account infrastructure or a large UI framework.

### Penfight's actual deployed stack

A subsequent inspection of the reference game's public client found Three.js r169, active Rapier 3D physics code, Vite build markers and Supabase authentication/realtime integrations. Its public page is served by Vercel. Direct DOM UI construction is present; the original source language is unconfirmed. See the [inspection and primary evidence](penfight-stack-inspection.md).

This is a practical precedent for Three.js/Vite and Rapier desk collisions. It does not establish spinning-top behaviour or performance for Sbin. Its online services also exceed the accepted bot prototype's requirements.

## Recommended stack

| Layer | Starting choice | Reason and boundary |
| --- | --- | --- |
| Language | TypeScript, strict checking | Make build, launch, match and save states explicit. Type checking complements runtime validation. |
| Build tooling | Vite, npm, Node 24 LTS | Local iteration and a static production bundle. Node runs during development/build, not on the phone. |
| Rendering | Three.js `WebGLRenderer` | Direct control over the small 3D scene, camera, materials and animations. |
| Simulation | Small TypeScript model of movement, spin, tilt and contact | Prioritise readable, tunable behaviour; validate the approximation against a Jolt experiment. |
| Interface | HTML/CSS over the canvas | A few menus and controls do not yet justify React or a component library. |
| Launch input | Pointer Events | Translate a selected grip and measured gesture into launch conditions. |
| Art | Procedural starter geometry; GLB for authored assets | Get the spin readable first; add a hand with two clips when its motion can match the input. |
| Sound | Web Audio API | Short, event-driven launch/contact/scrape/fall sounds. |
| Progress | Versioned local storage | Settings, selected build, best spin and the small unlock. |
| Verification | Vitest, Playwright and real iPhone Safari | Simulation checks, browser-flow checks and actual device validation serve different purposes. |
| Delivery | GitHub Actions → GitHub Pages | Build and publish static output from a reproducible repository state. |

This is a scoped recommendation, not a measured performance ranking. Official renderer, deployment and runtime references support the capabilities below.[^1][^2][^3]

## Rendering alternatives

| Candidate | Why it is viable | Decision for this prototype |
| --- | --- | --- |
| **Three.js + TypeScript** | Explicit scene/frame control and glTF animation support | Preferred: few objects and screens, direct code iteration. |
| React + React Three Fiber | Strong UI composition with a Three scene and frame hooks | Revisit if the workshop becomes a substantial application. Continuously changing poses still need imperative frame updates. |
| **Babylon.js** | Integrated rendering, animation, GUI, audio and inspection tools | Strongest integrated alternative if those tools save more work than the direct scene costs. |
| PlayCanvas | Browser-oriented engine; standalone npm/Vite development is supported | Viable if its entity/component workflow or editor becomes useful. Cloud-editor use is optional. |
| Godot | Current mobile web export, editor and native-game workflow | Extra export/toolchain surface without an established Godot project to benefit from it. |
| Unity | Current Unity 6.0 docs support iOS Safari 15+ | Viable, but there is no existing Unity asset/code workflow to justify adopting it here. |

The comparison is grounded in the projects' official APIs and export documentation.[^4][^5][^6][^7] None was rejected on an invented bundle-size comparison or a blanket claim that mobile web is unsupported. The [rendering comparison](rendering-stack-comparison.md) records package compatibility and deeper tradeoffs.

**Choose WebGL2 initially.** Safari 26.0 ships WebGPU. Three's r186 manual nevertheless labels its WebGPU renderer experimental and recommends WebGLRenderer for pure WebGL2 applications. Two tops, a desk and a hand do not demonstrate a need for another backend/material path. A later comparison should use identical scenes and measured frame times.[^1][^8]

Keep the camera stable and make the eraser profile, exposed tip and lean readable before adding expensive effects. Use simple lighting and restrained shadows. Three's GLTFLoader and AnimationMixer support authored models and clips, so choosing the smaller rendering library does not prevent a rigged hand.[^2] The first geometry can be built in code; art-tool selection need not block the physics experiment.

## The difficult decision: how to simulate an eraser top

A spinning eraser is an asymmetric body supported on a small tip. Translation, rotation, tilt and surface contact interact. Loose fit and rubber deformation add behaviour that a single rigid body cannot represent by itself. A library advertising angular velocity and collisions does not establish that this particular toy will behave convincingly.

| Approach | Relevant evidence | Recommendation |
| --- | --- | --- |
| **Reduced TypeScript simulation** | A proposed approximation, with explicit coupled movement/spin/tilt/contact state | Preferred starting model; it must pass the visual and collision tests below. |
| **JoltPhysics.js** | JS bindings expose gyro, mass, sleep and angular-speed settings; linear-cast CCD does not sweep rotation | Preferred full-3D comparison. |
| Rapier 3D | Current Rust core has gyroscopic correction; recent TypeScript release changed CCD and defaults | Credible alternative, but exact installed JS-package behaviour needs verification. |
| Babylon Havok | Web API exposes useful rigid-body controls; inspected public interface does not settle top-specific gyro/rotational-CCD behaviour | Consider with Babylon, without treating missing documentation as proof of missing capability. |
| cannon-es | Inspected integrator omits the gyroscopic cross term and automatic inertia uses an AABB approximation | Weak fit for an asymmetric physical-top foundation. |

These findings come from the engine settings, bindings and implementation, rather than collision demos alone.[^9][^10][^11][^12] The [physics comparison](physics-stack-comparison.md) contains the detailed source audit.

### What the proposed model must preserve

Maintain one authoritative state containing desk position/velocity, spin phase/rate, tilt direction/magnitude and contact mode. Assembly and gesture define initial conditions; after release, only the simulation changes the spinner. Rendering and sounds consume its state/events.

Impacts must alter movement and balance as well as spin. A body brushing a corner should not feel identical to every other contact. Start with simple collision envelopes, then test whether they erase the meaningful difference between rectangular bodies. Visible wobble must follow state; a cosmetic animation attached to an unrelated countdown would miss the mechanic.

Represent a shallow dent as a visible local surface feature with separate confinement and rotational-loss parameters. It must permit displacement by an impact. The remembered long spin in a dent is a hypothesis to reproduce and investigate, not evidence that every sharp tip deserves a stamina bonus. Keep centring, axis angle, protrusion and tightness separately adjustable in development so their effects can be compared without putting four unexplained sliders in the beginner flow.

This approximation has a real cost: collision geometry, tilt response, fall transitions and parameter coupling become our responsibility. It is suitable only if it retains the physical identity of the toy. If it resembles sliding pucks with rotating textures, reject it. No claim is made that writing this model is automatically easier than configuring Jolt.

### Why a general engine is not an automatic answer

Jolt is the clearest full-3D experiment because its relevant settings are exposed. Nevertheless, its linear-cast collision mode holds the starting orientation during the sweep; fast rotating elongated shapes can still miss contact.[^9] Rapier's recent changes also matter: its TypeScript 0.20.0 changelog records default sweeps against fixed colliders and substantial solver changes. Older blanket advice to enable CCD and expect the problem to disappear is insufficient.[^10]

Use one small comparison scene with the same shapes, launches and camera. Check a tilted supported top, fast opposing tops, a grazing corner, a desk edge and a dent. Inspect energy growth, contact jitter, angular caps and sensitivity to timestep. Choose Jolt if it gives substantially more convincing behaviour without persistent solver repairs. Choose the reduced model if it preserves the required causes while making tuning clearer. Keep only the winning approach in the game; do not build a permanent multi-engine framework.

## Application structure and game-loop ownership

Use a small set of ordinary modules:

| Responsibility | Owns |
| --- | --- |
| Build model | Part geometry/parameters and the assembled result |
| Launch input | Gesture samples, selected grip and validated launch conditions |
| Simulation | Fixed-step state changes, contacts, stop/fall events |
| Match rules | Countdown, round result, best of three, retry and unlock |
| Bot | Legal prelaunch choices from the same input limits as the player |
| View | Three scene, hand animation and state-driven visual/audio feedback |
| Save adapter | Versioned progress, validation and recovery |

This separation allows headless simulation tests and later networking work without tying outcomes to meshes or menus. It does not require an entity-component framework or a global state library.

Proposed flow: `ready → gesture → countdown → spinning → result`. Cancelled input returns safely to ready. A held gesture must not launch after a resize or interrupted touch. The bot chooses before the round; it does not secretly apply forces after release. Seeded bot choices make comparisons repeatable without promising cross-browser bitwise determinism.

Use a fixed simulation step and interpolate presentation independently. Compare 60 and 120 simulation ticks per second in the experiment; neither is established as sufficient yet. Bound catch-up work, and pause on hidden tabs instead of integrating a large missing interval on return. Browser background scheduling makes this a practical requirement.[^13]

Define a stop through a sustained stopped/toppled condition and define a fall through loss of desk support. Exact thresholds and ties need to be written into match rules and tested. Rendering speed and an engine's sleeping heuristic must not select the winner. Sparse encounters on a flat desk are an arena/launch design issue: tune the already accepted placement and directional release before considering any change to the control rule.

## iPhone implementation requirements

Apple lists adaptive refresh up to 120 Hz for iPhone 17; that is a display capability, not a game frame-rate guarantee.[^14] The first published slice should be tested on the actual device with its OS/browser recorded.

Use one pointer stream, capture it during the gesture and handle cancellation. Pointer Events identifies contacts, not anatomical fingers; unsupported pressure has a standardized fallback. Grip must therefore be selected explicitly, with path and timing determining the launch. Apply `touch-action: none` only to the relevant play surface and keep important gesture paths away from operating-system edge gestures.[^15]

Protect controls with safe-area insets and resize the canvas/input mapping with its container. The game should work with Safari controls visible, without requiring fullscreen, orientation lock or Home Screen installation.[^16] Visual cues can show placement, direction and release quality; precise feedback should only claim causes that the simulation can establish.

Activate audio on an explicit start interaction, observe suspension/interruption and allow muted play if resumption fails.[^17] Pause incomplete gestures and rounds on interruption. Treat graphics-context loss as a recoverable pause rather than allowing an invisible match to finish.

Use a small, versioned local save, written at meaningful transitions. Recover from invalid/missing data and storage failures to a viable starter. WebKit documents best-effort storage and eviction, so local progress is not permanent cloud storage.[^18] Namespace the save key for this project: Pages project paths under the same host are not separate origins. Accounts, cloud sync and IndexedDB-sized replay storage are unnecessary initially.

Proposed targets, **not measured results**:

- 60 fps presentation in ordinary battles, with effective pixel ratio initially capped at 1.5 and compared against 1 and 2 on device.
- At most 5 MB compressed resources required for the first guided match; interaction within five seconds under a recorded 10 Mbps connection.
- Ten minutes of repeated rounds without persistent frame degradation, growing resource use or broken resume behaviour.
- Successful gesture cancellation, screen rotation, tab switching, audio recovery and reload after a saved unlock.

These targets should be revised from measurements rather than treated as hardware guarantees. The [iPhone requirements](iphone-runtime-requirements.md) give the detailed test protocol.

## GitHub and Pages deployment

GitHub Pages serves static HTML, CSS and JavaScript from repository content or a build workflow. That fits this local bot game. A future service for authoritative online matches or cloud accounts would need separate runtime infrastructure; Pages can continue serving its client.[^19]

Recommended delivery path:

1. Keep source, exported assets and the dependency lockfile in the repository.
2. Validate changes with type checking, meaningful tests and the production build.
3. On a push to the chosen default branch, build with GitHub Actions and publish the `dist` artifact to the `github-pages` environment.
4. Test the resulting HTTPS project URL on the phone from the first playable slice.

For a project site, Vite's `base` must match `/<repository-name>/`; a root site/custom domain differs. Import assets through the bundler or resolve them with the configured base. Check models, sounds, textures and any WASM in the production build. Vite's preview command is for local checking.[^3] Use one app URL with in-app state, or hash routing if routes later become necessary, to avoid depending on server rewrites.

Configure the publishing source as Actions, keep validation on pull requests, and grant deployment permissions only to the publishing job. GitHub documents `pages: write`, `id-token: write`, an artifact and the deployment environment as part of this workflow.[^20] Pin verified Action revisions when creating the workflow; documentation examples and release majors can differ.

WASM is compatible with static hosting: it can be fetched as an asset. If Jolt wins the experiment, start with a single-thread build and verify initialization at the actual repository URL. Emscripten pthread builds require shared memory and cross-origin isolation, so avoid making those hosting features a prerequisite. An ordinary message-passing worker is a separate option if profiling later justifies it.[^21]

Pages is available for public repositories on GitHub Free; eligible paid plans also support private repository sources. Its documented limits include a 1 GB published site and a soft 100 GB monthly bandwidth limit.[^19][^22] These are service limits, not a traffic forecast. Repository owner/name and visibility remain deployment details; no repository or live site has been created for this research.

## Version evidence and reproducibility

The following official release records were checked on **11 September 2026**. They are candidate versions, not an installed and verified dependency graph. Use explicit compatible packages and commit the lockfile during implementation. Re-check changing release information at that point.

| Component | Observed evidence | Consequence |
| --- | --- | --- |
| Vite | [8.3.0 release](https://github.com/vitejs/vite/releases/tag/v8.3.0), 10 September 2026 | Distinguish Vite releases from the separate create-vite package in the same repository. |
| Node | [24 LTS](https://nodejs.org/en/about/previous-releases) | Use the LTS build runtime and pin its chosen patch. |
| Three.js | [r186 / 0.186.0](https://github.com/mrdoob/three.js/releases/tag/r186) | Align the installed package and matching type declarations. |
| Vitest | [5.0.0](https://github.com/vitest-dev/vitest/releases/tag/v5.0.0) | Its documented Node/Vite ranges fit Node 24 and Vite 8; still run the installation and tests. |
| R3F, if later used | [9.7.0 stable](https://github.com/pmndrs/react-three-fiber/releases/tag/v9.7.0) | Tagged manifest requires React `>=19 <19.3`; do not mix v10 alpha examples into it. |
| Other rendering candidates | [Babylon 9.26.0](https://github.com/BabylonJS/Babylon.js/releases/tag/9.26.0), [PlayCanvas 2.22.1](https://github.com/playcanvas/engine/releases/tag/v2.22.1) | Recorded for comparison; not proposed dependencies. |

TypeScript compiler and Playwright package versions have not been selected. Jolt's package version would be selected and pinned only for its experiment. Latest source inspection is not evidence that every published binary has identical defaults. Vite transpiles TypeScript without type-checking it, so run `tsc --noEmit` separately.[^23]

Observed Actions release majors are checkout 7, setup-node 7, configure-pages 6, upload-pages-artifact 5 and deploy-pages 5. Their official release pages are the source of truth for the exact revision used in the eventual workflow.[^24]

## Experiments that settle the remaining decisions

| Sequence | Build only enough to answer | Pass condition / reason to change direction |
| --- | --- | --- |
| 1. One-top comparison | Gesture, one body/tip, desk, lean/wobble; reduced model and Jolt experiment | Stable supported spinning, readable decay and repeatable launch improvement. Reject numerical energy growth or a model that feels like a puck. |
| 2. Two-top battle | Bot launch, impacts, edge, stop/fall result and retry | Contact is reliable; visible causes explain outcomes; different rendering rates do not alter the same fixed-step result. |
| 3. Construction and surface | Small part set, rework and one visible dent | Meaningful tradeoffs, no effortless dent invulnerability, and no unexplained fit randomness. |
| 4. Guided first play | Starter cue, one battle and workshop introduction | Newcomers can act after the cue and identify a useful next adjustment after a loss. |
| 5. Small complete loop | Best of three, longest spin, one unlock and local save | Both audiences can judge whether they want another attempt; published iPhone behaviour meets measured budgets. |

Deploy the first useful slice, then continue testing the live Pages build throughout this sequence. A long local-only implementation would postpone the most relevant platform evidence.

Vitest should cover rules, valid launch bounds, cancellation-related state transitions, save recovery and simulation invariants. Compare fast contacts and identical inputs across frame schedules; visual behaviour also needs inspection. Playwright should check loading, first launch, result/retry and asset errors in Chromium and WebKit. Its WebKit build is not branded Safari or the phone's GPU/runtime, so it cannot replace on-device checks.[^25]

The unresolved questions are now empirical: whether the gesture teaches a skill, whether the tops collide often enough, whether fit and surface effects are readable, and whether the result invites a rematch. The stack recommendation provides a way to test those questions without committing the prototype to a large engine or service architecture.

## Sources

Primary project documentation, source code and release records were checked on 11 September 2026. Unversioned manuals and `main`/`master` source links can change. Statements about suitability are engineering judgments; performance targets and simulation parameters are proposed experiments.

[^1]: Three.js maintainers, [WebGLRenderer API](https://threejs.org/docs/pages/WebGLRenderer.html), unversioned, and [WebGPU renderer manual at r186](https://raw.githubusercontent.com/mrdoob/three.js/r186/manual/pages/webgpurenderer.html). Renderer backend, loop, diagnostics and versioned migration guidance.
[^2]: Three.js maintainers, [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) and [AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html), unversioned. Asset and animation support.
[^3]: Vite maintainers, [Deploying a static site](https://vite.dev/guide/static-deploy) and [Static asset handling](https://vite.dev/guide/assets), current documentation. Build output, Pages base paths and asset handling.
[^4]: pmndrs, [R3F Canvas API at v9.7.0](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/docs/API/canvas.mdx), [performance guidance](https://r3f.docs.pmnd.rs/advanced/pitfalls) and [tagged package manifest](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/packages/fiber/package.json). Lifecycle and peer compatibility.
[^5]: Babylon.js project, [specifications](https://www.babylonjs.com/specifications/) and [ES-module documentation source](https://github.com/BabylonJS/Documentation/blob/master/content/setup/frameworkPackages/es6Support.md). Integrated capabilities and package workflow.
[^6]: PlayCanvas, [standalone engine workflow](https://developer.playcanvas.com/user-manual/engine/standalone/) and [graphics backends](https://developer.playcanvas.com/user-manual/graphics/). Local code workflow and browser rendering.
[^7]: Godot contributors, [stable web export documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html); Unity, [Unity 6.0 web browser compatibility](https://docs.unity3d.com/6000.0/Documentation/Manual/webgl-browsercompatibility.html). Mobile web support and export constraints.
[^8]: WebKit, [WebKit features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/). Shipped WebGPU support on iOS and other Apple platforms.
[^9]: Jolt project, [BodyCreationSettings](https://jrouwe.github.io/JoltPhysics/class_body_creation_settings.html), [JavaScript bindings](https://github.com/jrouwe/JoltPhysics.js/blob/main/JoltJS.idl) and [MotionQuality source](https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Body/MotionQuality.h). Gyroscopic configuration and rotational sweep limitation.
[^10]: Dimforge, [Rapier rigid-body implementation](https://github.com/dimforge/rapier/blob/master/src/dynamics/rigid_body.rs), [TypeScript body interface](https://github.com/dimforge/rapier/blob/master/typescript/src.ts/dynamics/rigid_body.ts) and [TypeScript changelog](https://github.com/dimforge/rapier/blob/master/typescript/CHANGELOG.md), including 0.20.0 dated 8 August 2026. Gyroscopic implementation, API differences and changed CCD defaults.
[^11]: BabylonJS, [Havok web runtime package](https://github.com/BabylonJS/havok/tree/main/packages/havok). Public web API evidence and its limits.
[^12]: pmndrs, [cannon-es Body implementation](https://github.com/pmndrs/cannon-es/blob/master/src/objects/Body.ts). Integrator and approximate mass-property calculation.
[^13]: WebKit, [How web content can affect power usage](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/). Inactive-page scheduling and power behaviour.
[^14]: Apple, [iPhone 17 technical specifications](https://www.apple.com/iphone-17/specs/). Hardware capability, not application performance evidence.
[^15]: W3C, [Pointer Events Level 3](https://www.w3.org/TR/pointerevents3/). Pointer identity, pressure fallback, capture, cancellation and touch-action.
[^16]: WebKit, [Designing websites for edge-to-edge iPhone screens](https://webkit.org/blog/7929/designing-websites-for-iphone-x/). Viewport fit and safe-area handling.
[^17]: MDN, [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) and [BaseAudioContext state](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state). Activation and interruption handling.
[^18]: WebKit, [Updates to storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/); MDN, [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Eviction policy and origin-scoped persistence.
[^19]: GitHub, [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). Static hosting, project URLs and plan availability.
[^20]: GitHub, [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Build artifacts, deployment permissions and environment.
[^21]: Jolt, [JavaScript packaging and initialization](https://github.com/jrouwe/JoltPhysics.js); Emscripten, [Pthreads support](https://emscripten.org/docs/porting/pthreads.html). WASM loading variants and shared-memory deployment requirements.
[^22]: GitHub, [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Published size and bandwidth limits.
[^23]: Vite, [Features: TypeScript](https://vite.dev/guide/features); Vitest, [Getting started](https://vitest.dev/guide/). Transpilation versus type checking and current runtime requirements.
[^24]: GitHub Actions release records: [checkout](https://github.com/actions/checkout/releases), [setup-node](https://github.com/actions/setup-node/releases), [configure-pages](https://github.com/actions/configure-pages/releases), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact/releases), [deploy-pages](https://github.com/actions/deploy-pages/releases). Current workflow action versions.
[^25]: Microsoft Playwright, [Emulation](https://playwright.dev/docs/emulation) and [WebKit browser documentation](https://playwright.dev/docs/browsers#webkit). Automated browser capabilities and platform boundaries.
