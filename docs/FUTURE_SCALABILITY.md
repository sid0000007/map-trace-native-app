# Future Scalability

> Documentation only — none of this is built in the MVP. The point is that the current
> architecture (Repository + Service behind interfaces) lets each item slot in without
> touching the UI or hooks.

The MVP serves a static, in-Worker JSON dataset. That is intentional: the assignment is about
the app + API architecture, not storage. Here is how it would grow into a real geospatial service.

## 1. PostgreSQL as the system of record

Replace the static dataset with a `locations` table in **PostgreSQL**. In the app, this is a new
`PgLocationRepository implements ILocationRepository` (or, more realistically, the Worker keeps the
HTTP contract and queries Postgres behind it). Nothing above the repository changes — the UI,
hooks, and service are untouched. The existing Zod contract becomes the API serialization layer.

## 2. PostGIS for geospatial types

Add the **PostGIS** extension and store coordinates as `geography(Point, 4326)` instead of two
floats. This unlocks correct distance math on a sphere and spatial operators (`ST_DWithin`,
`ST_Distance`, `ST_Intersects`) rather than naive lat/lng comparisons.

## 3. Spatial indexing — R-Tree / GiST

Back the geometry column with a **GiST** index (PostGIS's R-Tree-over-GiST), e.g.
`CREATE INDEX ON locations USING GIST (geog);`. This turns "find points near X" and bounding-box
queries from full scans into index lookups — essential once the dataset is large.

## 4. Radius / nearest search

Expose `GET /locations?near=lat,lng&radiusKm=N` (and/or `?bbox=...`). Implemented with
`ST_DWithin(geog, ST_MakePoint(lng,lat)::geography, radiusMeters)` against the GiST index. On the
client this is an additive repository/service method and a new query hook — the map can then fetch
only what's in view instead of the whole set.

## 5. Server-side clustering

At low zoom, returning thousands of markers is wasteful and unreadable. Cluster server-side by
grid/geohash or `ST_ClusterDBSCAN`, returning cluster centroids + counts per zoom level. The map
renders cluster bubbles that expand on zoom — the client just consumes a richer payload shape.

## 6. Redis caching

Put **Redis** in front of Postgres for hot reads (popular regions, common radius queries) with a
short TTL, and/or use it for rate-limiting. The Worker can also lean on Cloudflare's edge cache via
`Cache-Control` (already set) and the Cache API for read-through caching at the edge.

## 7. Operational concerns (also deferred)

- **Auth & writes** — tokens/sessions, `POST/PUT/DELETE` with validation and authorization.
- **Pagination** — cursor-based listing once the dataset outgrows a single response.
- **Observability** — structured logs, tracing, and dashboards (Worker observability is already
  enabled in `wrangler.jsonc`).
- **CI/CD** — typecheck/lint/test on PR, automated `wrangler deploy` on merge.

## Why the current design makes this cheap

Every boundary is an interface, and the data source is reached only through
`ILocationRepository`. Swapping static JSON for Postgres+PostGIS, adding radius search, or
inserting a cache is a change at one layer — the screens, hooks, and service contracts stay the
same. That is the whole point of the Repository + Service layering.
