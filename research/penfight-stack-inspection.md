# Penfight — observed deployed stack

Inspected the public homepage, its referenced production JavaScript and HTTP response headers on 11 September 2026. This establishes what the deployed client contains and calls; it is not an inspection of the private source repository or backend implementation.

| Layer | Evidence-based finding | Observed evidence |
| --- | --- | --- |
| 3D rendering | **Three.js r169** | Three's attribution, WebGLRenderer implementation and revision constant `169`, used in the renderer's `data-engine` attribute. |
| Physics | **Rapier 3D, WASM** | Rapier WASM initialization, exported physics API and application calls creating dynamic pen bodies, colliders, damping, friction and CCD settings. This is active application code, not just an unused library marker. |
| Build tooling | **Vite** | `__vite__mapDeps` and the module-preload helper in the bundle; the homepage also contains a Vite-specific deployment comment. |
| Authentication / realtime | **Supabase integrations** | Supabase authentication code, an application Google OAuth call and WebSocket setup targeting the Supabase realtime path. Client references to functions endpoints also appear; their server implementations were not inspected or invoked. |
| Hosting | **Vercel serving the public page** | HTTP response includes `server: Vercel`, `x-vercel-cache` and `x-vercel-id`. This does not identify every backend service. |
| Interface | **Direct DOM construction is present** | Application code creates elements and attaches its renderer to `#app`. No standard React runtime fingerprints were found in the inspected main bundle; this is not proof about all lazy-loaded features. |

Primary evidence: [deployed homepage](https://www.penfight.xyz/) and [main JavaScript asset referenced by that page](https://www.penfight.xyz/assets/index-BqvgD_Ny.js). The asset URL is deployment-specific and may change. Downloaded public HTML and JavaScript were inspected as text; no game code was executed through the shell and no service endpoints were called.

The original source language cannot be established from transpiled JavaScript alone. TypeScript is possible but unconfirmed. Exact Rapier and Vite versions, the database schema, server-side match authority and the complete dependency list were not established. This was not a performance benchmark or full network-session audit.

## Consequence for Sbin

This provides a concrete precedent for the proposed Three.js/Vite browser workflow and for Rapier handling desk-based pen collisions. Penfight's supported pens are a different physical problem from erasers balancing and spinning on refill tips. Its use of Rapier therefore does not settle Sbin's gyroscopic/contact simulation choice. Keep the focused experiment described in the [technical recommendation](tech-stack-research.md), with Rapier remaining a credible alternative.

Penfight's Supabase and Vercel choices are observed implementation choices, not prerequisites for reproducing its approachability. Sbin's accepted bot-only prototype can retain the requested GitHub Pages hosting.
