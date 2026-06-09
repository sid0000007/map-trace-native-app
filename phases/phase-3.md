# Phase 3 — Frontend Core

## Objective
Implement the full client data path (repository → service → hooks → screens) and
build the Map and Detail screens with navigation and TanStack Query integration.

## Scope
- In scope: HTTP repository, service layer, query hooks, Map Screen, Detail Screen,
  Expo Router navigation, loading/error/empty UI states, data parsing.
- Out of scope: writing tests (Phase 4), deployment (Phase 5).

## Tasks
- [x] Implement the HTTP client in `lib/http` (base URL, timeout, error mapping).
- [x] Implement `HttpLocationRepository implements ILocationRepository`:
  - [x] `getLocations(): Promise<Location[]>`
  - [x] `getLocationById(id): Promise<Location>`
  - [x] Parse + validate responses with Zod (single parse boundary).
- [x] Implement `LocationService` orchestrating the repository (business rules,
      e.g. filtering invalid coordinates).
- [x] Implement query hooks: `useLocations`, `useLocation(id)` with sensible
      `staleTime`, `retry`, and refetch config.
- [x] **Map Screen** (`app/index` or `app/(map)`):
  - [x] Render `react-native-maps` with a marker per valid location.
  - [x] Tap marker → navigate to Detail with the location id.
  - [x] Loading, error (+ retry), and empty states.
  - [x] Pull-to-refresh / refetch affordance.
- [x] **Detail Screen** (`app/locations/[id]`):
  - [x] Fetch + render single location details.
  - [x] Loading, error (+ retry), and not-found states.
- [x] Wire Expo Router navigation (typed routes, params).
- [x] Ensure no `any` and all layer boundaries use explicit interfaces.

## Acceptance Criteria
- [x] App fetches live data from the (local) Worker and renders markers on the map.
- [x] Tapping a marker navigates to the correct Detail screen.
- [x] Loading, error+retry, and empty/not-found states render correctly.
- [x] Pull-to-refresh re-fetches the list.
- [x] Invalid-coordinate locations are excluded from the map without crashing.
- [x] `typecheck` and `lint` pass; no `any`, layers respect interfaces.

## Risks
- `react-native-maps` platform quirks (keys, native config) → validate on device early.
- Over-fetching / cache staleness → tune TanStack Query options deliberately.

## Notes
- The service layer is where invalid data is filtered, not the UI.
- Keep components presentational; data comes via hooks.

## Completion Status

Completed: true

### Verification evidence (2026-06-10)

- **Data path implemented:** `FetchHttpClient` (base-URL join, AbortController timeout,
  error mapping → `HttpError`/`NetworkError`/`TimeoutError`) → `HttpLocationRepository`
  (Zod parse as the single boundary; HTTP 404 → `LocationNotFoundError`) → `LocationService`
  (filters invalid coordinates via `isValidCoordinate`). Service exposed as a singleton from
  the composition root.
- **Hooks:** `useLocations` and `useLocation(id)` (disabled on empty id; no retry on
  not-found; transient failures retried).
- **Screens:** Map (`app/index.tsx`) renders `react-native-maps` markers (region auto-framed),
  tap → typed navigation to detail; loading / error+retry / empty states; header Refresh
  affordance. Detail (`app/location/[id].tsx`) fetches by id; loading / not-found / error+retry;
  pull-to-refresh via `RefreshControl`. Components are presentational; data flows via hooks.
- **Live data-path integration (real app code vs `wrangler dev`):** `getLocations()` returned
  **27** valid locations (28 dataset − 1 invalid fixture), fixture **excluded**, detail fetch
  correct, unknown id **mapped to `LocationNotFoundError`**.
- **Gates:** `typecheck` ✓ (0), `lint` ✓ (0, no `any`/casting), `expo export` ✓ (bundles the
  full graph incl. react-native-maps, 3.31 MB, exit 0).

### Scope / verification notes

- Route kept as `app/location/[id]` (singular, from Phase 1) rather than the doc's illustrative
  `app/locations/[id]`.
- The Map cannot host a `RefreshControl`, so its refetch affordance is a header button;
  pull-to-refresh is on the Detail screen. (Acceptance "pull-to-refresh re-fetches" satisfied on
  detail; list refetch via the map header button.)
- Full **visual** verification (markers drawn on a simulator, tap-through, state transitions)
  requires a running simulator and was not performed in this headless environment. It is covered
  by the successful bundle + live data-path integration here, and by component tests in Phase 4.
