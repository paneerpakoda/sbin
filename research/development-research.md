# Sbin: school eraser-spinner game — initial research

Researched 11 September 2026. This is a discovery brief, not an approved game specification. Recommendations and proposed experiments below are design hypotheses. The user has responded through Q26. A focused draft is in [prototype-brief.md](prototype-brief.md); the completed [technical-stack recommendation](tech-stack-research.md) covers iPhone 17 and GitHub Pages and supersedes the initial technical candidate shortlist below.

## Working concept and the decision that matters most

The user's concept is a browser game in an Indian school setting: construct spinning tops from erasers and pencil/pen tips, progress from basic worn equipment to other components, learn thumb–index and index–middle launch techniques, and compete in battles or for longest spin. The user has chosen **battles as the main mode, longest-spin challenges as a secondary mode, and mobile browser as the primary device**. The provided reference is [Penfight](https://www.penfight.xyz/).

The promising identity is **homemade assembly + hand-launch mastery + classroom rivalry**. This is a proposed direction, not a claim of proven demand or novelty. The user has clarified that the player **builds, aims, and launches, with no control after release**. They accepted constrained starting positions and a small directional release, loss by stopping or leaving the playing area, believable tuned physics, and stylised 3D with a stable elevated camera. They selected a **desk** because its edge adds the risk of falling off and its surface interacts with the tip. Timed interventions and continuous steering are outside the accepted core mechanic. Construction, opponent reading, placement and launch must therefore carry the player's strategic and execution skill.

Supporting research is in [game comparables](game-comparables.md), [physical spinners](physical-spinners.md), and the follow-up [tip–surface contact study plan](tip-surface-contact.md). Those notes distinguish creator claims, direct observations, physical facts, and unverified details. The contact follow-up separates lateral confinement from rotational energy loss and proposes surface, fit and collision comparisons; no specimen measurements have been made.

## What was actually observed at penfight.xyz

The web text-fetch tool could not retrieve the site, but the in-app browser loaded it. These are observations of its interface and a published rules article on the research date; a complete match and its multiplayer service were not tested.

| Observed element | What it suggests for Sbin — interpretation |
| --- | --- |
| Entry instruction uses a simple pull-back-and-release action. | A tactile verb should be understandable before explaining inventory or progression. |
| Solo Class Championship presents 11 rivals and a Trimax prize. | An ordinary school possession can be a concrete, emotionally legible reward. |
| Interface offers local 2–6 players on one screen, instant online 2–3 players, and friend links for 2–3 players. | These are separate delivery and interaction problems; their presence in a reference does not make all of them necessary for Sbin's first version. |
| Solo entry requests a name and says names appear on a board. | Consider whether a first practice round can start before identity entry. Inspection stopped before submitting a name. |
| Classroom imagery has wooden desks, schoolbags, a board, tiled floor, and a paper-like championship panel. | School context can carry the menus and reward presentation as well as the arena. These observations are visual references, not assets to copy. |

Sources: [live entry and championship interface](https://www.penfight.xyz/); [the site's rules article](https://www.penfight.xyz/blog/how-to-play-pen-fight/), marked updated 1 September 2026. The article describes alternating pen flicks with time for objects to stop. That is different from simultaneously spinning tops, so Sbin cannot transfer the interaction loop unchanged.

## A useful primary cultural reference

Matthew Kam's 2008 Berkeley dissertation documents Pen Fight during research on traditional games in India: two players flick pens on a table, attempting to knock the opponent's pen off while keeping their own on it. See printed page 154, PDF page 168. This provides historical evidence for the school-tabletop reference; it does **not** establish nationwide participation, current demand, or the prevalence of eraser tops. [Berkeley dissertation](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-155.pdf)

The user chose **both nostalgic adults and school-age players equally, with no primary audience**. This is an accepted direction. Its design implication is that school memories can enrich the experience, but understanding the game cannot depend on having those memories. Test comprehension and enjoyment with both groups separately.

The user supplied a first-person memory of school in a small Indian city, and chose **Ranchi**, where they are from, as the setting anchor. Their later Q23 clarification sets the game's school stage to **secondary and senior secondary**. They remember finding a well-shaped eraser of a suitable intermediate size, choosing a good pen nib, and the importance of the hole used to fit the nib. Play happened on desks and floors; slanted or uneven desks could spoil a spin. They also remember girls gathering around and being impressed. These details are evidence of the user's own experience, not claims about every Indian school.

The user clarified that the nib is **the metal part of a pen's ink refill, not a fountain-pen nib**. Hole position, angle, tightness and depth all mattered in their experience; they cannot rank the most important without testing. Poor assembly prevented the parts from reaching their potential and could waste an otherwise good eraser/tip. In Q18 the user accepted reduced performance with freely reworkable parts and unlimited prototype attempts, rather than permanent in-game material loss.

The user also recalls that different tips suit different surfaces and that a very sharp tip could settle into a desk dent and spin for a long time. They prefer the desk for this interaction and for the risk of falling off. The dent effect is a user-supplied observation to investigate, not a measured universal rule or permission to make every sharp tip dominant.

Design interpretation: selecting materials, achieving a good fit, and reading the desk are strong parts of the intended experience. Classmates' attention is a possible later theme, but Q22 explicitly excludes crowd reactions and related systems from the prototype as unnecessary work. A specific historical period has not been supplied; secondary/senior-secondary identifies a school stage, not a decade. Dialogue language is unspecified and can be deferred with crowd/banter content. Additional classroom cues remain optional art candidates, not scope commitments.

Q19 adds a firm usability requirement: players need guidance to avoid confusion, with Penfight's ease of play as the benchmark. Do not interpret the earlier exploration discussion as approval for opaque surface rules or a complex unassisted workshop. Exactly how much assistance to give is part of the remaining onboarding decision.

## Browser input: techniques need a designed translation

Pointer Events support mouse, stylus, and touch, including multiple simultaneous contacts. A pointer ID identifies an active contact; it does not label an anatomical finger. Pressure is hardware-dependent, with a specified fallback when unsupported. Consequently, this game should not promise to recognise thumb–index versus index–middle from standard browser input, and pressure should not be its only measure of launch strength. [W3C Pointer Events](https://w3c.github.io/pointerevents/), [MDN PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)

Three candidate translations of the accepted launch-only mechanic:

1. **Select a grip, then perform one gesture.** An animated hand shows the chosen grip; drag/release determines power, heading, and consistency. This is a plausible common language for mouse and touch.
2. **Different gesture shapes for different grips.** For example, a curved sweep and a short flick; names and performance remain design choices until grounded in the user's intended techniques.
3. **Optional two-contact twist on touchscreens.** More literal contact movement, but needs an equivalent desktop action and testing for hand occlusion, comfort, and accidental browser gestures.

Accepted in Q8: select a grip, perform a learnable single-finger gesture, and show the technique with an animated hand. The exact gesture and mapping to launch properties remain open. Gesture complexity should earn its place through enjoyment and repeatable improvement. Do not present an arbitrary grip bonus as an established physical fact.

Implementation concerns to carry into a future prototype: use pointer capture through release, handle cancellation without accidentally launching, and restrict browser touch handling in the game surface. MDN provides a multiple-contact reference implementation. [MDN multi-touch guide](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Multi-touch_interaction)

## Physics and rendering: decide the experience before the engine

| Candidate | Verified capability | Implication for this game — inference |
| --- | --- | --- |
| Phaser with Matter | Phaser is a browser-focused 2D framework. Matter supports more complex bodies and constraints than Arcade Physics. | Good candidate for a top-down prototype; genuine 3D lean and tip-over would need a separate model or authored presentation. |
| A 3D renderer with Rapier 3D | Rapier provides browser/WASM bindings, rigid-body dynamics, mass properties, contacts, angular velocity and damping. | A candidate when visible tilt, wobble, and falling onto an eraser face are central. It is not proof that soft eraser contact and spinning tips will behave convincingly without calibration. |

Sources: [Phaser's scope](https://phaser.io/why-phaser), [Phaser physics overview](https://docs.phaser.io/phaser/concepts/physics), [Rapier](https://www.rapier.rs/), [Rapier rigid bodies](https://rapier.rs/docs/user_guides/javascript/rigid_bodies/), [angular damping API](https://www.rapier.rs/javascript3d/classes/RigidBodyDesc.html).

Accepted in Q16–Q17: believable physics with tunable parameters and stylised 3D with a stable, slightly elevated camera so the nib, lean and near-toppling are visible. The table above preserves the research comparison; top-down 2D is not the chosen presentation. A 3D-looking scene does not itself require that every aspect of play use an unrestricted 3D simulation. A deliberately simplified model may communicate launch quality and collisions more consistently. The engine remains unselected.

Important engineering evidence:

- Rapier's older CCD guide and recent implementation differ. The TypeScript 0.20.0 changelog records default sweeps against fixed colliders and changed solver behaviour. Validate the pinned JavaScript package with two fast rotating tops; a blanket claim that CCD is disabled by default is no longer reliable. See the [current physics source audit](physics-stack-comparison.md) and [TypeScript changelog](https://github.com/dimforge/rapier/blob/master/typescript/CHANGELOG.md).
- Rapier documents a fixed timestep as the common approach. Keep simulation outcomes independent of rendering rate; test identical launches at different display frame rates. [Integration parameters](https://rapier.rs/docs/user_guides/javascript/integration_parameters/)
- Rapier's determinism guarantees depend on the package feature variant as well as engine version, initial conditions, construction order and input calculations. Its TypeScript changelog separates deterministic packages from default builds. This does not make the entire game automatically deterministic or cheat-resistant. [Determinism guide](https://rapier.rs/docs/user_guides/javascript/determinism/), [package changes](https://github.com/dimforge/rapier/blob/master/typescript/CHANGELOG.md)

## Multiplayer: the launch rule changes the architecture

For the accepted launch-only design, players could privately choose parts and a launch, commit both choices, then run a shared countdown and reveal. This is a **design proposal**, particularly useful if pass-and-play otherwise lets the second player react to the first. Whether players should see each other's builds is still unresolved.

Online competition should validate legal equipment and launch parameters and determine results on a trusted server if ratings or persistent rewards matter. Synchronising launch timing and handling disconnections remain necessary even without later control. Do not assume sending a seed to both browsers is sufficient validation.

Colyseus is one candidate: its documentation assigns state mutation to the server and sends changes to clients in a room. This provides networking infrastructure, not a finished fairness policy. [Colyseus state synchronization](https://docs.colyseus.io/state)

Accepted in Q10: the first prototype opponent is a **bot**. Same-device play, private friend rooms, public matchmaking, asynchronous records and leaderboards are future explicit choices. Public matchmaking also requires enough concurrent players; no traffic estimate has been established here.

## Design tensions to resolve through the interview

These are open problems, not additional questions the user must answer in the first round.

- **Launch-only excitement:** players must see how aim, balance and spin affect the result. Long periods with no collisions or decisions may undermine replayability. The game needs playtesting, not an assumed attention span.
- **Upgrade strength versus competitive fairness:** Q9 accepts keeping the starter competitive through skill and favourable matchups, with strengths and weaknesses in upgraded parts. Concrete part tradeoffs and any equipment classes remain to be defined.
- **Worn starter versus attachment:** an old eraser can be visually humble without being useless forever. Customisation and mastery may let a player keep a favourite.
- **Physical truth versus readable outcomes:** a loss should have an observable explanation, such as poor launch alignment, a risky edge approach, or a hard collision. Avoid inventing precision percentages for causality the simulation cannot establish.
- **Battle versus longest-spin balance:** one mode rewards contact and another rewards conservation. They may need different records, part classes and arena rules rather than a single universal “best build.”
- **Desk encounter design:** the user selected a desk. A flat open desk will not necessarily pull tops into repeated collisions the way a bowl-shaped arena can. Test the accepted constrained placement and directional release. The user's emphasis is on falling off the desk; exact edge and stop thresholds remain rule details to settle.
- **School atmosphere scope:** crowd reactions and related systems are explicitly deferred in Q22. Do not expand the prototype with spectators, reputation reactions or interruptions.
- **Progression scope:** Q21 accepts a simple version of the recommended rival/part progression, with the broader progression design explicitly deferred. A small unlock can exercise the loop; it is not approval for a large campaign or shop economy.
- **Component fit:** metal refill tip is established; centering, angle, tightness and depth all matter in the user's memory. Their relative importance is an experimental question, not another preference question to put back to the user.
- **Dent dominance:** a tip that stays in one favourable dent and outlasts everything could collapse battle strategy into one optimal choice. Test displacement by impact, repeatable access to useful patches and different opponents. Do not assume a drawback from tip sharpness alone.

## Proposed validation sequence, after shared understanding

The user chose a **focused playable prototype to test the idea** as the first deliverable, built by **the user and Codex, with no deadline**. No separate asset-production help or budget has been specified. They accepted visibly choosing and assembling an eraser body and tip, while confirming that positioning and modifying components are in the direction of the longer-term vision. Fit variables should remain separately adjustable for experiments; beginner-facing controls need testing. This does not automatically approve a full crafting simulation. No prototype has been built; the detailed sequence below is proposed, not approved.

1. Compare launch interactions using one spinner and one surface. Look for intentional improvement and understandable mistakes, not only successful input registration.
2. Add one opponent on the same surface. Observe collision frequency, passive waiting, result clarity and the desire to replay. Compare a flat desk with a constrained arena if encounters are sparse.
3. Introduce a small set of visibly different bodies/tips. Check whether players can predict and explain a tradeoff, and whether any option dominates both battles and endurance.
4. Add a minimal progression reward. Check whether a player wants another match because of the play, rather than only to fill a bar.
5. Test on actual target phones and a desktop: launch reliability, finger occlusion, frame rate, background/resume handling and input parity. Add online play only at the agreed scope stage.

Potential research measurements: launch attempts until first intentional result; voluntary rematches; whether players can explain a loss; dominant-build patterns under matched conditions; time spent waiting; and device-specific gesture failures. These are suggested observations, not validated industry thresholds. Audience and the absence of a deadline are established; success criteria and any asset budget remain open.

## Design tree and current frontier

The user has responded through Q26. The broad prototype direction and first-play approach are accepted. Future progression, crowd systems, a specific decade and dialogue language are deferred rather than prerequisites for the prototype. Technical-stack research is now requested.

| Root decision asked now | Status / recommendation | Decisions it unlocks |
| --- | --- | --- |
| Q1: Primary audience | **Accepted: both nostalgic adults and school-age players equally; no primary audience** | School period, regional context, humour, language, identity and audience needs |
| Q2: Player control after release | **Accepted: build, aim, launch; no control after release** | Launch skill, round pacing, arena, camera, simulation and networking needs |
| Q3: Main competition | **Accepted: battles first; longest-spin challenges secondary** | Win conditions, records, build balance, rewards and match format |
| Q4: Primary device | **Accepted: mobile browser first**; desktop support details remain open | Gesture candidates, orientation, camera, accessibility and performance targets |
| Q5: First deliverable | **Accepted: a focused playable prototype to test the idea** | Team and time constraints, fidelity, content count, online scope and validation criteria |

Second-round decisions:

| Question | Accepted answer and remaining detail |
| --- | --- |
| Q6: School memory | Ranchi; suitable eraser size/shape, good pen nib, important hole fit; desk and floor play; uneven desks spoiling a spin; classmates gathering and being impressed. Q23 narrows the school stage to secondary/senior-secondary. Exact decade is deferred; nib/fit details are clarified in Q12. |
| Q7: Construction depth | Choose and visibly assemble body plus tip for the prototype. More detailed positioning and modification fit the longer-term vision. Later answers make fit importance and beginner-facing control depth experimental questions. |
| Q8: Launch input | Select a grip and perform a learnable single-finger gesture, with animated hand feedback. Exact gesture remains open. |
| Q9: Equipment versus execution | Starter remains competitive through skill and favourable matchups; upgrades have strengths and weaknesses. |
| Q10: First opponent | Bot. |
| Q11: Delivery constraints | User and Codex; no deadline. Asset help/budget not specified. |

Third-round decisions:

| Question | Accepted answer and remaining detail |
| --- | --- |
| Q12: Nib and hole | Metal tip from the pen's ink refill, not a fountain nib. Position, angle, tightness and depth all matter; the user cannot rank them without testing. Poor physical assembly wastes potential and sometimes parts. Q18 makes prototype parts freely reworkable. |
| Q13: Surface | Desk preferred. Different tips suit different surfaces; user recalls a sharp tip settling into a dent and spinning for a long time. Staying on the desk adds a challenge. Dent effects require testing. |
| Q14: Launch | Accepted constrained starting placement and a small directional release. |
| Q15: Victory | Accepted stopping or leaving the playing area as losses. Q13 points toward the physical desk edge; precise thresholds/ties remain open. |
| Q16: Physics | Believable physical causes with tunable parameters rather than a strict physical replica. |
| Q17: Presentation | Stylised 3D and a stable slightly elevated camera. Engine remains unselected. |

Fourth-round decisions:

| Question | User response and scope consequence |
| --- | --- |
| Q18: Bad assembly | Accepted reworkable parts, reduced performance from poor assembly, and unlimited prototype attempts. |
| Q19: Surface guidance | A guide is required to prevent confusion; Penfight was easy to play. Do not make understanding surface interactions depend on unsupported discovery. |
| Q20: Pacing | Accepted a 15–30-second target for spinning per battle round and best of three; endurance attempts can be longer. These remain tuning targets. |
| Q21: Progression | Define the larger progression later; a simple implementation of the recommended rival/part progression is sufficient now. |
| Q22: Crowd | Explicitly excluded from prototype as extra work; revisit later. |
| Q23: Setting | Secondary/senior-secondary school. Calendar years and dialogue language were not supplied; defer them instead of repeatedly asking. |

Latest decisions:

- Q24: Accepted one guided launch with an assembled starter, then introduce the workshop.
- Q25: Visual cues preferred over tooltips; determine the detailed guide after testing. This supersedes a tooltip-led recommendation.
- Q26: Initial testing on iPhone 17; source should be on GitHub and build published on GitHub Pages. User explicitly requests thorough tech-stack research. Installed browser/OS version and repository owner/name are unspecified; use Safari as a stated research baseline, not a verified device fact.

The focused prototype brief and [technical recommendation](tech-stack-research.md) are complete. The recommended starting stack is TypeScript, Vite, Three.js WebGL2 and a small independent spinner simulation, with Jolt as a full-3D comparison experiment; publication uses GitHub Actions and Pages. These are recommendations pending implementation evidence. Physics calibration, exact gesture mapping, visual guidance and the relative importance of fit variables require experiments rather than further speculative preference questions. The user has intentionally deferred larger progression and crowd scope. Multiplayer, production economy, broader distribution and a detailed historical art direction belong to later product work.

## Evidence limits

This pass establishes relevant precedents, documented browser capabilities, and physical considerations. It does not prove market demand, competitors' retention or revenue, reliable device performance, universal school memories, a ranking of commercial erasers, or which finger grip is objectively superior. Hands-on play, user recollections, selected maker demonstrations and prototype measurements remain necessary.
