import { preflightResponse } from './cors';
import { getAllLocations, getLocationById } from './data/locations';
import { errorResponse, jsonResponse, methodNotAllowed } from './responses';

/**
 * Cloudflare Worker entry. Serves the locations dataset over two REST endpoints:
 *   GET /locations        → 200 Location[]
 *   GET /locations/:id     → 200 Location, or 404 { error } if not found
 * Unknown routes → 404, unsupported methods → 405, OPTIONS → CORS preflight.
 *
 * `fetch` declares only the `request` arg it uses; the runtime passes `env`/`ctx`
 * too, which are simply ignored here (no bindings needed for the MVP).
 */
interface WorkerHandler {
  fetch(request: Request): Response;
}

const handler: WorkerHandler = {
  fetch(request) {
    if (request.method === 'OPTIONS') {
      return preflightResponse();
    }

    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);

    // GET /  → tiny health/index payload
    if (segments.length === 0) {
      return jsonResponse({ status: 'ok', endpoints: ['/locations', '/locations/:id'] });
    }

    if (segments[0] === 'locations') {
      // GET /locations
      if (segments.length === 1) {
        if (request.method !== 'GET') {
          return methodNotAllowed('GET, OPTIONS');
        }
        return jsonResponse(getAllLocations());
      }

      // GET /locations/:id
      if (segments.length === 2) {
        if (request.method !== 'GET') {
          return methodNotAllowed('GET, OPTIONS');
        }
        const id = decodeURIComponent(segments[1]);
        const location = getLocationById(id);
        if (!location) {
          return errorResponse(`Location not found: ${id}`, 404);
        }
        return jsonResponse(location);
      }
    }

    return errorResponse('Not Found', 404);
  },
};

export default handler;
