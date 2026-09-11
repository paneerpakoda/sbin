# Sbin — rendering and application stack comparison

Researched 11 September 2026 against official documentation, source repositories and release pages. This is an architecture recommendation for the [prototype brief](prototype-brief.md), not an implemented or benchmarked game. Scope: two eraser/refill-tip spinners, one desk, an animated launch hand, a bot, a small workshop and mobile browser play tested first on the user's iPhone 17. Guided launch first is accepted; visual guidance will be tested. GitHub Pages is the requested host.

## Recommendation

**Use TypeScript, Vite and Three.js with its WebGLRenderer, plus ordinary HTML/CSS UI.** Keep the simulation independent of the renderer. This recommendation follows the narrow scene and small number of screens: direct control over the launch-to-simulation-to-animation sequence matters more here than a large scene editor or a declarative component ecosystem. Babylon.js is the strongest integrated alternative. React Three Fiber becomes attractive if the workshop and menus grow substantially or an existing React application is introduced.

This is a workflow judgment, not evidence that Three.js is inherently faster or that other engines cannot handle the scene. No candidate was benchmarked. Download sizes, thermal behaviour and frame times must be measured using the same content on the actual iPhone.

## Current evidence and version boundaries

| Candidate | Authoritative release evidence observed today | Documentation boundary |
| --- | --- | --- |
| Three.js | [r186](https://github.com/mrdoob/three.js/releases/tag/r186); its [tagged manifest](https://raw.githubusercontent.com/mrdoob/three.js/r186/package.json) says `three` 0.186.0 | Main documentation is unversioned. |
| React Three Fiber | [v9.7.0](https://github.com/pmndrs/react-three-fiber/releases/tag/v9.7.0) is labelled Latest; v10 releases shown above it are prereleases | Use tagged v9 documentation when checking behaviour; its [manifest](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/packages/fiber/package.json) requires React `>=19 <19.3`. |
| Babylon.js | [9.26.0](https://github.com/BabylonJS/Babylon.js/releases/tag/9.26.0) is labelled Latest | Documentation and its master source are unversioned. |
| PlayCanvas Engine | [v2.22.1](https://github.com/playcanvas/engine/releases/tag/v2.22.1) is labelled Latest | API pages identify v2.22.1; user manual is unversioned. |

These are observed release records, not a promise that npm dist-tags never differ. At implementation, inspect package peer requirements, install an explicit compatible set and commit the lockfile. In particular, do not combine current R3F alpha examples with a stable v9 installation.

## Browser graphics baseline

Safari 26.0 officially shipped WebGPU on iOS. Consequently, “iPhone Safari has no WebGPU” is outdated. The installed iOS/browser and successful device creation still need checking on the user's phone. WebKit's browser support announcement is not an Sbin performance test. [WebKit release article](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)

Three.js WebGLRenderer uses WebGL 2; WebGL 1 support ended at r163. Its WebGPURenderer can automatically fall back to WebGL 2 and can force that backend for testing. However, the current manual still labels WebGPURenderer experimental and recommends WebGLRenderer for pure WebGL 2 applications. It also documents different custom-material and post-processing paths. [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), [WebGPU manual at r186](https://raw.githubusercontent.com/mrdoob/three.js/r186/manual/pages/webgpurenderer.html)

**Start with WebGL 2**, because two tops and a desk do not establish a need for compute shaders or newer rendering features. Keep a future WebGPU experiment possible, without promising a drop-in migration for arbitrary shaders. A second backend would add another rendering path to verify before the core interaction has been proven.

## Candidate comparison

### Direct Three.js + TypeScript + Vite

Three provides scene objects and rendering while leaving game organisation explicit. Its documented `setAnimationLoop` controls frame updates; `renderer.info` exposes rendering statistics, and renderer disposal is explicit. For Sbin, one owner can advance the simulation, copy interpolated poses to the two visible spinners, update the launch animation and render. The simulation must use its own chosen stepping policy rather than treating each displayed frame as a fixed amount of game time. [Renderer API](https://threejs.org/docs/pages/WebGLRenderer.html)

The glTF 2.0 addon returns scenes and animation clips and supports optional Draco, Meshopt and KTX2 decoding. AnimationMixer supplies clip playback and updates. Thus, a rigged hand is supported without a separate game engine. [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html)

The main cost is writing the small amount of scene lifecycle, input routing and screen state ourselves. My recommendation is to keep these modules direct and bounded; do not build an entity-component framework for two competitors. The runtime starts with `three`; TypeScript, Vite and matching type declarations are development tooling. Introduce optional loaders or utilities only when assets require them.

### React + React Three Fiber

R3F expresses Three.js scenes as React components. Its stable API has an ordinary Three.js WebGL renderer by default, configurable renderer creation, and `always`, `demand` and `never` frame-loop modes. `useFrame` runs before rendering, supplies elapsed-frame delta, and can take over rendering through priority. It therefore does not prevent an independent simulation. [Tagged Canvas documentation](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/docs/API/canvas.mdx), [tagged hooks documentation](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/docs/API/hooks.mdx)

React is useful for reactive inventory, settings and progression interfaces. However, the R3F performance guide says fast updates belong in imperative frame-loop mutations, not React state setters. This means a physics game still needs to distinguish UI state from continuously changing positions and rotations. [Performance guidance](https://r3f.docs.pmnd.rs/advanced/pitfalls)

For this prototype, that second lifecycle and React/Fiber compatibility surface have little demonstrated payoff. The tagged package includes its own scheduling and state-related dependencies in addition to React and Three peers. This is a maintenance tradeoff, not a claim of unacceptable runtime overhead. R3F remains a viable alternative; Drei helpers would be optional additional dependencies. [v9.7.0 manifest](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.7.0/packages/fiber/package.json)

### Babylon.js

Babylon supplies an integrated scene graph, animation, audio, GUI and inspection ecosystem, with WebGL and WebGPU support. Its ES modules include TypeScript declarations; `runRenderLoop` gives an explicit render callback. Selective imports and the documented pure-import approach address tree-shaking, although side-effect registration requires care. [Specifications](https://www.babylonjs.com/specifications/), [official ES-module documentation source](https://github.com/BabylonJS/Documentation/blob/master/content/setup/frameworkPackages/es6Support.md)

Use `@babylonjs/core` plus the glTF loader when needed, with the inspector restricted to development. Its loader docs recommend dynamic loader registration and explain that compressed-asset decoders may otherwise download from Babylon's CDN; configure local decoder resources for a self-contained release. [glTF documentation source](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/importers/glTF.md)

Babylon would be my choice if integrated tooling proved more valuable than the minimal direct scene. Its broader feature set does not automatically mean a larger measured Sbin download, and integrated physics support does not validate eraser-top dynamics.

### PlayCanvas Engine, editor optional

PlayCanvas explicitly supports standalone npm development and documents a Vite/TypeScript starter. The engine owns an application with `update` callbacks; a cloud editor is not required. Its graphics documentation lists WebGL 2 and WebGPU, currently labels WebGPU beta, and documents fallback. [Standalone workflow](https://developer.playcanvas.com/user-manual/engine/standalone/), [graphics backends](https://developer.playcanvas.com/user-manual/graphics/)

GLB containers instantiate entity hierarchies, while animation state graphs can be authored programmatically and blend clips. This handles the desk, parts and hand in a local asset workflow. [ContainerResource](https://api.playcanvas.com/engine/classes/ContainerResource.html), [AnimComponent](https://api.playcanvas.com/engine/classes/AnimComponent.html)

It is a credible browser-first game engine. For Sbin, adopting its entity/component and animation graph conventions offers less immediate benefit than it would for numerous characters, levels or editor-authored content. The decision is about scope and workflow, not an editor lock-in that the standalone engine does not impose.

## Desktop-engine web exports

Godot's current stable documentation supports mobile web exports and recommends single-thread export by default; it requires WebAssembly and WebGL 2, uses the Compatibility renderer and documents Safari caveats. It does not currently offer WebGPU export. Godot 4 C# projects still cannot export to web. It is viable when a native-game/editor workflow is desired, but adds export/runtime concerns to this small browser-first project. [Godot web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)

Unity 6.0 documentation explicitly supports iOS Safari 15 and newer: rejecting it as unsupported on phones would be incorrect. I would still omit it from the first prototype because no Unity assets, C# codebase or editor workflow is already established. This is a development-scope judgment, without an invented bundle-size comparison. [Unity 6.0 browser compatibility](https://docs.unity3d.com/6000.0/Documentation/Manual/webgl-browsercompatibility.html)

## Asset and hosting consequences

Keep source art and exported GLBs in the repository, using primitives until the launch feels good. One hand with two authored clips is sufficient initially; spinner wobble should reflect simulation state. Avoid paying decoder complexity before asset measurements justify compression.

Vite builds static output and documents GitHub Pages deployment, including a repository-specific `base` and an Actions build. Imported asset URLs can be transformed for production; ensure every GLB, texture and optional decoder resolves under the Pages repository path. [Vite deployment](https://vite.dev/guide/static-deploy), [asset handling](https://vite.dev/guide/assets)

Before committing to the rendering choice, validate one production build on the iPhone: repeated launches, moving hand, wobbling tops, shadows, screen rotation, background/resume and several consecutive rounds. Measure load time and frame stability; visual complexity and rendering resolution remain tuning decisions, not facts established by documentation.
