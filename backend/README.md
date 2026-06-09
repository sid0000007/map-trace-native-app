# draftbit Locations API (Cloudflare Worker)

A small Cloudflare Worker that serves a static dataset of ~28 world landmarks
over a REST API. It is the backend for the draftbit locations map app.

## Endpoints

| Method | Path              | Response                                   |
| ------ | ----------------- | ------------------------------------------ |
| `GET`  | `/locations`      | `200` — `Location[]`                       |
| `GET`  | `/locations/:id`  | `200` — `Location`, or `404 { "error" }`   |
| `GET`  | `/`               | `200` — `{ "status": "ok", endpoints }`    |

- Unknown routes → `404 { "error": string }`
- Unsupported methods → `405 { "error": string }` with an `Allow` header
- `OPTIONS` → `204` CORS preflight
- All responses are JSON, `Access-Control-Allow-Origin: *`, with `Cache-Control`
  (`public, max-age=60` for data, `no-store` for errors).

### `Location` shape

```jsonc
{
  "id": "par-eiffel",
  "name": "Eiffel Tower",
  "description": "Wrought-iron lattice tower on the Champ de Mars.",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "category": "landmark",        // optional
  "address": "Champ de Mars, …", // optional
  "imageUrl": "https://…"        // optional
}
```

The dataset includes a deliberate out-of-range coordinate fixture (`loc-invalid`)
so the client's edge-case filtering can be exercised end-to-end.

## Local development

```bash
pnpm install
pnpm dev        # wrangler dev — defaults to http://localhost:8787
```

Example requests:

```bash
curl http://localhost:8787/locations
curl http://localhost:8787/locations/par-eiffel
curl -i http://localhost:8787/locations/does-not-exist   # 404 { "error": ... }
curl -i -X POST http://localhost:8787/locations          # 405 + Allow: GET, OPTIONS
```

## Scripts

```bash
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest — routing, errors, CORS, dataset/contract validation
pnpm dev        # run locally with wrangler
pnpm deploy     # deploy to Cloudflare (Phase 5)
```

## Design notes

- **Data access behind functions** (`src/data/locations.ts`) so a future swap to
  a database only touches that module, not the routing.
- **Single contract** — the dataset is validated against the same Zod schema the
  client uses (`src/types/location.ts`), so the payload cannot drift from what the
  app parses.
- **No framework** — routing is a few lines of standard `Request`/`Response`, keeping
  the Worker dependency-light and easy to audit.
