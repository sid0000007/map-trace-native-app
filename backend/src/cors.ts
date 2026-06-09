/**
 * CORS handling. For the MVP we allow any origin (`*`) so the Expo client can
 * call the API from simulator, device, and web without per-origin config.
 */
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

/** Applies CORS headers onto an existing Headers instance and returns it. */
export function withCors(headers: Headers): Headers {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return headers;
}

/** Response for a CORS preflight (`OPTIONS`) request. */
export function preflightResponse(): Response {
  return new Response(null, { status: 204, headers: withCors(new Headers()) });
}
