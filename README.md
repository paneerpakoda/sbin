# sbin.

An eraser, a metal pen-refill tip, and one more spin. A browser game inspired by school desks and last-bench experiments in Ranchi.

[Play Sbin](https://paneerpakoda.github.io/sbin/) · [Source](https://github.com/paneerpakoda/sbin)

**First playable: the launch experiment.** Choose a grip, trace the ring around the eraser, and release. The eraser then spins without further control. After a first attempt, open the pencil box to compare a centred/off-centre tip and plain wood/a shallow dent. Tap another spot on the desk to change the starting position.

This slice has one spinner, a timer, a local personal best, pause, mute and unlimited retries. Bot battles, deeper construction and progression are the next stages in the [prototype brief](research/prototype-brief.md).

## Run locally

Use Node.js 24 LTS (`.nvmrc`), then:

```sh
npm ci
npm run dev
```

Open `http://localhost:5197/`. Touch or mouse can trace the ring. **Show me a spin** demonstrates a launch; Space launches that same preset when focus is outside a control, pauses/resumes an active spin, or resets a completed one.

## Verify

```sh
npm test
npm run build
npx playwright install chromium webkit
npm run test:browser
```

Browser tests start the local server automatically. They cover the launch, pause/resume, result, pencil-box settings and save/reload in Chromium and a mobile-sized WebKit context, plus a Chromium touch/cancellation sequence. To test an existing hosted build, set `PLAYWRIGHT_BASE_URL` to its full URL, including a trailing slash.

GitHub Actions runs the unit checks, production build and Chromium checks before publishing `dist/` to Pages. The relative asset base supports a repository subpath. Pull requests run validation without publishing.

## Physics experiment

The playable uses a reduced fixed-step model of spin, tilt, drift and contact. It is tunable game behaviour, not a calibrated material simulation. Wobble and results follow the same simulation state. The grip tradeoffs and dent parameters are hypotheses for playtesting.

```sh
npm run experiment:jolt
```

This runs a development-only, single-thread Jolt comparison and updates [the raw results](experiments/jolt-results.json). See [the experiment notes](experiments/README.md) for the configuration, findings and limits. Jolt is not included in the game bundle.

## First iPhone test

Open the published URL in Safari, with browser controls visible. Try a smooth arc and a hurried one, then compare grips, fit and surface. Check whether the tip and wobble are readable, whether the launch feels repeatable, and whether you want another attempt. Try rotating the phone and leaving/returning to Safari during a spin; the interrupted round should stay paused until resumed.

Automated WebKit checks are not a physical iPhone test. No on-device performance or user-playtest result has been claimed.

## Project notes

- [First-slice scope](docs/first-playable.md)
- [Technical research and stack decision](research/tech-stack-research.md)
- [Penfight stack inspection](research/penfight-stack-inspection.md)
- [Third-party notice](public/THIRD_PARTY_NOTICES.txt)

Geometry and textures are generated in the project; audio is synthesized. Browser storage is optional and progress stays on the current device.
