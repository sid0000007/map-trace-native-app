# Phase 2 — Backend API

## Objective
Build a Cloudflare Worker that serves the static location dataset through the two
agreed REST endpoints, runnable locally and conformant to the Phase 0 contract.

## Scope
- In scope: Worker source, static JSON dataset, routing, CORS, error handling,
  `wrangler` config, local run instructions.
- Out of scope: deployment to Cloudflare (Phase 5), databases, write operations.

## Tasks
- [x] Scaffold the Worker project with `wrangler` and TypeScript.
- [x] Create the static JSON dataset matching the Phase 0 `Location` model
      (include diverse coordinates + at least one edge-case fixture).
- [x] Implement routing:
  - [x] `GET /locations` → `200` `Location[]`.
  - [x] `GET /locations/:id` → `200` `Location`, or `404 { error }` if not found.
  - [x] Unknown routes → `404`; wrong method → `405`.
- [x] Add CORS headers (allow the app origin / `*` for MVP) and handle preflight.
- [x] Set `Content-Type: application/json` and sensible `Cache-Control`.
- [x] Centralise error responses in a consistent shape `{ error: string }`.
- [x] Document local run: `wrangler dev` + example `curl` calls.

## Acceptance Criteria
- [x] `GET /locations` returns the full dataset as valid JSON locally.
- [x] `GET /locations/:id` returns the correct single location.
- [x] Unknown id returns `404` with the agreed error shape.
- [x] Responses validate against the Phase 0 contract (and the client's Zod schema).
- [x] CORS allows the Expo client to call the API without errors.

## Risks
- Contract drift between Worker payload and client schema → validate the dataset
  against the shared schema as part of this phase.
- CORS misconfiguration surfaces only at runtime → test with a real fetch from the app.

## Notes
- Dataset is the source of truth for the MVP; keep it small but realistic.
- Structure the dataset access behind a function so a future DB swap is isolated.

## Completion Status

Completed: true

### Verification evidence (2026-06-10)

- **Location:** `backend/` — standalone, dependency-light package (kept separate from the
  Expo root so the verified Phase 1 build is untouched). No web framework; routing is a few
  lines of standard `Request`/`Response`.
- **Dataset:** 28 real-world landmarks across 9 cities (SF, NYC, London, Paris, Tokyo, Sydney,
  Rome, Barcelona, Rio, Cairo) + 1 deliberate out-of-range fixture (`loc-invalid`). Validated
  against the server Zod schema (`src/types/location.ts`) at module load — fails fast on drift.
- **Data access behind functions** (`src/data/locations.ts`: `getAllLocations`,
  `getLocationById`) so a future DB swap is isolated.
- **Endpoints (verified live via `wrangler dev` + curl):**
  - `GET /locations` → `200`, 28 items, includes the fixture.
  - `GET /locations/par-eiffel` → `200`, correct single location.
  - `GET /locations/does-not-exist` → `404 { "error": ... }`, `Cache-Control: no-store`.
  - `POST /locations` → `405` with `Allow: GET, OPTIONS`.
  - `OPTIONS /locations` → `204` preflight.
  - Headers on success: `Content-Type: application/json; charset=utf-8`,
    `Cache-Control: public, max-age=60`, `Access-Control-Allow-Origin: *`.
- **Tests:** vitest, 7 passing — routes, 404/405, CORS, and dataset-validates-against-schema.
- **Gates:** `typecheck` ✓ (exit 0), `test` ✓ (7/7).
- **Contract:** the dataset is validated against the same Zod contract the client parses, so
  payloads cannot drift (Phase 2 risk mitigated). Deployment to Cloudflare is deferred to Phase 5.

### Note for later phases

- `backend/package.json` sets `pnpm.onlyBuiltDependencies` for `esbuild`/`workerd`/`sharp`
  (needed for `wrangler dev`). On a fresh clone run `pnpm rebuild esbuild workerd sharp` if the
  binaries are skipped.
- Phase 3 should point the client at `http://localhost:8787` (already the `API_BASE_URL` default).
