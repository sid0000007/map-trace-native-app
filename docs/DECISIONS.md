# Decisions & Tradeoffs

Each decision lists the choice, why, and what was traded away or deferred.

## Expo SDK 54 (+ Expo Router)

- **Why:** Fastest path to a runnable RN app on iOS/Android/web with file-based routing,
  typed routes, and a managed native toolchain (no manual Xcode/Gradle plumbing for the MVP).
  Expo Router gives URL-style navigation and typed params (`/location/[id]`).
- **Tradeoff:** Tied to the Expo SDK's native module versions. Pinned explicitly to SDK 54
  (latest is newer) and used `expo install` so every dependency stays SDK-coherent.

## TanStack Query for server state

- **Why:** Caching, deduplication, retry, and refetch/refresh are exactly the behaviours the
  edge cases demand (loading, retry, pull-to-refresh, no duplicate fetch storms). Doing this
  by hand in `useEffect` would be error-prone.
- **Tradeoff:** A dependency and a mental model to learn. Worth it; the hooks stay tiny and the
  retry policy is declarative (e.g. don't retry a not-found).

## Zod at a single parse boundary

- **Why:** The network is untrusted. Validating raw JSON into typed `Location` objects in the
  repository (and nowhere else) means the rest of the app works with guaranteed-valid data and
  no `any`. Malformed payloads fail loudly with a clear error.
- **Tradeoff:** A little runtime cost and schema maintenance. Negligible for this dataset, and
  it doubles as the contract shared with the Worker.

## Static JSON dataset (no database)

- **Why:** The assignment is about the app + API architecture, not data storage. A static,
  in-Worker dataset keeps the backend a single deployable artifact with zero infra, while the
  **Repository Pattern** keeps a future DB swap isolated to one layer.
- **Tradeoff:** No querying/filtering server-side, no writes. Explicitly deferred — see
  [FUTURE_SCALABILITY.md](FUTURE_SCALABILITY.md).

## Cloudflare Workers for the API

- **Why:** Global edge deployment, generous free tier, sub-10ms cold starts, and a trivial
  `wrangler deploy`. Web-standard `Request`/`Response` keep the code portable and dependency-free.
- **Tradeoff:** Worker runtime constraints (no Node APIs by default). None hit for this MVP.

## Dependency-free Worker routing (no Hono/itty-router)

- **Why:** Two routes + 404/405 + CORS is a few lines of standard `Request`/`Response`. No
  framework means nothing to audit, no supply chain, and total clarity.
- **Tradeoff:** Manual routing doesn't scale to many endpoints — fine here, revisit if the API grows.

## Coordinate filtering in the service, not the schema

- **Why:** An out-of-range coordinate is a *business* concern (don't render an impossible
  marker), not a *parsing* concern. If the schema rejected it, one bad row would fail the whole
  list. Instead the schema accepts any number and `LocationService` filters — so the dataset can
  intentionally ship an invalid fixture for edge-case testing, and bad rows are dropped, not fatal.

## pnpm (with `node-linker=hoisted`)

- **Why:** Project/workspace convention. Expo + Metro resolve native modules reliably with the
  hoisted linker.
- **Tradeoff:** Requires the `.npmrc` setting and `pnpm rebuild` for the Worker's native binaries
  (`esbuild`/`workerd`) — documented in both READMEs.

## Server keeps its own copy of the Zod schema (not a shared workspace package)

- **Why:** The client lives at the repo root (Expo) and the Worker is a separate package. A
  shared `packages/types` workspace would force Metro monorepo configuration and risk
  destabilising the verified app build. Instead, both sides validate the same `Location` shape and
  the Worker validates its dataset at load, preventing drift.
- **Tradeoff:** The schema is defined in two places. Low cost for one small type; the contract is
  enforced by tests on both sides. A shared package is the natural next step if more types appear.

## RNTL pinned to v13, ESLint to v9

- **Why:** RNTL v14 requires React 19.2 but SDK 54 ships React 19.1; v13.3.3 targets 19.1. ESLint
  10 isn't yet supported by the `@typescript-eslint` bundled in `eslint-config-expo`, so ESLint is
  pinned to 9. Both caught early via the smoke test and `expo-doctor`.
- **Tradeoff:** Not on the absolute latest tooling — the correct call for SDK-54 coherence.

## Deferred (out of MVP scope)

- Authentication, write operations, user accounts.
- Server-side geospatial querying, clustering, caching (documented as future work).
- CI/CD pipeline, app-store builds, web-specific map support.
