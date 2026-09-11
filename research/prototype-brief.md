# Sbin — focused prototype brief

Draft after interview Q1–Q26. This records accepted direction, proposed scope, and experiments. The [technical recommendation](tech-stack-research.md) is complete. The first [launch experiment](../README.md) is implemented and browser-tested; physical iPhone validation and the remaining battle prototype are still pending.

## Experience to prove

A mobile browser game inspired by secondary/senior-secondary school in Ranchi. Make a spinner from an eraser and a metal pen-refill tip, learn a hand launch, and battle a bot on a school desk. Nostalgic adults and younger newcomers are equal audiences. Entry should be as approachable as the user's Penfight reference.

The test is whether constructing, launching and watching the result invites another attempt. Large progression systems and classroom crowds are unnecessary for this first test.

## Accepted decisions

| Area | Direction |
| --- | --- |
| Construction | Visibly choose and assemble an eraser body and a metal refill tip. Position, angle, tightness and depth are variables to investigate; the user has not ranked them. |
| Mistakes | Poor fit affects performance. Parts can be reworked, with unlimited prototype attempts. |
| Launch | Select a grip and perform a learnable single-finger gesture. Show the hand technique. Choose a constrained start position and a small directional release. |
| After release | No player control. Both spinners follow the game physics. |
| Arena | School desk, with the edge creating a risk of falling. Tip/surface pairing matters; dent behaviour needs testing. |
| Outcome | Stopping or leaving the playing area loses the round. Use the physical desk edge as the proposed interpretation of the user's falling-off requirement. |
| Format | Best of three. Aim initially for 15–30 seconds of spinning per round; tune from observation. |
| Secondary mode | Longest-spin challenge/practice; it can run longer than a normal battle. |
| Equipment | Strengths and weaknesses; a skilled player can keep starter equipment competitive. |
| Opponent | Bot for the prototype. |
| Progression | A simple version of rival/part progression. Larger progression design is deferred. |
| Guidance | Visual cues are preferred over tooltips. Exact guidance should be refined after testing, especially for assembly and surface interactions. |
| Presentation | Stylised 3D, stable slightly elevated view; lean and wobble must be readable. |
| Physics fidelity | Believable physical causes with tunable parameters. |
| Resources | User and Codex; no deadline. |
| First play | Begin with one guided launch using an assembled starter, then introduce assembly. |
| First test device | iPhone 17. Safari is the research baseline; installed OS/browser version is not specified. |
| Source and hosting | Source in `paneerpakoda/sbin` on GitHub; publish the build on GitHub Pages. |
| Excluded by user | Crowd reactions and related systems; revisit later. |

## Proposed smallest useful content set

These counts and flow details are recommendations, not additional accepted requirements:

- One desk with a plain region and one readable surface feature to test.
- Two eraser bodies and two metal-tip profiles, giving four combinations.
- Thumb–index and index–middle as the two represented techniques. Their input differences and performance tradeoffs must be tested, not presented as established grip rankings.
- One bot opponent and one simple part unlock to demonstrate progression.
- A test-spin action, a best-of-three battle, and a personal longest-spin result.
- Visual launch/placement cues, retry/rework actions, and understandable visual feedback for a loss; exact guidance follows testing.
- A compact desk scene; generic stationery labels are a temporary default. Dialogue and a particular historical decade can wait.
- Local prototype progress and a mouse equivalent for desktop testing are proposed conveniences; accounts, public rankings and online play are later scope.

## First-time flow

1. Begin with a correctly assembled starter spinner.
2. Show one launch cue and let the player try it immediately.
3. Introduce a bot round and explain a stop or fall in plain language.
4. Open the workshop to demonstrate a different body/tip combination and a test spin.
5. Offer another battle, practice, or the simple unlock goal.

Q24 accepts one guided starter launch before assembly. Detailed timing and tutorial sequence remain design-test choices.

## Guidance

Q25 prefers visual cues over tooltips and defers the precise solution until testing. Candidate cues include an animated launch gesture, a highlighted starting region, a placement ghost and a before/after test spin. Treat them as candidates, not a mandatory collection of tutorial features. Feedback must reflect the actual simulation state; do not invent a precise causal explanation for an ambiguous loss. Assistance should help players make a decision without silently making every choice for them.

## Experiments, not more preference questions

- Compare controlled variations in hole position, angle, tightness and depth. Keep the four variables separately adjustable for investigation; do not require four setup controls before a beginner can play.
- Compare the same tip and similar launches on a plain patch and a dent. Measure spin duration and lateral movement separately.
- Test whether a stationary dent strategy can be challenged by a directional collision.
- Test short gesture candidates for repeatability, touch comfort and visible improvement with practice.
- Check collision frequency, passive waiting, falling, wobble, stop detection and frame-rate independence.

Physical measurements and virtual tuning answer different questions. A plausible game abstraction does not validate real material values. See [tip–surface research](tip-surface-contact.md) and [physics references](physical-spinners.md).

## Technical research and remaining experiments

Q24–Q26 are answered. The [stack research](tech-stack-research.md) recommends TypeScript, Vite, Three.js WebGL2, a small independent spinner simulation, HTML/CSS UI, browser audio/local saves, and GitHub Actions deployment to Pages. These are research recommendations, not additional user decisions. Compare the proposed simulation with a small full-3D Jolt experiment before expanding content.

Source repository owner/name and installed iOS/browser version are not specified. Presentation, physics fidelity, gesture mapping, guidance and fit/surface interactions need playable validation, not another round of speculative preference questions. Supporting technical notes cover [rendering](rendering-stack-comparison.md), [physics](physics-stack-comparison.md), and [iPhone requirements](iphone-runtime-requirements.md).

## Proposed success observations

The player can launch after a short cue, understands how to win, can identify something useful to change after a loss, and voluntarily chooses to retry. Both target audience groups should be represented when the prototype is shared for feedback. No numerical conversion/retention threshold has been established.

The next proposed development step is a one-spinner launch/physics experiment, published to Pages as soon as useful for phone testing. No game implementation or GitHub Pages publication has happened during this interview.
