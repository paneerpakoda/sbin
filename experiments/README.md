# Jolt comparison for the first playable

Run `npm run experiment:jolt` with the pinned `jolt-physics@1.1.0` dependency. The script initializes a single-threaded WASM runtime in Node, simulates eight ten-second cases and writes `jolt-results.json`. It runs outside the shipped browser bundle.

## Configuration

The supported top uses an eraser box and a tapered tip with dimensions from the scene at the time of the experiment. Units are arbitrary game-scene units, not measured millimetres/material properties. The desk has friction 0.35, restitution 0, gravity 9.81; angular damping is 0.04. Sleeping is disabled and the angular-speed cap is raised to 250 rad/s. Initial spin is 85 rad/s with an initial lean of 0.08 radians. The model omits deformable rubber and loose-fit motion.

The separate free-box probe disables gravity and damping and starts with angular velocity across three axes. It uses the box shape's native inertia diagonal and compares rotational energy and the world angular-momentum vector over time. These conservation diagnostics apply only to the free box, not the supported top with friction, gravity and translation. `toppledAt` in the free-box record means the local up vector passed 60 degrees; a free body does not literally topple onto anything.

## Observed results

In this run, the supported top with gyroscopic force enabled finished ten seconds at about 53–54 rad/s. Its final lean was 20.82 degrees at 60 Hz, 5.09 degrees at 120 Hz and 5.11 degrees at 240 Hz. It stayed below the 60-degree threshold in all three cases. With the gyro flag disabled, it settled upright while continuing to spin. These results show why contact, spin and timestep must be inspected together; they do not validate real eraser behaviour.

The high-speed free-box probe did not meet the desired conservation check. With gyroscopic force enabled, the maximum absolute energy deviation was approximately 29% at the tested step rates. At 120 Hz the momentum-vector deviation reached approximately 87%; at 960 Hz it was approximately 13%. The no-gyro case kept energy essentially constant but changed the momentum vector by approximately 14%. Absolute energy deviation is not the same as measured energy growth. Further work would need to establish an appropriate numerical regime and verify the harness against additional reference cases before drawing conclusions about Jolt generally.

Elapsed milliseconds in the JSON are local CPU timings that include JavaScript inspection overhead. They are not browser, rendering or iPhone benchmarks.

## Provisional decision

Keep the reduced model in the first shared launch experiment. Its spin decay, fit effect, stop/fall outcomes and frame-schedule independence have direct unit checks. That earns a useful playtest, not a physical-fidelity claim. The Jolt configuration remains a reference experiment; it has not passed a visual, two-top collision or on-device comparison. No permanent engine decision is established until those questions are tested.

The next meaningful evidence is whether a player can learn the gesture, read the wobble and choose a useful adjustment. If the approximation feels like a sliding puck or looks physically disconnected, revise or replace it before expanding the battle content.

Primary API reference: the installed package declarations and [JoltPhysics.js](https://github.com/jrouwe/JoltPhysics.js). The [physics research](../research/physics-stack-comparison.md) records the broader engine comparison.
