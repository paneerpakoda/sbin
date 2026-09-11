# Physical eraser spinners: evidence and design implications

Research checked 11 September 2026. This note separates documented sources, anecdotal memories, and proposed game abstractions. No physical specimens were measured, and the maker videos below were located through their first-party YouTube metadata; their footage was not reviewed frame by frame.

## What is documented

The underlying stationery-top idea has recognisable precedents, but the evidence does not establish a universal Indian school game or a standard rule set.

| Source | What it supports | What it does not establish |
| --- | --- | --- |
| IB by sunil, [DIY Rubber Beyblade Tutorial Step By Step Easy](https://www.youtube.com/watch?v=09VaNFlCS0U), 7 March 2026 | A maker publishes a tutorial explicitly about a rubber Beyblade. | Exact eraser shape, construction, nib identity, grip or measured performance cannot be inferred from the retrieved title and description. |
| IB by sunil, [10₹ Handmade Rubber Beyblade From Eraser](https://www.youtube.com/watch?v=l5WCaQr9UMQ), 22 February 2026 | The maker explicitly describes an eraser-based handmade top. | “Ultimate Spin Stealing” is the creator's title, not independent measurement or a proven property of every eraser. |
| IB by sunil, [Hand Spin Rubber Beyblade Vs Handmade Beyblades Full Battle](https://www.youtube.com/watch?v=6MCZKwSpUoU), indexed March 2026 | A direct hand-spin battle demonstration exists for follow-up viewing. | The source retrieved here does not identify the participating fingers or quantify the launch. |
| Beyblades x Erazers, [Make Your Own EPIC Eraser Beyblade](https://www.youtube.com/watch?v=UpqKFsNoGgk), 2 October 2025 | Another creator publishes an eraser-top tutorial. | Independent corroboration of the practice, not evidence of widespread adoption or school-era authenticity. |
| Arvind Gupta Toys, [Quick Activities](https://www.arvindguptatoys.com/arvindgupta/quickactivities.pdf), printed pp. 34–35 | An Indian educational maker resource documents an optical spinning disc using a ballpen refill and its brass tip as a bearing. | This is an adjacent disc construction, not an eraser battle or a school competition rule book. |
| Kokuyo Camlin, [Camlin Spin Eraser](https://www.kokuyocamlin.com/camlin/pencils-and-accessories/erasers/individual/individual-eraser-in-red) | The manufacturer currently sells an eraser explicitly usable as a spinner, listed at ₹10 when checked. | This contemporary product does not prove that the same object belongs in a chosen historical school setting. |

First-person recollections provide useful interview prompts: commenters in [IndiaNostalgia, November 2021](https://www.reddit.com/r/IndiaNostalgia/comments/r3gtwf) recall a pencil point in an eraser; a [March 2026 thread](https://www.reddit.com/r/IndiaNostalgia/comments/1rzrxdl/have_you_done_this_in_school/) recalls spinning an eraser with pencil material and mentions broken tips. Another [2026 thread](https://www.reddit.com/r/IndiaNostalgia/comments/1tjsg9h/if_your_rubber_has_ever_looked_like_this_you_had/) describes a pen “nib.” These are self-selected anecdotes with ambiguous terminology, not demographic evidence, engineering tests or agreed rules.

## Resolve “nib” before designing the parts catalogue

- **Pencil point / graphite core:** conventional pencil cores use graphite and clay; STAEDTLER explains that their proportions affect hardness. A graphite point should not be drawn as a metal fountain nib. The production description alone does not supply spinner friction, breakage or durability values. [STAEDTLER production guide](https://www.staedtler.com/fileadmin/user_upload/Product/STAEDTLER-Promotional-Products-2023_GB-FR.pdf)
- **Ballpoint refill tip:** PILOT describes a small metal ball rotating in a holder; together they form the tip. This is distinct from a loose bearing ball and from a fountain nib. Do not assume its tiny ball will act as a frictionless spinner bearing under a different loading direction. [PILOT explanation](https://www.pilot.co.jp/media/knowledge/003.html)
- **Fountain-pen nib:** LAMY offers steel and gold nibs with different tip forms and writing widths. These are a different component family. Nothing in that writing guide ranks them as spinning pivots. [LAMY nib guide](https://www.lamy.com/en-sz/lamy-fountain-pen-nib-guide)
- **Mechanical-pencil tip:** potentially means the metal nose cone, lead sleeve, or graphite lead itself. The school recollections above do not resolve which one is meant. Keep these as separate candidate identities pending visual references.

## Physics that is useful for development

**Mass distribution matters more than a generic “quality” score.** Rotational inertia is approximately the sum of each mass element times its squared distance from the spin axis, `I = Σ m r²`. With the same applied torque, a larger inertia accelerates more slowly. UCSB's equal-mass wheel demonstration gives longer coast for greater inertia when starting speeds and frictional torques are comparable. A hand launch does not guarantee equal starting speeds. “Heavier always spins longer” is therefore not a sound upgrade rule. [UCSB: different moments of inertia](https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/28.31.html)

**Balance and launch alignment are real inputs.** In an ideal upright top, the centre of mass lies over the contact point and gravity produces no torque about that point. When tilted, gravity supplies a torque; rapid spin produces precession. The familiar approximation concerns a rapidly spinning, near-symmetric top, so it should not be treated as a complete simulation of a lopsided eraser. [MIT: Spinning Top](https://wikis.mit.edu/confluence/display/RELATE/Spinning%2BTop)

**End-of-spin wobble can communicate state.** As a fast top slows, its precession can become faster and more conspicuous, and more complicated wobbling motion follows. This supports visibly changing motion and sound as a readable stamina cue, while exact thresholds remain model parameters. [Georgia State: precession of a top](https://hyperphysics.gsu.edu/hbase/top.html)

**Tip geometry changes behaviour.** Rod Cross's high-speed observations compare pointed and rounded supports on the same disc and document substantially different motion. Contact friction may influence both energy loss and the top's ability to rise towards upright; it cannot always be reduced to “grip is bad.” These experiments concern purpose-made tops, not erasers. [University of Sydney: Spinning Tops](https://www.physics.usyd.edu.au/~cross/SPINNING%20TOPS.htm)

**The surface belongs in the model.** Experiments on spinning tops on inclined planes found that trajectories depend on contact behaviour and inclination, and proposed a friction law dependent on slip. This is evidence against copying one fixed tip rating across all surfaces; it is not a parameter table for Indian classroom desks. [Barthmann and Fischer, 2021, university-hosted paper](https://epub.uni-bayreuth.de/id/eprint/6528/1/Barthmann_2021_J._Phys._Commun._5_085003.pdf)

**A collision is more than stamina subtraction.** An impulse changes linear momentum, and an impulse applied away from the centre also changes angular momentum. Restitution describes normal rebound at the contact point. Collision location, relative motion and shape can therefore change translation and rotation together. A soft eraser may need a tuned rigid-body approximation; no measured eraser restitution was found. [Penn State: impulse and momentum](https://mechanicsmap.psu.edu/websites/15_impulse_momentum_rigid_body/15-2_impulse_momentum_theorem_rigid_body/impulse_momentum_theorem_rigid_body.html), [surface collisions](https://mechanicsmap.psu.edu/websites/15_impulse_momentum_rigid_body/15-3_rigid_body_surface_collisions/rigid_body_surface_collisions.html)

## Candidate tradeoffs to prototype

These are design hypotheses informed by the principles above, not discovered rankings of stationery brands.

| Choice | Understandable player tradeoff | Validation needed |
| --- | --- | --- |
| Wide body / weight further out | Potentially more rotational inertia, but harder to accelerate with a limited launch. | Whether attainable launch speeds and actual friction produce a satisfying advantage. |
| Compact light body | Easier spin-up; potentially less resistance to a given shove. | Its speed, momentum and collision behaviour in the chosen simulation. |
| Well-centred assembly | Cleaner rotation and a forgiving launch. | Whether imperfect centring feels learnable rather than random. |
| Different pivot heights | Changes contact geometry, body clearance and gravitational lever arms. | Clearance versus tipping and collision-height effects; “lower is always better” is unproven. |
| Different tip shapes / desk finishes | Different motion, slipping and energy-loss behaviour. | Measured or deliberately stylised parameters for each pairing. |
| Soft versus firm eraser | Possible difference in rebound and deformation losses. | Samples and impact tests; rubber appearance does not determine restitution. |
| Worn, rounded or chipped body | Recognisable personal history and silhouette; possible geometry differences. | Decide whether wear is cosmetic, a sidegrade, or a burden players would dislike. |

Keep initial player-facing explanations to **spin-up, balance, movement and knockback**. Let construction affect these visibly. Avoid hiding every outcome behind unexplained “attack/defence/stamina” numbers if tactile school improvisation is the core appeal.

## What still requires observation

The exact **index–thumb** and **index–middle** gestures were not verified in accessible sources. No defensible evidence was found that one is universally stronger, more accurate, or an advanced replacement for the other. Treat both as user-supplied requirements pending a demonstration. Do not substitute pen-spinning tricks such as ThumbAround: those keep a pen moving around fingers and are a different activity.

For a small empirical reference set, record already-prepared representative tops from overhead and the side. Use consistent trial definitions and multiple launches per condition; record failures rather than discarding them. Capture:

1. Part identity, dimensions, mass, tip protrusion and approximate centring.
2. Initial spin, placement, tilt and sideways velocity for each hand technique.
3. Time until first body contact, first sustained wobble and complete stop; these are different endpoints.
4. Travel path and spin loss on each intended arena surface.
5. Collision outcomes: displacement, wobble, spin loss and eventual win condition.
6. Between-player variation: whether learned technique materially beats simply owning another part.

This work should answer the development question **“Which differences are consistent enough for players to understand and exploit?”** It need not produce a laboratory-perfect eraser simulator. Arena boundaries, race rules, win conditions, progression, rarity and post-launch control remain game-design choices; the physical evidence does not decide them.
