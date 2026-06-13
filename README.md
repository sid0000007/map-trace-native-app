# Locations Map — React Native (Expo) + Cloudflare Worker

  A production-quality MVP that shows geographic locations on a map and lets you drill into any
  one of them. A React Native (Expo) client fetches data from a custom REST API running on a
  Cloudflare Worker, parses and validates it, and renders it with robust loading, error, empty,
  and retry behaviour. A small Next.js web demo lets the same API be viewed in a browser with no
  install.

  - **Live API:** https://draftbit-locations-api.siddharth11tha.workers.dev
    - [`/locations`](https://draftbit-locations-api.siddharth11tha.workers.dev/locations) ·
      [`/locations/par-eiffel`](https://draftbit-locations-api.siddharth11tha.workers.dev/locations/par-eiffel)
  - **Live web demo:** _<add your Vercel URL here>_

  ## Screens

  - **Map** — a marker per (valid) location; tap a marker to open its detail.
  - **Location Detail** — image, name, category, description, address, coordinates, and a focused map.

  ## Tech stack

  | Layer | Choice |
  |-------|--------|
  | Mobile | React Native, **Expo SDK 54**, Expo Router, TypeScript (strict) |
  | Server state | **TanStack Query** (caching, retries, refetch) |
  | Maps | **react-native-maps** (mobile), **react-leaflet** (web) |
  | Images | **expo-image** (caching + blurhash) |
  | Validation | **Zod** (single parse boundary in the repository layer) |
  | Backend | **Cloudflare Worker** serving a static JSON dataset (no framework) |
  | Web demo | **Next.js** + **shadcn/ui** |
  | Tests | Jest + React Native Testing Library (app); Vitest (Worker) |

  Architecture follows SOLID with a **Repository** + **Service** layering and explicit interfaces
  at every boundary — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

  ## Repository layout

  ```
  .
  ├── app/                       # Expo Router routes (Map = index, Detail = location/[id])
  ├── src/                       # Mobile app: domains/locations + lib (http, query, config)
  ├── backend/                   # Cloudflare Worker (API + dataset) — its own package
  ├── webapp/                    # Next.js web demo — its own package
  ├── __tests__/  __mocks__/     # App tests + test mocks
  ├── docs/                      # Architecture, decisions, challenges, future scalability
  └── phases/                    # Planning artefacts (planner + per-phase specs)
  ```

  > This repo contains **three independent packages** — the mobile app (root), `backend/`, and
  > `webapp/` — each with its own `package.json` and installed separately.

  ---

  ## Setup

  ### Prerequisites

  - **Node.js** ≥ 20 (developed on 22) and **pnpm** ≥ 10 — `npm install -g pnpm`
  - **Mobile:** the **Expo Go** app on a phone, or **Xcode** (iOS Simulator) / **Android Studio** (emulator)
  - **Backend deploy (optional):** a **Cloudflare** account
  - This is a **pnpm** project; the root `.npmrc` sets `node-linker=hoisted` for Expo + pnpm.

  ### Clone

  ```bash
  git clone https://github.com/sid0000007/map-trace-native-app.git
  cd map-trace-native-app
  ```

  ### 1) Mobile app (root)

  ```bash
  pnpm install
  pnpm start            # Expo dev server — press i (iOS), a (Android), or scan the QR in Expo Go
  ```

  The app **defaults to the deployed Worker**, so it runs out of the box. To point it at a local
  Worker instead:

  ```bash
  EXPO_PUBLIC_API_BASE_URL=http://localhost:8787 pnpm start
  ```

  ### 2) Backend Worker (`backend/`)

  ```bash
  cd backend
  pnpm install
  pnpm rebuild esbuild workerd sharp   # if pnpm skipped native build scripts
  pnpm dev                             # wrangler dev → http://localhost:8787
  ```

  ### 3) Web demo (`webapp/`)

  ```bash
  cd webapp
  pnpm install
  pnpm dev                             # http://localhost:3000
  ```

  Also defaults to the deployed Worker; override with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8787`.

  ---

  ## Testing

  **Mobile app** (from the root):

  ```bash
  pnpm typecheck        # tsc --noEmit (strict; no `any`, no casting — enforced by ESLint)
  pnpm lint             # eslint
  pnpm test             # jest — 40 tests (unit + component)
  pnpm test:coverage    # coverage with thresholds (≥80% repositories/services/parsing)
  ```

  **Backend Worker** (from `backend/`):

  ```bash
  pnpm typecheck
  pnpm test             # vitest — routes, errors, CORS, dataset/contract
  ```

  ## API — example requests (production)

  ```bash
  BASE=https://draftbit-locations-api.siddharth11tha.workers.dev
  curl $BASE/locations
  curl $BASE/locations/par-eiffel
  curl -i $BASE/locations/does-not-exist   # 404 { "error": ... }
  curl -i -X POST $BASE/locations          # 405 + Allow: GET, OPTIONS
  ```

  ## Deploy

  - **Worker:** `cd backend && npx wrangler login && pnpm deploy` (or set `CLOUDFLARE_API_TOKEN`).
  - **Web demo:** import the repo on **Vercel**, set **Root Directory → `webapp`**, Deploy.

  After deploying the Worker, either set `EXPO_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`
  to your URL, or update the default in `src/lib/config/env.ts` (mobile) / `webapp/src/lib/config/env.ts`.

  ## Documentation

  - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layering, patterns, folder walkthrough
  - [docs/DECISIONS.md](docs/DECISIONS.md) — decisions & tradeoffs, what was deferred and why
  - [docs/CHALLENGES.md](docs/CHALLENGES.md) — problems hit + how they were solved, edge cases
  - [docs/FUTURE_SCALABILITY.md](docs/FUTURE_SCALABILITY.md) — path to a real geospatial backend
  - [phases/planner.md](phases/planner.md) and [phases/](phases/) — planning artefacts + per-phase specs

  ## Troubleshooting

  - **App shows stale UI after a code change:** stop Expo and restart with a cleared cache —
    `npx expo start -c` — then reload (`r` in the terminal, or `Cmd+R` in the iOS Simulator).
  - **`wrangler dev` fails / native binary missing:** in `backend/`, run
    `pnpm rebuild esbuild workerd sharp` (pnpm skips build scripts by default).
  - **Android map is blank:** `react-native-maps` needs a Google Maps key on Android; use the
    **iOS Simulator / Expo Go on iOS** (Apple Maps, no key) for a quick demo.