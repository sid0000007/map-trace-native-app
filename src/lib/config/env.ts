/**
 * Runtime configuration. `API_BASE_URL` points the client at the locations API.
 *
 * Defaults to the deployed Cloudflare Worker so the app works out-of-the-box.
 * For local development against `wrangler dev`, override it without a code change:
 *   EXPO_PUBLIC_API_BASE_URL=http://localhost:8787
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://draftbit-locations-api.siddharth11tha.workers.dev';
