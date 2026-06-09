# Challenges & How They Were Solved

Real problems hit while building this, and the fix for each.

## 1. SDK version pinning — scaffolder installs the newest SDK

`create-expo-app` installs the *latest* Expo SDK (SDK 56 at build time), but the target is
**SDK 54**. Fix: scaffold the minimal `blank-typescript` template, pin `expo` to `~54`, then run
`npx expo install --fix`, which reads the installed SDK's `bundledNativeModules.json` and rewrites
React/React Native/etc. to the exact SDK-54 versions. Every other dependency was added with
`expo install` so it stays SDK-coherent.

## 2. React Native Testing Library v14 vs React 19.1

The first smoke test failed with *"render function has not been called"* — `render` ran but
`screen` was never populated. Root cause: RNTL v14 pulls `react-reconciler@0.33`, which requires
**React 19.2**, but SDK 54 ships **React 19.1** (visible as a peer-dependency warning). Fix: pin
`@testing-library/react-native` to **13.3.3**, which uses `react-test-renderer` directly and
targets React 19.1. The smoke test passed immediately after.

## 3. ESLint config tier mismatch

`expo-doctor` flagged that `eslint-config-expo` was on the SDK-56 line (`56.x`) while SDK 54
expects `~10.0.0`. Fix: pinned it to `~10.0.0` (still ships the flat config + `@typescript-eslint`
8). Also pinned ESLint itself to **9** because ESLint 10 isn't yet supported by that
`@typescript-eslint`. `expo-doctor` then reported 18/18.

## 4. pnpm skipped native build scripts

After `pnpm install` in `backend/`, `wrangler dev` would have failed because pnpm 10 ignores
post-install scripts by default — including `esbuild` and `workerd` (the local Workers runtime).
Fix: added `pnpm.onlyBuiltDependencies` to `backend/package.json` and ran
`pnpm rebuild esbuild workerd sharp`. Documented in `backend/README.md` for fresh clones.

## 5. The app's Jest discovered the Worker's Vitest suite

Running `jest --coverage` from the app root globbed `backend/test/worker.test.ts`, which uses
Vitest imports and can't run under Jest ("test suite failed to run"). Fix: `testPathIgnorePatterns`
and `modulePathIgnorePatterns` exclude `backend/` from the app's Jest run. The Worker keeps its own
`vitest` suite.

## 6. TanStack Query data narrowing

`useQuery().data` is `Location[] | undefined`, and TypeScript does not narrow it from the
`isPending`/`isError` flags. The Map screen's success branch needed an explicit
`!data || data.length === 0` guard to satisfy strict mode without any casting.

## 7. Deterministic retry tests

`useLocation` retries transient errors (but not not-found). That made a single
`mockRejectedValueOnce → mockResolvedValueOnce` sequence resolve via the *automatic* retry,
so the error UI never appeared. Fix: assert "retry recovers" on the **Map** screen (its query has
no auto-retry, so the sequence is deterministic), and on the Detail screen assert only that the
retry affordance re-issues the request.

## 8. Secret handling for deployment

The Cloudflare API token was placed in a root `.env`, but the original `.gitignore` only ignored
`.env*.local` — so `.env` was *not* ignored and could have been committed. Fix: updated
`.gitignore` to ignore `.env` / `.env.*` while keeping `.env.example` tracked; verified with
`git check-ignore`; the token was read inline at deploy time and never printed, staged, or committed.

## 9. Post-deploy propagation blip

Immediately after `wrangler deploy`, the first `GET /locations` header probe returned a transient
Cloudflare `404` (route propagation). Re-checks within seconds were consistently `200`. Noted so
it isn't mistaken for a real bug.

## Edge-case matrix

Every row is covered by an automated test (see `phases/phase-4.md` for the exact mapping).

| # | Edge case | Behaviour | Covered by |
|---|-----------|-----------|------------|
| 1 | API unavailable | Error state + retry, no crash | Map error+retry test |
| 2 | Empty dataset | Empty-state message | Map empty test |
| 3 | Invalid coordinates | Filtered out (not rendered, not fatal) | Service filtering unit test |
| 4 | Location not found | Detail not-found state (404) | Detail not-found test |
| 5 | API timeout | Graceful → error + retry | `FetchHttpClient` → `TimeoutError` test |
| 6 | Slow network | Loading persists, no duplicate fetches | Map single-flight + loading tests |
| 7 | Loading state | Spinner while fetching | Map + Detail loading tests |
| 8 | Retry mechanism | Retry re-issues and recovers | Map retry-recovers test |
| 9 | Pull to refresh | Re-fetches and updates | Detail `RefreshControl` test |

Verification beyond unit/component tests: the real client data path was run against both the local
`wrangler dev` and the deployed Worker, returning 27 valid locations from a 28-row dataset (the
invalid-coordinate fixture filtered) with not-found correctly mapped.
