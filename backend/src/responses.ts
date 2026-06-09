import { withCors } from './cors';

function jsonHeaders(cacheControl: string): Headers {
  return withCors(
    new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    }),
  );
}

/** Successful JSON response. Cacheable for a minute by default. */
export function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = 'public, max-age=60',
): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders(cacheControl) });
}

/** Error response in the agreed `{ error: string }` shape. Never cached. */
export function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status, 'no-store');
}

/** 405 with an `Allow` header advertising the supported methods. */
export function methodNotAllowed(allow: string): Response {
  const response = errorResponse('Method Not Allowed', 405);
  response.headers.set('Allow', allow);
  return response;
}
