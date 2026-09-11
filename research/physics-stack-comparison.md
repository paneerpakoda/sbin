# Physics stack for the eraser-spinner prototype

Research checked 11 September 2026. Recommendation, not a benchmark: no engine or physical specimen was run during this investigation. Read alongside [physical-spinners.md](physical-spinners.md) and [tip-surface-contact.md](tip-surface-contact.md). The target is two spinning eraser/ballpoint-tip assemblies on a desk, stylised 3D, launch-only control, iPhone 17 Safari, and static GitHub Pages delivery.

## Recommendation

**Use a small, renderer-independent TypeScript simulation with deliberately coupled desk-plane movement, spin, tilt and contact state for the first playable prototype.** Keep a full-3D Jolt experiment as the strongest alternative to compare before committing the game to a rigid-body engine. Rapier remains a credible candidate, but recent changes make its exact JavaScript package behaviour an explicit validation requirement.

The reason is scope and controllability, not a claim that JavaScript outperforms WASM. A general engine supplies collision response and rigid motion; it does not supply convincing rubber–metal fit, a calibrated refill-tip bearing, a helpful wobble progression, or balanced desk dents. We would still own those decisions. No examined documentation proves reliable eraser-top behaviour under this game's conditions.

## Candidate comparison

| Approach | Useful advantage | Important limitation | Prototype decision |
| --- | --- | --- | --- |
| Rapier 3D / WASM | Open engine, mass properties, contacts and a gyroscopic implementation in its current Rust core | Recent CCD/default changes; JS configuration surface differs from Rust | Viable experiment; avoid an untested commitment |
| JoltPhysics.js / WASM | Explicit JS-accessible gyroscopic, inertia, sleep and angular-speed settings | Linear-cast CCD does not sweep rotation; contact tuning remains necessary | Preferred full-3D comparison |
| Babylon Havok | Convenient if Babylon is already the rendering engine | Public web API does not establish its gyroscopic behaviour or angular CCD guarantees | Do not choose it solely for this mechanic |
| cannon-es | Straightforward JavaScript integration | Inspected integrator lacks the gyroscopic correction and uses approximate inertia | Poor choice for a physical-top foundation |
| Reduced TypeScript model | Direct control over readable launch, collision, wobble and surface interactions | We must design and validate the approximation; shape fidelity is limited | Recommended starting model |

These judgments follow the source evidence below; they are not measured rankings.

## What the engines actually establish

**Rapier has gyroscopic dynamics.** Current core source contains an explicit correction based on angular momentum in the principal-inertia frame. It rescales the correction to avoid increasing momentum magnitude; this is a numerical method, not proof of exact energy conservation. The same file currently sets the builder's gyro flag to `true`, despite comments saying disabled. Its CCD description says fast dynamics sweep fixed colliders automatically; “bullet” bodies additionally sweep moving bodies, but two bullets can still tunnel through one another. Rotation is capped at approximately 45 degrees per substep unless fast rotation is allowed. [Rapier rigid-body source](https://github.com/dimforge/rapier/blob/master/src/dynamics/rigid_body.rs)

The TypeScript changelog records version 0.20.0 on 8 August 2026, upgrading to core 0.35.0 and changing CCD, sleep and contact behaviour. The inspected TypeScript body API exposes neither the gyro switch nor the fast-rotation switch. Absence of a switch does **not** prove the underlying gyro correction is absent. Pin the package and verify actual behaviour; do not paste Rust method names into JS or add a second gyro correction blindly. [TypeScript changelog](https://github.com/dimforge/rapier/blob/master/typescript/CHANGELOG.md), [TypeScript body source](https://github.com/dimforge/rapier/blob/master/typescript/src.ts/dynamics/rigid_body.ts)

**Jolt provides the clearest configurable full-3D candidate.** `BodyCreationSettings` documents `mApplyGyroscopicForce` as false by default, plus mass overrides, damping, sleeping, solver-step overrides and a maximum angular velocity. The default angular cap is `0.25 × π × 60` radians/second, so launches must be checked against it. Its JavaScript IDL exposes these settings. However, `LinearCast` casts with the starting rotation: its own source warns that long, thin, rapidly rotating bodies may tunnel. Substeps and conservative collision shapes still matter. [Jolt body settings](https://jrouwe.github.io/JoltPhysics/class_body_creation_settings.html), [JS bindings](https://github.com/jrouwe/JoltPhysics.js/blob/main/JoltJS.idl), [motion-quality source](https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Body/MotionQuality.h)

**Havok's web API leaves a material uncertainty.** It exposes mass properties, angular velocity, impulses, damping, activation control, world stepping and speed limits. These are useful, but the inspected declarations provide no explicit gyroscopic control or guarantee about rotational CCD. That is an evidence gap, not a finding that Havok cannot simulate tops. Its web runtime repository supplies compiled WASM and JavaScript rather than the solver implementation needed to settle the question through source inspection. [Havok web API and runtime](https://github.com/BabylonJS/havok/tree/main/packages/havok)

**cannon-es is easy to inspect but poorly matched.** `Body.integrate` updates angular velocity from inverse world inertia and applied torque without the gyroscopic cross term. Its automatic mass-property calculation approximates inertia using an axis-aligned bounding box. Those choices are consequential for an asymmetric eraser whose balance and mass distribution are central to play. Adding the missing rotational model would remove much of the simplicity argument. [cannon-es body implementation](https://github.com/pmndrs/cannon-es/blob/master/src/objects/Body.ts)

## What static hosting changes

WASM is a downloadable application asset, not a requirement for a backend. Rapier's compatibility package embeds it as base64 and requires asynchronous initialization; ordinary builds load a separate asset. Its recent compatibility-package files moved into `dist/`, so use the package entrypoint rather than fragile deep imports. Jolt offers separate-WASM, embedded-WASM and explicitly multithreaded variants, with a documented Vite `?url`/`locateFile` approach. Use a single-threaded variant first and resolve every asset relative to the GitHub Pages project base path. [Rapier package documentation](https://github.com/dimforge/rapier/tree/master/typescript), [Jolt packaging and initialization](https://github.com/jrouwe/JoltPhysics.js)

Emscripten pthread builds require `SharedArrayBuffer` and correctly configured cross-origin-isolation headers. A threaded binary cannot simply become a single-threaded binary at runtime. The prototype should require neither isolation nor shared memory; verify that it starts with `crossOriginIsolated === false` on its actual Pages URL. An ordinary worker using message passing is a separate option if profiling later justifies it. [Emscripten pthread documentation](https://emscripten.org/docs/porting/pthreads.html)

The repositories identify Rapier as Apache-2.0 and JoltPhysics.js and cannon-es as MIT; the distributed Babylon Havok package also includes an MIT license. Preserve applicable notices with shipped dependencies. This describes those packages, not unrelated commercial Havok SDK terms. [Rapier](https://github.com/dimforge/rapier/tree/master/typescript), [Jolt](https://github.com/jrouwe/JoltPhysics.js), [cannon-es](https://github.com/pmndrs/cannon-es), [Havok package license](https://github.com/BabylonJS/havok/blob/main/packages/havok/LICENSE)

## Proposed reduced model

Keep one authoritative simulation state: position and velocity on the desk, spin phase/rate, tilt direction/magnitude, and contact mode. Feed render transforms from that state. A launch supplies starting position, sideways velocity, spin and initial tilt; subsequent motion comes from simulation alone.

Couple impacts to translation **and** spin/tilt using contact direction, relative speed and build parameters. Avoid an unrelated stamina bar that decrements on collision. Approximate spinning silhouettes with conservative collision envelopes initially; explicitly test whether this loses the distinctive interaction of rectangular erasers before adding rotating convex outlines.

Represent a shallow dent as a visible local surface feature with tunable confinement and loss parameters. It must permit collision-driven escape; it should not be an invisible permanent joint. Treat centring, axis angle and protrusion as geometric inputs. Tightness needs an effective loss/wobble parameter until observations justify a more detailed model. A single rigid compound cannot itself simulate rubber deformation, hole enlargement or tip slippage. Generic angular damping also cannot establish real rolling or spinning-friction coefficients. These are proposed abstractions pending tests, not measured material laws.

## Decisive validation spikes and stop conditions

1. **Free rotation and supported top.** In Jolt, first test a torque-free asymmetric body, then a tilted top on a smooth desk. Log orientation, spin, angular momentum and energy with damping off and on. Compare gyro enabled/disabled. Reject a configuration with growing energy, frozen tilt, or an upright top sustained by a hidden constraint. If trying Rapier, establish its exact package defaults and angular cap first.
2. **Timestep convergence and collisions.** Use a fixed simulation tick independent of rendering. Compare candidate rates and substeps with identical launch inputs, including paired fast tops, grazing corners and desk-edge strikes. Disable sleep while a round is active; define losing from sustained stopped/toppled state rather than engine sleep. Stop tuning full 3D if ordinary launches repeatedly tunnel, jitter, or change winners merely because rendering slows.
3. **Fit and surface screen.** Compare the four fit variables separately; test smooth desk versus one shallow dent with both tips. Look for repeatable, visible differences, not an invented “best nib” ranking. Reject a dent that creates effortless invulnerability or any fit setting whose only effect is unexplained randomness.
4. **Reduced-model comparison.** Use the same launch inputs and visual assets. Choose the reduced model if players can read collision causes and improve their launch while full 3D needs extensive solver-specific repair. Reverse the recommendation if the approximation visibly behaves like sliding pucks or fails the distinctive wobble/contact test.
5. **Actual phone and Pages gate.** Measure cold initialization, physics cost, frame pacing and several consecutive matches on the user's iPhone 17. Start with a proposed 60-fps presentation target, measure thermal degradation, and test background/resume without a giant catch-up step. Reject a build that requires isolation, loses input during initialization, or cannot sustain the chosen presentation budget. No performance claim is established until this gate passes.
