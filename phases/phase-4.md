# Phase 4 — Testing

## Objective
Prove correctness of the data + domain layers and the screens, and verify that every
required edge case is handled, using Jest and React Native Testing Library.

## Scope
- In scope: unit tests (repository, service, parsing), component tests (Map, Detail,
  error states), edge-case verification, retry + pull-to-refresh tests.
- Out of scope: backend deployment, new features.

## Tasks
### Unit tests
- [x] **Repository layer** — request shaping, success path, error mapping, timeout.
- [x] **Service layer** — orchestration, invalid-coordinate filtering, not-found.
- [x] **Data parsing** — Zod schema accepts valid, rejects malformed/missing fields.

### Component tests
- [x] **Map Screen** — renders markers, marker tap navigation, loading/empty/error.
- [x] **Detail Screen** — renders fields, loading, not-found, error.
- [x] **Error states** — error UI + retry triggers refetch.

### Edge-case matrix (each must have a test or documented manual verification)
| # | Edge case | Expected behaviour |
|---|-----------|--------------------|
| 1 | API unavailable | Error state + retry, no crash |
| 2 | Empty dataset | Empty state message, map renders |
| 3 | Invalid coordinates | Filtered out / safely skipped |
| 4 | Location not found | Detail shows not-found state (`404`) |
| 5 | API timeout | Times out gracefully → error + retry |
| 6 | Slow network | Loading state persists, no duplicate fetch storms |
| 7 | Loading state | Spinner/skeleton shown while fetching |
| 8 | Retry mechanism | Retry re-issues request and recovers |
| 9 | Pull to refresh | List re-fetches and updates |

## Acceptance Criteria
- [x] All unit and component tests pass.
- [x] Every row in the edge-case matrix is covered by a test or documented verification.
- [x] Coverage targets met for `repositories`, `services`, and parsing (target ≥ 80%).
- [x] `test`, `lint`, and `typecheck` all pass in CI/local.

## Risks
- Mocking `react-native-maps` and Expo Router can be brittle → use proper mocks/test utils.
- Timeout/slow-network tests flaky → use fake timers / controllable mocks.

## Notes
- Mock the HTTP boundary, not the service, for service tests (test real orchestration).
- Keep fixtures aligned with the Phase 2 dataset, including the invalid-coordinate item.

## Completion Status

Completed: true

### Verification evidence (2026-06-10)

- **Suite:** 40 tests across 9 suites, all passing (`pnpm test`). Unit + component split:
  - Unit: schema parse (accept/reject/missing/wrong-type), coordinate rules (ranges/boundaries/
    NaN/Infinity), `FetchHttpClient` (success/HttpError/Timeout/Network/bad-JSON), repository
    (parse + 404→`LocationNotFoundError` + rethrow), service (filtering + not-found), error-message.
  - Component: Map (loading/markers+nav/empty/error+retry/single-flight), Detail
    (loading→fields/not-found/error+retry/pull-to-refresh). Mocks for `react-native-maps` and
    `expo-router` under `__mocks__/`; `renderWithClient` test util.
- **Coverage (`pnpm test:coverage`, thresholds enforced ≥80%):**
  - repositories **100%**, services **100%**, types/parsing **100%**, lib/http **96.7% stmts /
    94.1% branch / 85.7% funcs / 100% lines**. All targeted layers exceed 80%.
- **Gates:** `test` ✓ (40/40), `test:coverage` ✓ (exit 0), `typecheck` ✓ (0), `lint` ✓ (0, no
  `any`/casting in tests or mocks).

### Edge-case matrix coverage

| # | Edge case | Covered by |
|---|-----------|------------|
| 1 | API unavailable | Map "error + retry" test; Detail error test (rejects) |
| 2 | Empty dataset | Map "empty state" test |
| 3 | Invalid coordinates | `LocationService` filtering unit test (fixture excluded) |
| 4 | Location not found | Detail "not-found state" test (`LocationNotFoundError`) |
| 5 | API timeout | `FetchHttpClient` → `TimeoutError` unit test |
| 6 | Slow network | Map "no duplicate fetch in flight" + persistent loading test |
| 7 | Loading state | Map + Detail loading-state tests |
| 8 | Retry mechanism | Map "retry recovers" (refetch → success); Detail retry re-issues |
| 9 | Pull to refresh | Detail `RefreshControl` onRefresh → refetch test |

### Notes

- App jest excludes `backend/` (it has its own vitest suite). Backend tests run via
  `cd backend && pnpm test` (7/7, verified in Phase 2).
- Detail error+retry asserts the retry re-issues the request (recovery-after-retry is asserted on
  the Map screen, whose query has no auto-retry, making the sequence deterministic).
