/**
 * Base URL of the locations API (Cloudflare Worker). Defaults to the deployed
 * Worker so the demo works with no setup; override with NEXT_PUBLIC_API_BASE_URL
 * (e.g. http://localhost:8787) to point at a local `wrangler dev`.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://draftbit-locations-api.siddharth11tha.workers.dev';
