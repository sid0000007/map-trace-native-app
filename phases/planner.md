# Project Planner — Locations Map App

> High-level roadmap and single point of orientation for the project.
> Detailed, executable specs live in [`phases/`](./phases). Progress flags live in [`phase.env`](./phase.env).

---

## 1. Project Overview

A production-quality MVP mobile application that displays geographic locations on a
map and lets a user drill into the details of any single location. Location data is
served by a custom REST API deployed to Cloudflare Workers; the mobile client fetches,
parses, and renders that data with robust loading, error, and retry behaviour.

**Goals**
- Two-screen mobile app: **Map Screen** (markers) → **Location Detail Screen**.
- All location data retrieved via API and parsed/validated on the client.
- Backend/API deployed to **Cloudflare Workers**.
- Clean, testable architecture (SOLID, Repository + Service layers, explicit interfaces).
- Comprehensive automated tests (unit + component) and explicit edge-case handling.
- Public GitHub repository with full documentation.

**Non-Goals (MVP)**
- No real database (static JSON dataset served by the Worker).
- No authentication, write operations, or user accounts.
- No live geospatial querying — documented as future scalability only.

---

## 2. Architecture Overview

### 2.1 Frontend
- **React Native** + **Expo SDK 54**
- **Expo Router** (file-based navigation)
- **TypeScript** (strict)
- **TanStack Query** (server-state, caching, retries, refetch)
- **react-native-maps** (map + markers)

### 2.2 Architectural Patterns
- **SOLID principles** throughout.
- **Repository Pattern** — abstracts the data source behind an interface
  (`ILocationRepository`). Swappable (HTTP today, DB tomorrow) with no UI change.
- **Service Layer Pattern** — business logic / orchestration
  (`LocationService`) sits between UI and repositories.
- **Domain-driven folder organization** — code grouped by domain (`locations`),
  not by technical type.
- **Explicit interfaces** — every layer boundary is an interface.

### 2.3 Layering (data flow)

```
UI (Screens / Components)
   │  uses hooks
React Query hooks  ──────────►  Service Layer (LocationService)
                                     │  depends on interface
                                Repository (ILocationRepository)
                                     │  implemented by
                                HttpLocationRepository (fetch + Zod parse)
                                     │  HTTP
                                Cloudflare Worker  →  GET /locations, /locations/:id
                                     │
                                Static JSON dataset
```

### 2.4 Backend
- **Cloudflare Worker** serving a static JSON dataset.
- REST endpoints:
  - `GET /locations` — list all locations.
  - `GET /locations/:id` — single location, `404` if not found.
- JSON responses, CORS enabled, sensible cache headers.

### 2.5 Future Scalability (documentation only — not built in MVP)
- PostgreSQL + **PostGIS** for geospatial storage.
- Geospatial indexing via **R-Tree** / **GiST** indexes.
- **Radius search** (locations within N km) and server-side **clustering**.
- **Redis caching** layer in front of the database.

---

## 3. Deliverables

| # | Deliverable | Where |
|---|-------------|-------|
| D1 | Cloudflare Worker API (`/locations`, `/locations/:id`) | `backend/` (or `worker/`) |
| D2 | Expo SDK 54 app — Map + Detail screens | `app/`, `src/` |
| D3 | Repository + Service layers with explicit interfaces | `src/domains/locations/` |
| D4 | Shared/validated types (Zod schemas) | `src/domains/locations/types` |
| D5 | Unit tests (repository, service, parsing) | `__tests__/` co-located |
| D6 | Component tests (Map, Detail, error states) | `__tests__/` co-located |
| D7 | Edge-case handling (see matrix in Phase 4) | across app |
| D8 | Deployed Worker URL + verification evidence | docs |
| D9 | Public GitHub repository | GitHub |
| D10 | Documentation (architecture, decisions, tradeoffs, deployment, challenges) | `README.md`, `docs/` |

---

## 4. Phase Summary Table

| Phase | Title                   | Status  |
| ----- | ----------------------- | ------- |
| 0     | Architecture & Planning | Completed |
| 1     | Project Setup           | Completed |
| 2     | Backend API             | Completed |
| 3     | Frontend Core           | Completed |
| 4     | Testing                 | Completed |
| 5     | Deployment              | Completed |
| 6     | Documentation           | Pending |

> Status values: **Pending → In Progress → Completed**. Keep this table, the matching
> phase file, and `phase.env` in lock-step after every phase.

---

## 5. Phase Details

### Phase 0 — Architecture & Planning
- **Goals:** Lock the architecture, data contract, folder structure, and tooling
  choices. Produce all planning artefacts and get sign-off before any code.
- **Deliverables:** `planner.md`, `phase.env`, `phases/phase-0..6.md`, API contract draft,
  location data model, dataset shape.
- **Exit Criteria:** All planning files exist and are internally consistent; API contract
  and domain model are agreed; **explicit approval received** to begin implementation.

### Phase 1 — Project Setup
- **Goals:** Initialise the Expo SDK 54 + TypeScript project and the domain-driven
  folder structure; wire up tooling (lint, format, test, Expo Router, TanStack Query).
- **Deliverables:** Bootable Expo app, folder skeleton, base providers (QueryClient),
  config, repo scaffolding, empty interfaces/stubs.
- **Exit Criteria:** `expo start` runs a blank app; lint/typecheck/test scripts pass on
  an empty suite; folder structure matches the agreed layout.

### Phase 2 — Backend API
- **Goals:** Build and locally run the Cloudflare Worker serving the static dataset
  through the two REST endpoints.
- **Deliverables:** Worker source, static JSON dataset, routing, CORS, error responses,
  `wrangler` config, local run instructions.
- **Exit Criteria:** `GET /locations` and `GET /locations/:id` return correct payloads
  locally; unknown id returns `404`; responses validate against the agreed contract.

### Phase 3 — Frontend Core
- **Goals:** Implement repository → service → hooks → screens. Build Map and Detail
  screens, navigation, and TanStack Query integration.
- **Deliverables:** `HttpLocationRepository`, `LocationService`, query hooks, Map Screen
  with markers, Detail Screen, Expo Router navigation, loading/error/empty UI states.
- **Exit Criteria:** App fetches live data from the Worker, renders markers, navigates to
  detail, and shows correct loading/error/empty states. No `any`; layers respect interfaces.

### Phase 4 — Testing
- **Goals:** Achieve meaningful coverage of the data + domain layers and the screens,
  and prove every edge case is handled.
- **Deliverables:** Unit tests (repository, service, parsing), component tests (Map,
  Detail, error states), edge-case matrix verified, retry + pull-to-refresh tested.
- **Exit Criteria:** All tests pass; every edge case in the Phase 4 matrix has a test or
  documented manual verification; coverage targets met.

### Phase 5 — Deployment
- **Goals:** Deploy the Worker to Cloudflare and point the app at the live URL; verify
  end-to-end.
- **Deliverables:** Deployed Worker URL, environment configuration, app build/run against
  production API, verification evidence (screenshots/logs).
- **Exit Criteria:** Public Worker URL responds correctly for both endpoints; app works
  end-to-end against the deployed API.

### Phase 6 — Documentation
- **Goals:** Produce complete documentation and the final submission package; publish the
  public repo.
- **Deliverables:** `README.md` (setup, run, test, deploy), architecture doc, decisions &
  tradeoffs, challenges, future-scalability writeup, public GitHub repo.
- **Exit Criteria:** A new engineer can clone, run, test, and deploy from docs alone; all
  assignment requirements demonstrably met; repository is public.

---

## 6. Workflow Rules

1. Planning is created **top-down**: `planner.md` → phase files → (stop).
2. **No implementation** until approval is given.
3. Execute phases **one at a time, in order**.
4. After finishing each phase, in the same change:
   - Flip the flag in `phase.env`.
   - Update the **Status** in this file's Phase Summary Table.
   - Set `Completed: true` in the corresponding `phases/phase-N.md`.
5. A phase is "done" only when its **Acceptance Criteria** are fully satisfied.
