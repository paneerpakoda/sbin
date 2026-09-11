# iPhone runtime requirements for the Sbin prototype

Research date: 11 September 2026. Scope: a stylised 3D spinner game with one desk, two active spinners, gesture launches, bot matches, and local progress, delivered through GitHub Pages. This is documentation research; no build or iPhone benchmark has been performed.

**Recommendation:** use a WebGL2 renderer as the initial baseline, Pointer Events for a single-contact launch gesture, explicit audio activation, small recoverable local saves, and a measured 60 fps target. Test the published game in Safari on the actual iPhone 17 from the first playable slice. Treat WebGPU as an available option to evaluate, rather than a requirement imposed by the hardware.

## Known support versus assumptions

Apple specifies the base iPhone 17 with a 6.3-inch OLED display, 2622 × 1206 physical pixels, and adaptive ProMotion refresh up to 120 Hz. Those specifications do not identify the user's installed iOS version, chosen browser, current CSS viewport, or achievable game frame rate. Record the actual OS and browser versions during the first test. Safari is the proposed initial test browser, not an already confirmed user preference. [Apple: iPhone 17 technical specifications](https://www.apple.com/iphone-17/specs/)

WebKit added WebGL2 in Safari 15, including a Metal-backed WebGL implementation. This establishes a considerably older Safari baseline than WebGPU. [WebKit: Safari 15 features](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/)

WebGPU ships in Safari 26.0 on iOS, iPadOS, macOS, and visionOS. WebKit recommends it for new applications and identifies support through frameworks including Three.js, Babylon.js, and PlayCanvas. Therefore, “Safari cannot run WebGPU” is obsolete. However, the existence of browser support is not a benchmark of this game, its chosen renderer, shaders, or assets. [WebKit: Safari 26.0 features](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/#webgpu)

For this small scene, the WebGL2 recommendation is an engineering judgment about implementation scope and compatibility. At startup, require successful renderer/context creation and asset initialization, not a device-name allowlist. Show a retryable failure state if initialization fails. If a later experiment selects WebGPU, require successful backend initialization and retain a tested fallback where the framework supports one. Record the backend actually selected in development diagnostics. Handle graphics-context loss with pause and recovery instead of continuing an invisible match.

## Touch input and the browser viewport

Pointer Events describes pointer identities and device types such as touch, mouse, and pen; it does not expose anatomical identity such as index finger or thumb. Unsupported pressure sensing produces the standardized active value `0.5`, so pressure cannot be the required source of launch power. Use position and event timestamps, with grip selected explicitly. Pointer capture keeps movement associated with the launch surface; cancellation can occur when the browser suppresses a pointer stream, including during orientation changes. `touch-action` controls browser panning/zooming and must already be set when the gesture begins. Canceling a pointer event alone does not suppress those viewport manipulations. [W3C: Pointer Events](https://www.w3.org/TR/pointerevents3/)

Proposed input contract: capture one active pointer; sample its path; launch only on a valid release; discard unfinished input on cancellation or lost capture. Keep additional touches from accidentally launching a second time. Apply `touch-action: none` to the active play surface, preserve ordinary interactions elsewhere, and keep launches comfortably inside the screen. Test actual edge swipes: do not promise that CSS or capture disables operating-system navigation gestures. Use visual aim, direction, and release feedback, consistent with the user's preference to test visual cues before tooltips.

For edge-to-edge layout, WebKit documents `viewport-fit=cover` with `env(safe-area-inset-*)` to protect important content from sensor housing, rounded corners, and the Home indicator. [WebKit: designing for edge-to-edge iPhone screens](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

The prototype should work with Safari's browser controls visible. Fullscreen, a Home Screen installation, and orientation locking should remain optional rather than prerequisites. Size the canvas from its current container; recompute projection and input coordinates when that size changes. Exercise both orientations, including rotation during a held gesture, and keep the paused/retry controls accessible. This avoids staking the first release on additional platform-specific presentation features.

## Audio and interrupted play

Create or resume the audio context during an explicit user activation, such as the first Start tap, and provide a mute control. That matches documented Web Audio autoplay guidance. Prepare short launch, contact, scrape, and fall sounds before the battle so event timing does not depend on downloading a sound at impact. [MDN: Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)

Audio can be suspended or interrupted. MDN specifically documents iOS Safari interruptions when leaving the page, switching tabs, or turning the screen off; resumption must be handled. Observe context state, attempt resumption at an appropriate user action, and allow the game to continue muted if audio cannot resume. Verify recovery on the actual browser rather than assuming one successful initial unlock lasts forever. [MDN: audio-context state](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state)

WebKit stops animation-frame callbacks and throttles timers in inactive pages, and may suspend iOS tabs. On `visibilitychange`, pause the match and its sounds, discard any incomplete gesture, and reset the simulation's timing accumulator before resuming. Do not simulate a minute of missed gameplay after the player returns from another app. [WebKit: web content and power usage](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/)

## Saving and performance budgets

Use a small versioned local save for settings, selected build, and the simple unlock. Browser storage is best-effort by default: WebKit documents eviction under storage pressure, overall quota pressure, or inactivity. Safari 17 and later support the Storage API, including requests for persistence, but such requests are subject to browser policy. A local save is therefore not a permanent account or cloud backup. Catch storage failures, tolerate missing/corrupt data, and recover to a usable starter build. Do not block the first spin on a persistence request. [WebKit: storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)

High display resolution is a rendering cost, not a requirement to shade every physical pixel. MDN recommends considering a smaller drawing buffer and explicitly budgeting graphics memory. [MDN: WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

The following are **proposed acceptance targets, not measurements or device guarantees**:

- Target 60 rendered frames per second during normal battles; budget roughly 16.7 ms per frame. Do not require 120 fps because the panel permits it.
- Start with effective render pixel ratio capped at 1.5; compare 1 and 2 on device for readability and stability. Keep text in the DOM where practical.
- Use a fixed simulation step independent of rendering, with bounded catch-up. Choose its rate through the physics experiment.
- Initially budget at most 5 MB of compressed resources needed for the first guided match; aim for interaction within five seconds under a recorded 10 Mbps test connection.
- Run ten minutes of repeated matches to inspect frame pacing, heat, resource growth, and recovery. Reduce resolution, shadow cost, or effects before accepting persistent stutter.

## Verification that earns an iPhone-ready claim

Playwright supports mobile configurations, but its WebKit build is patched and derived from WebKit sources; it does not automate the branded Safari browser. Platform-dependent behavior can also differ. Use it for repeatable boot, layout, assembly, result, restart, and save-restoration checks; a passing emulation run is not evidence of iPhone GPU performance or physical gesture quality. [Playwright: browsers](https://playwright.dev/docs/browsers)

The device gate is a first visit to the published Pages URL, followed by guided launch, every build/grip combination, collisions, edge losses, restart, reload, mute/unmute, app switching, screen lock, and rotation. Record versions, load conditions, frame timing, and observed failures. Inspect the running iPhone page from Safari on a connected Mac using Web Inspector when debugging is needed. WebKit documents enabling this and remote inspection over a cable or configured wireless connection. [WebKit: enabling Web Inspector](https://webkit.org/web-inspector/enabling-web-inspector/)
