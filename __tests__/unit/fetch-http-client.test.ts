import { FetchHttpClient } from '../../src/lib/http/fetch-http-client';
import { HttpError, NetworkError, TimeoutError } from '../../src/lib/http/errors';

const realFetch = global.fetch;

afterEach(() => {
  global.fetch = realFetch;
});

function stubFetch(impl: typeof fetch): void {
  global.fetch = impl;
}

describe('FetchHttpClient', () => {
  it('returns parsed JSON on success and requests the joined URL', async () => {
    const seen: string[] = [];
    stubFetch(async (input) => {
      seen.push(String(input));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });

    const client = new FetchHttpClient('https://api.test');
    const body = await client.getJson('/locations');

    expect(body).toEqual({ ok: true });
    expect(seen[0]).toBe('https://api.test/locations');
  });

  it('throws HttpError carrying the status for a non-2xx response', async () => {
    stubFetch(async () => new Response('error', { status: 500 }));
    const client = new FetchHttpClient('https://api.test');

    await expect(client.getJson('/x')).rejects.toBeInstanceOf(HttpError);
    await expect(client.getJson('/x')).rejects.toMatchObject({ status: 500 });
  });

  it('maps an aborted request to TimeoutError', async () => {
    stubFetch(async () => {
      const error = new Error('aborted');
      error.name = 'AbortError';
      throw error;
    });
    const client = new FetchHttpClient('https://api.test', 10);

    await expect(client.getJson('/x')).rejects.toBeInstanceOf(TimeoutError);
  });

  it('maps a connection failure to NetworkError', async () => {
    stubFetch(async () => {
      throw new Error('connection refused');
    });
    const client = new FetchHttpClient('https://api.test');

    await expect(client.getJson('/x')).rejects.toBeInstanceOf(NetworkError);
  });

  it('maps an invalid JSON body to NetworkError', async () => {
    stubFetch(async () => new Response('not-json', { status: 200 }));
    const client = new FetchHttpClient('https://api.test');

    await expect(client.getJson('/x')).rejects.toBeInstanceOf(NetworkError);
  });
});
