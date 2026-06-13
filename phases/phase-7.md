# Phase 7 — Frontend Optimization (mobile app)

## Objective
Improve the perceived performance and rendering efficiency of the React Native app
without changing behaviour or breaking the layered architecture. Focus on the highest-ROI
wins for the current dataset, plus document the changes that matter at scale.

## Scope
- In scope: instant detail navigation, image caching, react-native-maps render efficiency,
  component/region memoization, query cache tuning.
- Out of scope: new features, backend changes, the web demo. Marker clustering and the
  React Compiler are documented as future/optional, not implemented here.

## Tasks
### Tier 1 — high ROI
- [x] **Instant Detail**: seed `useLocation` with `initialData` from the locations list cache
      (the full `Location` is already cached), so tapping a marker renders immediately and
      revalidates per `staleTime`.
- [x] **expo-image**: replace the RN `<Image>` in `LocationDetailCard` with `expo-image`
      (`cachePolicy="memory-disk"`, `contentFit`, `transition`, placeholder) for caching and
      faster decode.
- [x] **Markers**: set `tracksViewChanges={false}` on map markers to stop continuous redraws.

### Tier 2 — render hygiene
- [x] Memoize `computeRegion` (`useMemo`) so it isn't recomputed every render.
- [x] Extract a `React.memo` marker with a stable `onSelect(id)` (no per-render closures).
- [x] `React.memo` the presentational components (detail card, status views).
- [x] Raise `useLocations` `staleTime` (dataset rarely changes) to cut redundant refetches.

### Tier 3 — documented future (NOT built here)
- Marker clustering for large datasets (client lib or server-side; see `docs/FUTURE_SCALABILITY.md`).
- React Compiler (SDK 54 `experiments.reactCompiler`) for automatic memoization.
- Prefetch list at app launch; image prefetch on marker tap.

## Acceptance Criteria
- [x] Detail screen renders instantly when navigated from the map list/marker (no spinner
      when the location is already cached); still revalidates.
- [x] Detail image uses `expo-image` with caching.
- [x] Map markers use `tracksViewChanges={false}`; region + markers are memoized.
- [x] `typecheck`, `lint`, and `test` pass; no `any`, no casting; layer boundaries unchanged.
- [x] App still bundles (`expo export`).

## Risks
- `expo-image` in Jest — may need a mock if the preset doesn't handle it. Mitigate by mocking
  in the component test if required.
- `initialData` staleness — pair with `initialDataUpdatedAt` so it still refetches per `staleTime`.

## Notes
- Purely additive: no API/contract changes, no behaviour change beyond faster/cached rendering.
- For ~28 locations the app was already smooth; the biggest user-visible wins are instant detail
  (initialData) and image caching (expo-image).

## Completion Status

Completed: true

### Verification evidence (2026-06-13)

- **Tier 1 shipped:**
  - `useLocation` seeds `initialData` from the list cache (+ `initialDataUpdatedAt`) → detail
    renders instantly when arriving from the map, still revalidates per `staleTime`.
  - `LocationDetailCard` now uses `expo-image` (`cachePolicy="memory-disk"`, `contentFit`,
    `transition`, blurhash placeholder).
  - Map markers set `tracksViewChanges={false}`.
- **Tier 2 shipped:** `computeRegion` memoized; markers extracted to a `React.memo`
  `LocationMarker` with a stable `onSelect`; status views + detail card wrapped in `React.memo`;
  `useLocations` `staleTime` raised to 5 min.
- **Tier 3:** documented as future (clustering, React Compiler, prefetch) — not built.
- **Gates:** `typecheck` ✓ (0), `lint` ✓ (0, no any/casting), `test` ✓ (40/40),
  `expo export` ✓ (1144 modules, exit 0).

### Toolchain fix made during this phase

Adding `expo-image` reshuffled the dependency tree and surfaced an ESLint crash
(`balanced is not a function`): `brace-expansion` was resolving an incompatible
`balanced-match@4.0.4` (object export) instead of the function-export line. Fixed with a pnpm
override `balanced-match: 1.0.2` (root `package.json`) and a clean lockfile regenerate; SDK-54
versions unchanged (expo 54.0.35, RN 0.81.5, react 19.1.0).

Also scoped the mobile `tsconfig`/ESLint to exclude the sibling `webapp/` and `backend/`
packages (they have their own configs), which `tsc`/`eslint .` had started traversing.
