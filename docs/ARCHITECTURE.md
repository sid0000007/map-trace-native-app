# Architecture

## Overview

The system is a two-tier MVP:

- **Client** — a React Native (Expo) app with a clean, layered data path.
- **Server** — a Cloudflare Worker exposing a small REST API over a static dataset.

The guiding principle is that **each layer depends only on the interface of the layer
beneath it**, never on a concrete implementation. This keeps the data source swappable
(HTTP today, a database tomorrow) without touching the UI, and makes every layer testable
in isolation.

## Layering (data flow)

```
┌──────────────────────────────────────────────────────────────┐
│ UI — Screens & presentational components                       │
│   app/index.tsx (Map)      app/location/[id].tsx (Detail)      │
│   components/: LocationMap, LocationDetailCard, status views   │
└───────────────┬────────────────────────────────────────────────┘
                │ consume hooks (no data logic in the UI)
┌───────────────▼────────────────────────────────────────────────┐
│ Hooks — TanStack Query                                          │
│   useLocations()            useLocation(id)                     │
└───────────────┬────────────────────────────────────────────────┘
                │ call the service singleton
┌───────────────▼────────────────────────────────────────────────┐
│ Service — business logic / orchestration                       │
│   LocationService  (filters invalid coordinates, not-found)    │
└───────────────┬────────────────────────────────────────────────┘
                │ depends on ILocationRepository (interface)
┌───────────────▼────────────────────────────────────────────────┐
│ Repository — data access + THE Zod parse boundary              │
│   HttpLocationRepository  (fetch → zod.parse → Location)       │
└───────────────┬────────────────────────────────────────────────┘
                │ depends on IHttpClient (interface)
┌───────────────▼────────────────────────────────────────────────┐
│ HTTP client — transport                                         │
│   FetchHttpClient  (base URL, timeout, error mapping)          │
└───────────────┬────────────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼────────────────────────────────────────────────┐
│ Cloudflare Worker  →  GET /locations, GET /locations/:id       │
│   routing · CORS · errors  →  static JSON dataset               │
└──────────────────────────────────────────────────────────────┘
```

## Patterns and principles

### SOLID

- **Single Responsibility** — transport (`FetchHttpClient`), validation + access
  (`HttpLocationRepository`), business rules (`LocationService`), and presentation
  (components) are each isolated.
- **Open/Closed** — new data sources are added by implementing `ILocationRepository`,
  not by editing existing layers.
- **Liskov** — any `ILocationRepository` (HTTP, in-memory, DB) is substitutable; the
  service tests use the real repository with a fake `IHttpClient`.
- **Interface Segregation** — interfaces are minimal (`IHttpClient.getJson`,
  `ILocationRepository.getLocations/getLocation`).
- **Dependency Inversion** — high-level layers depend on interfaces; concretes are wired
  only in the composition root (`src/lib/config/locations.ts`).

### Repository Pattern

`ILocationRepository` abstracts "where locations come from". `HttpLocationRepository` is
the only place that knows about HTTP and is the **single Zod parse boundary** — raw JSON
is validated into `Location` objects here and nowhere else. A 404 is translated into a
domain `LocationNotFoundError` so upper layers never branch on status codes.

### Service Layer Pattern

`LocationService` holds business rules. The key one: locations with invalid/out-of-range
coordinates are filtered out **in the service**, never in the UI — so the map only ever
receives renderable markers, and a single bad row is dropped rather than failing the list.

### Explicit interfaces + composition root

Layers reference interfaces (`IHttpClient`, `ILocationRepository`). The concrete graph is
assembled once in `createLocationService()` and exposed as a singleton the hooks consume.
Swapping the backend is a one-line change there.

## Folder walkthrough

| Path | Responsibility |
|------|----------------|
| `app/` | Expo Router routes. `index.tsx` = Map, `location/[id].tsx` = Detail, `_layout.tsx` = providers + stack. |
| `src/domains/locations/types/` | `Location` model + Zod schema — the shared contract. |
| `src/domains/locations/repositories/` | `ILocationRepository` + `HttpLocationRepository` (parse boundary). |
| `src/domains/locations/services/` | `LocationService` + `location-rules` (coordinate validity). |
| `src/domains/locations/hooks/` | `useLocations`, `useLocation`, query-key factory. |
| `src/domains/locations/components/` | Presentational: `LocationMap`, `LocationDetailCard`, status views. |
| `src/lib/http/` | `IHttpClient`, `FetchHttpClient`, typed errors, error-message mapping. |
| `src/lib/query/` | QueryClient factory + provider. |
| `src/lib/config/` | `env` (API base URL) + composition root. |
| `backend/` | Cloudflare Worker: routing, CORS, dataset, server-side Zod contract. |

## Contract & no-drift guarantee

Both client and Worker validate against a Zod schema of the same `Location` shape. The
Worker validates its dataset at module load, so a malformed row fails fast at deploy/start
rather than reaching a client. The client re-validates on receipt (defence in depth and
protection against partial/garbled responses).
