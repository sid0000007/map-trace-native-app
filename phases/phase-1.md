# Phase 1 — Project Setup

## Objective
Bootstrap the Expo SDK 54 + TypeScript application with the domain-driven folder
structure and all tooling wired up, producing a bootable but empty app.

## Scope
- In scope: project initialisation, dependencies, folder skeleton, providers,
  config, scripts, empty interfaces/stubs.
- Out of scope: real screens, data fetching, the Worker, business logic.

## Tasks
- [x] Initialise Expo SDK 54 app with TypeScript (strict mode on).
- [x] Install/configure: Expo Router, TanStack Query, react-native-maps.
- [x] Configure ESLint + Prettier; ban `any` (no casting per project rules).
- [x] Configure Jest + React Native Testing Library; add a smoke test.
- [x] Create the domain-driven folder structure, e.g.:
  ```
  app/                      # Expo Router routes
  src/
    domains/locations/
      types/                # Location model + Zod schemas
      repositories/         # ILocationRepository + HttpLocationRepository
      services/             # LocationService
      hooks/                # useLocations, useLocation
      components/           # map/detail UI
    lib/
      http/                 # fetch client, timeout, errors
      query/                # QueryClient + provider
      config/               # env (API base URL)
  __tests__/                # or co-located *.test.ts(x)
  ```
- [x] Add root providers (QueryClient provider, Expo Router layout).
- [x] Add `app.json`/config and environment plumbing for `API_BASE_URL`.
- [x] Define empty/typed stubs for interfaces and service (no logic yet).
- [x] Add npm scripts: `start`, `lint`, `typecheck`, `test`.

## Acceptance Criteria
- [x] `expo start` launches a blank/placeholder app on simulator or device.
- [x] `typecheck`, `lint`, and `test` (empty/smoke suite) all pass.
- [x] Folder structure matches the agreed Phase 0 layout.
- [x] All layer interfaces exist as typed stubs (compile, no `any`).

## Risks
- Expo SDK 54 / react-native-maps native build issues → verify on a clean run early.
- Dependency version drift → pin versions; commit a working lockfile.

## Notes
- No business logic in this phase — only scaffolding and contracts.
- Keep `API_BASE_URL` configurable so Phase 5 can swap local → deployed URL.

## Completion Status

Completed: true

### Verification evidence (2026-06-10)

- **Toolchain:** Node 22.21.1, pnpm 10.10.0. `.npmrc` sets `node-linker=hoisted` for Expo + pnpm.
- **SDK pin:** `expo@54.0.35`, `react@19.1.0`, `react-native@0.81.5`, `typescript@5.9.3`
  (scaffolded `blank-typescript` then pinned to SDK 54 via `expo install --fix`).
- **Deps:** Expo Router 6.0.24, TanStack Query 5.101, react-native-maps 1.20.1, zod 4.4.3;
  entry switched to `expo-router/entry`, `scheme` + typed routes added to `app.json`.
- **Tooling:** ESLint (flat) extends `eslint-config-expo@10.0.0` (SDK-54 line) + custom rules
  banning `any` (`@typescript-eslint/no-explicit-any`) and all casting
  (`consistent-type-assertions: never`); Prettier; Jest via `jest-expo@54` + RNTL `13.3.3`.
  RNTL was downgraded from 14 → 13.3.3 because v14 requires React 19.2 (SDK 54 ships 19.1).
- **Gates:** `typecheck` ✓ (exit 0), `lint` ✓ (exit 0), `test` ✓ (smoke passes), `expo-doctor` ✓ (18/18).
- **Boot check:** `expo export --platform ios` bundled the full graph (entry → `_layout` →
  QueryProvider/SafeAreaProvider → screens), 1016 modules, exit 0. A literal simulator
  launch was not performed in this headless environment; the successful Metro bundle plus
  expo-doctor are the boot evidence.
- **Folder structure:** matches the Phase 0 layout (`app/`, `src/domains/locations/{types,
  repositories,services,hooks,components}`, `src/lib/{http,query,config}`, `__tests__/`).
- **Contracts/stubs (no `any`, no casting):** `ILocationRepository`, `HttpLocationRepository`,
  `LocationService`, `IHttpClient`/`FetchHttpClient`, error classes, `locationSchema` (Zod,
  the single parse boundary, in `types/`), query-key factory, and the `createLocationService`
  composition root.

### Note for Phase 2

- Repo has an "Initial commit" from the scaffold; Phase 1 changes are **uncommitted** (per the
  commit-only-when-asked rule). Commit when the user approves.
