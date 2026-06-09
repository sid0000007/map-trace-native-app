# Phase 0 — Architecture & Planning

## Objective

Establish a complete, agreed-upon plan and architecture before any implementation
begins, so that every later phase is executed against a stable contract.

## Scope

- In scope: planning artefacts, architecture decisions, API contract, domain model,
dataset shape, folder structure, tooling choices.
- Out of scope: any application or backend code.

## Tasks

- [x] Confirm finalized architecture decisions (frontend stack, patterns, backend, data source).
- [x] Define the **Location domain model** (fields, types, optionality).
- [x] Define the **API contract**:
  - `GET /locations` → `Location[]`
  - `GET /locations/:id` → `Location` | `404 { error }`
  - Error shape, status codes, CORS, content-type.
- [x] Define the **validation strategy** (Zod schemas as the single parse boundary).
- [x] Define the **domain-driven folder structure** (`src/domains/locations/...`).
- [x] Define the **layer contracts**: `ILocationRepository`, `LocationService`, hooks.
- [x] Choose the **sample dataset** (count, geographic spread, fields) and include
  ```
  at least one invalid-coordinate fixture for edge-case testing.
  ```
- [x] Define **tooling**: ESLint, Prettier, Jest + React Native Testing Library, wrangler.
- [x] Produce planning files: `planner.md`, `phase.env`, `phases/phase-0..6.md`.

## Acceptance Criteria

- [x] `planner.md`, `phase.env`, and all seven phase files exist and are consistent.
- [x] Location domain model is documented and unambiguous.
- [x] API contract (endpoints, payloads, errors, status codes) is documented.
- [x] Folder structure and layer interfaces are documented.
- [x] **Explicit approval** to begin implementation is recorded.

## Risks

- Ambiguous data model leads to rework in Phases 2 & 3 → mitigate by freezing the
contract now and validating with Zod on both ends conceptually.
- Over-engineering the MVP → keep future-scalability items as docs only.

## Notes

- The data contract defined here is the shared truth for Phase 2 (Worker) and
Phase 3 (client parsing). Any change must update both phases.
- Proposed `Location` model (to ratify): `id`, `name`, `description`, `latitude`,
`longitude`, `category?`, `address?`, `imageUrl?`.

## Ratified Decisions (2026-06-10)

Resolved the open questions from `handover.md` §9 with the user:

1. **Project root:** `/Users/siddharth/Desktop/draftbit/` — a fresh repository,
   separate from the unrelated `draft_tool` (eFootball) project. Planning files
   (`planner.md`, `phase.env`, `phases/`, `handover.md`) live here.
2. **Location model:** Ratified exactly as proposed above — no field changes. This
   is the frozen contract for Phase 2 (Worker) and Phase 3 (client parsing).
3. **Package manager:** **pnpm** — with `.npmrc` set to `node-linker=hoisted` so
   Expo/Metro resolve native modules correctly.
4. **Sample dataset:** ~25–30 locations across multiple cities/regions, including
   **≥1 invalid-coordinate fixture** for edge-case testing.

## Completion Status

Completed: true