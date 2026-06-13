# Locations — Web Demo (Next.js)

A lightweight web client for the locations API, so the app can be demoed in a browser with
**no install**. It talks to the same Cloudflare Worker as the mobile app.

- **Map page (`/`)** — every location as a marker on an OpenStreetMap map + a clickable list.
- **Detail page (`/locations/[id]`)** — image, name, category, description, address, coordinates,
  and a focused mini-map.

## Stack

- **Next.js 16** (App Router) + TypeScript (strict)
- **TanStack Query** + **Zod** — same data-layer pattern as the mobile app
  (repository → service → hooks; Zod parse boundary; invalid coordinates filtered in the service)
- **react-leaflet** + **OpenStreetMap** — interactive map with **no API key**
- **Tailwind CSS**

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

It defaults to the deployed Worker, so it works out of the box. To point it at a local Worker:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787 pnpm dev
```

## Build / lint

```bash
pnpm build          # production build (also type-checks)
pnpm lint           # eslint
```

## Data source

`src/lib/config/env.ts` → `API_BASE_URL`, default:
`https://draftbit-locations-api.siddharth11tha.workers.dev`
(override with `NEXT_PUBLIC_API_BASE_URL`). Cross-origin fetches work because the Worker
sends `Access-Control-Allow-Origin: *`.

## Deploy

Easiest is **Vercel** (`vercel` / `vercel --prod`) or **Cloudflare Pages**. Set
`NEXT_PUBLIC_API_BASE_URL` if you want to override the default Worker URL.
