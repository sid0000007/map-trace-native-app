# Locations Map — React Native (Expo) + Cloudflare Worker

A production-quality MVP that shows geographic locations on a map and lets you drill
into any one of them. A React Native (Expo) client fetches data from a custom REST API
running on a Cloudflare Worker, parses and validates it, and renders it with robust
loading, error, empty, and retry behaviour.

- **Live API:** https://draftbit-locations-api.siddharth11tha.workers.dev
  - [`/locations`](https://draftbit-locations-api.siddharth11tha.workers.dev/locations) ·
    [`/locations/par-eiffel`](https://draftbit-locations-api.siddharth11tha.workers.dev/locations/par-eiffel)

## Screens

- **Map** — a marker per (valid) location; tap a marker to open its detail.
- **Location Detail** — image, name, category, description, address, and coordinates.

> Screenshots: run the app on a simulator/device (see below) and capture the Map and
> Detail screens. (The repo is verified via automated tests + an end-to-end data-path
> check against the deployed API; see [Testing](#testing).)

## Tech stack

| Layer | Choice |
|-------|--------|
| Mobile | React Native, **Expo SDK 54**, Expo Router, TypeScript (strict) |
| Server state | **TanStack Query** (caching, retries, refetch) |
| Maps | **react-native-maps** |
| Validation | **Zod** (single parse boundary in the repository layer) |
| Backend | **Cloudflare Worker** serving a static JSON dataset (no framework) |
| Tests | Jest + React Native Testing Library (app); Vitest (Worker) |

The architecture follows SOLID with a **Repository** + **Service** layering and explicit
interfaces at every boundary. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Repository layout

```
.
├── app/                       # Expo Router routes (Map = index, Detail = location/[id])
├── src/
│   ├── domains/locations/     # Domain-driven feature module
│   │   ├── types/             # Location model + Zod schema (the contract)
│   │   ├── repositories/      # ILocationRepository + HttpLocationRepository
│   │   ├── services/          # LocationService (+ coordinate rules)
│   │   ├── hooks/             # useLocations, useLocation
│   │   └── components/        # LocationMap, LocationDetailCard, status views
│   └── lib/
│       ├── http/              # IHttpClient, FetchHttpClient, errors, error-message
│       ├── query/             # QueryClient + provider
│       └── config/            # env (API base URL) + composition root
├── backend/                   # Cloudflare Worker (API + dataset) — see backend/README.md
├── __tests__/                 # App unit + component tests
├── __mocks__/                 # react-native-maps, expo-router test mocks
├── docs/                      # Architecture, decisions, challenges, future scalability
└── phases/                    # Planning artefacts (planner + per-phase specs)
```

## Prerequisites

- **Node.js** ≥ 20 (developed on 22) and **pnpm** ≥ 10 (`npm i -g pnpm`)
- For the mobile app: the **Expo Go** app on a device, or an iOS Simulator / Android Emulator
- For the Worker: a **Cloudflare** account (only needed to deploy)

This is a pnpm project. The app uses `.npmrc` (`node-linker=hoisted`) for Expo + pnpm.

## Run the app

```bash
pnpm install
pnpm start            # Expo dev server — press i (iOS), a (Android), or scan the QR in Expo Go
```

The app **defaults to the deployed Worker**, so it works out of the box. To point it at a
local Worker instead, set the env var before starting:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8787 pnpm start
```

## Testing

```bash
pnpm typecheck        # tsc --noEmit (strict; no `any`, no casting — enforced by ESLint)
pnpm lint             # eslint
pnpm test             # jest — 40 tests (unit + component)
pnpm test:coverage    # coverage with thresholds (≥80% repositories/services/parsing)
```

Coverage is **100%** for the repository, service, and parsing layers, and >85% for the
HTTP layer. Every row of the edge-case matrix is covered — see
[docs/CHALLENGES.md](docs/CHALLENGES.md#edge-case-matrix) and `phases/phase-4.md`.

## The Worker (backend)

Full details in [backend/README.md](backend/README.md).

```bash
cd backend
pnpm install
pnpm rebuild esbuild workerd sharp   # if pnpm skipped native build scripts
pnpm dev                             # wrangler dev → http://localhost:8787
pnpm test                            # vitest — 7 tests (routes, errors, CORS, contract)
pnpm deploy                          # wrangler deploy (requires Cloudflare auth)
```

### Example requests (production)

```bash
BASE=https://draftbit-locations-api.siddharth11tha.workers.dev
curl $BASE/locations
curl $BASE/locations/par-eiffel
curl -i $BASE/locations/does-not-exist   # 404 { "error": ... }
curl -i -X POST $BASE/locations          # 405 + Allow: GET, OPTIONS
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layering, patterns, folder walkthrough
- [docs/DECISIONS.md](docs/DECISIONS.md) — decisions & tradeoffs, what was deferred and why
- [docs/CHALLENGES.md](docs/CHALLENGES.md) — real problems hit and how they were solved + edge cases
- [docs/FUTURE_SCALABILITY.md](docs/FUTURE_SCALABILITY.md) — path to a real geospatial backend
- [planner.md](phases/planner.md) and [phases/](phases/) — the planning artefacts and per-phase specs

## Deploying your own copy of the Worker

```bash
cd backend
npx wrangler login                   # or set CLOUDFLARE_API_TOKEN
pnpm deploy
```

Then either set `EXPO_PUBLIC_API_BASE_URL` to your Worker URL, or update the default in
`src/lib/config/env.ts`.
