import { describe, expect, it } from 'vitest';
import worker from '../src/index';
import { getAllLocations } from '../src/data/locations';
import { locationSchema, locationsSchema } from '../src/types/location';

function request(path: string, method = 'GET'): Response {
  return worker.fetch(new Request(`https://api.test${path}`, { method }));
}

describe('GET /locations', () => {
  it('returns the full dataset as valid JSON with CORS + content-type', async () => {
    const res = request('/locations');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');

    const data = locationsSchema.parse(await res.json());
    expect(data.length).toBe(getAllLocations().length);
  });
});

describe('GET /locations/:id', () => {
  it('returns the correct single location', async () => {
    const res = request('/locations/par-eiffel');
    expect(res.status).toBe(200);

    const location = locationSchema.parse(await res.json());
    expect(location.id).toBe('par-eiffel');
    expect(location.name).toBe('Eiffel Tower');
  });

  it('returns 404 with the agreed error shape for an unknown id', async () => {
    const res = request('/locations/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.headers.get('cache-control')).toBe('no-store');

    const body = await res.json();
    expect(body).toMatchObject({ error: expect.any(String) });
  });
});

describe('routing and methods', () => {
  it('returns 405 with an Allow header for unsupported methods', async () => {
    const res = request('/locations', 'POST');
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('GET, OPTIONS');
  });

  it('returns 404 for an unknown route', async () => {
    const res = request('/nope');
    expect(res.status).toBe(404);
  });

  it('answers CORS preflight with 204 + allowed methods', () => {
    const res = request('/locations', 'OPTIONS');
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-methods')).toContain('GET');
  });
});

describe('dataset contract', () => {
  it('validates against the shared schema and includes the invalid-coord fixture', () => {
    const data = locationsSchema.parse(getAllLocations());
    expect(data.length).toBeGreaterThanOrEqual(25);
    expect(data.some((location) => location.id === 'loc-invalid')).toBe(true);
  });
});
