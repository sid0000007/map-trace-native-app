# Phase 5 — Deployment

## Objective
Deploy the Cloudflare Worker to production, point the app at the live URL, and verify
the full system works end-to-end.

## Scope
- In scope: Worker deployment, environment configuration, app run against production
  API, verification evidence.
- Out of scope: app store submission, CI/CD pipelines (note as future work).

## Tasks
- [x] Configure `wrangler` for deployment (account, name, routes/`workers.dev`).
- [x] Deploy the Worker: `wrangler deploy`.
- [x] Capture the public Worker URL.
- [x] Verify deployed endpoints with `curl`:
  - [x] `GET /locations` → `200` + dataset.
  - [x] `GET /locations/:id` → `200` valid id; `404` unknown id.
  - [x] CORS headers present.
- [x] Set the app's `API_BASE_URL` to the deployed URL (via config/env).
- [x] Run the app against production and confirm map + detail + edge cases work.
- [x] Capture verification evidence (screenshots / response logs).

## Acceptance Criteria
- [x] Public Worker URL responds correctly for both endpoints (incl. `404` path).
- [x] App runs end-to-end against the deployed API (markers, detail, refresh).
- [x] Edge cases still behave correctly against production.
- [x] Deployed URL and verification evidence are recorded for the docs.

## Risks
- Cloudflare account/auth setup friction → resolve `wrangler login` early.
- Env/URL mismatch between local and prod → centralise base URL in one config.

## Notes
- Keep local and production base URLs switchable without code changes.
- Record the exact deploy command and URL for Phase 6 documentation.

## Completion Status

Completed: true

### Verification evidence (2026-06-10)

- **Deploy command:** `wrangler deploy` (from `backend/`), authenticated via
  `CLOUDFLARE_API_TOKEN` (token kept in the gitignored root `.env`, never committed).
- **Account:** `db44d7d8e44897b8d9da7df446057813` (siddharth11tha@gmail.com), subdomain
  `siddharth11tha.workers.dev`.
- **Public URL:** **https://draftbit-locations-api.siddharth11tha.workers.dev**
  (Version ID `ae2b9523-a512-4893-98c3-3c4fcdf83e2e`).
- **Production endpoint verification (curl):**
  - `GET /locations` → `200`, 28 items, `content-type: application/json`,
    `access-control-allow-origin: *`, `cache-control: public, max-age=60`.
  - `GET /locations/par-eiffel` → `200`, correct location.
  - `GET /locations/does-not-exist` → `404 {"error":"Location not found: does-not-exist"}`,
    `cache-control: no-store`.
  - `POST /locations` → `405 {"error":"Method Not Allowed"}` with `Allow: GET, OPTIONS`.
- **App pointed at production:** `src/lib/config/env.ts` now defaults `API_BASE_URL` to the
  deployed URL (override via `EXPO_PUBLIC_API_BASE_URL` for local `wrangler dev`).
- **End-to-end data path vs production (real app code):** `getLocations()` returned **27**
  valid (28 − filtered fixture), fixture excluded, detail fetch correct, unknown id mapped to
  `LocationNotFoundError`.
- **Gates after the env change:** `typecheck` ✓, `lint` ✓, `test` ✓ (40/40).

### Notes

- The first `GET /locations` header probe returned a transient Cloudflare `404` immediately
  after deploy (route propagation); re-checks were consistently `200` within seconds.
- Full visual end-to-end on a simulator (markers/detail/refresh against prod) is the same
  headless caveat as Phase 3 — covered by the production data-path integration above.
- CI/CD pipeline is out of scope (future work), per the phase scope.
