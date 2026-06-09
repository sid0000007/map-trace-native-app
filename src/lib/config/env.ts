/**
 * Runtime configuration. `API_BASE_URL` points the client at the locations API.
 *
 * It is configurable via the `EXPO_PUBLIC_API_BASE_URL` env var so Phase 5 can
 * swap the local `wrangler dev` URL for the deployed Cloudflare Worker without a
 * code change. The default targets a local Worker (`wrangler dev` defaults to 8787).
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8787';
