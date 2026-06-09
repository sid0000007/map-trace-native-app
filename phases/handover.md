# Session Handover — Locations Map App (React Native + Expo + Cloudflare Worker)

> **Purpose:** Preserve full context so a NEW session (in the correct project directory)
> can continue without losing anything. Read this top-to-bottom before doing anything.

---

## 0. TL;DR / Current State

- We are in the **planning-first** stage of a brand-new assignment.
- **Planning artefacts are DONE** (`planner.md`, `phase.env`, `phases/phase-0..6.md`).
- **No implementation code has been written yet** — we are waiting at the approval gate.
- ⚠️ **Wrong directory problem:** these planning files were created in
  `/Users/siddharth/Desktop/draft_tool/`, which is an **unrelated existing Next.js project**
  (an eFootball draft tool). This new assignment is a **separate React Native Expo app**
  and needs its **own fresh directory / repository**.

### Immediate next action for the new session
1. Create / move into the correct project directory (a fresh repo for the Expo app).
2. Move these planning files into it: `planner.md`, `phase.env`, `phases/`, `handover.md`.
3. Confirm the data model / API contract in `phase-0.md`.
4. Get explicit **approval**, then start **Phase 1** (Expo project setup).

---

## 1. What We Are Building (Assignment)

A production-quality MVP mobile app that shows locations on a map and a detail screen,
backed by a custom API on Cloudflare Workers.

**Two screens:**
- **Map Screen** — location markers.
- **Location Detail Screen** — single location info.

**Requirements:**
- Location data retrieved via API and parsed.
- Backend/API deployed to **Cloudflare Workers**.
- Public **GitHub** repository.
- Documentation: architecture, decisions, tradeoffs, deployment, challenges.

---

## 2. Finalized Architecture (do not re-litigate)

**Frontend:** React Native, Expo SDK 54, Expo Router, TypeScript, TanStack Query,
react-native-maps.

**Patterns:** SOLID, Repository Pattern, Service Layer Pattern, domain-driven folder
organization, explicit interfaces.

**Backend:** Cloudflare Worker serving a **static JSON dataset** via REST:
- `GET /locations` → `Location[]`
- `GET /locations/:id` → `Location` | `404 { error }`

**Data flow / layering:**
```
UI (Screens/Components)
  → React Query hooks (useLocations, useLocation)
    → LocationService (business logic, e.g. filter invalid coords)
      → ILocationRepository  (interface)
        → HttpLocationRepository (fetch + Zod parse — single parse boundary)
          → Cloudflare Worker → static JSON dataset
```

**Future scalability (DOCUMENT ONLY — do NOT build):** PostgreSQL, PostGIS, geospatial
indexing, R-Tree, GiST indexes, radius search, clustering, Redis caching.

---

## 3. Proposed Location Domain Model (to ratify in Phase 0)

```
Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  category?: string
  address?: string
  imageUrl?: string
}
```
- Validate with **Zod** at the repository boundary.
- Dataset must include at least one **invalid-coordinate** fixture for edge-case tests.
- Error response shape: `{ error: string }`.

---

## 4. Phase Plan (7 phases, tracked independently)

| Phase | Title                   | Status  |
| ----- | ----------------------- | ------- |
| 0     | Architecture & Planning | Pending |
| 1     | Project Setup           | Pending |
| 2     | Backend API             | Pending |
| 3     | Frontend Core           | Pending |
| 4     | Testing                 | Pending |
| 5     | Deployment              | Pending |
| 6     | Documentation           | Pending |

Full Goals / Deliverables / Exit Criteria live in `planner.md` and each `phases/phase-N.md`.

**Phase intent (short):**
- **0** Plan + freeze contract (DONE, awaiting approval).
- **1** Expo SDK 54 + TS app boots; domain folder structure; tooling (lint/typecheck/jest); empty interface stubs.
- **2** Cloudflare Worker + static dataset + 2 endpoints + CORS + 404; runs via `wrangler dev`.
- **3** HttpLocationRepository → LocationService → hooks → Map + Detail screens + Expo Router nav + loading/error/empty states + pull-to-refresh.
- **4** Jest + RNTL: unit (repo/service/parsing) + component (Map/Detail/error) + 9-row edge-case matrix.
- **5** `wrangler deploy`, point app at live URL, verify end-to-end.
- **6** README + architecture/decisions/tradeoffs/challenges/future-scalability docs; publish public repo.

---

## 5. Edge Cases That Must Be Handled (Phase 4 matrix)
API unavailable · empty dataset · invalid coordinates · location not found · API timeout ·
slow network · loading state · retry mechanism · pull to refresh.

---

## 6. Testing Requirements
- **Unit:** repository layer, service layer, data parsing.
- **Component:** Map Screen, Detail Screen, error states.
- **Tools:** Jest + React Native Testing Library.
- Coverage target ≥ 80% for repositories/services/parsing.

---

## 7. Planning System / Workflow Rules (IMPORTANT — follow exactly)

- **Planning-first.** No implementation until the user gives explicit **approval**.
- Execute phases **one at a time, in order**.
- After finishing each phase, in the SAME change, update all three:
  1. Flip the flag in `phase.env` (e.g. `PHASE_1_COMPLETED=true`).
  2. Update the **Status** column in `planner.md`'s phase table.
  3. Set `Completed: true` in the matching `phases/phase-N.md`.
- A phase is done only when its **Acceptance Criteria** are fully met.

### Files that ARE the source of truth
- `phase.env` — progress flags (all currently `false`).
- `planner.md` — roadmap + phase table.
- `phases/phase-0.md … phase-6.md` — detailed specs, structured as:
  Objective / Scope / Tasks / Acceptance Criteria / Risks / Notes / Completion Status.

---

## 8. User Preferences & Project Rules to Respect

- ❌ **Never use casting.**
- ❌ **No `any`** (TS strict; ESLint enforces).
- ✅ Any Zod schema for a server/client file must be placed in a relevant
  `packages/types` (or `src/domains/.../types`) folder with a sensible name.
- ✅ Use **pnpm** (per the user's general workflow) unless the Expo template dictates otherwise — confirm at Phase 1.
- Be a Principal Engineer: plan before coding; surface tradeoffs; don't over-engineer the MVP.

---

## 9. Open Questions for the New Session
1. **Where** is the correct directory / new repo for the Expo app? (Must NOT live inside the draft_tool repo.)
2. **Ratify the Location model** in §3 — any field changes?
3. Package manager for the Expo app: **pnpm** vs npm (Expo defaults to npm/yarn)?
4. Sample dataset: how many locations, which region(s)?

---

## 10. Status Snapshot

- Planning files: **created** ✅
- Approval to implement: **NOT yet given** ⛔
- Implementation: **not started**
- Blocker: move to correct directory + get approval.

_Next session: start by resolving §0 immediate actions and §9 open questions._
