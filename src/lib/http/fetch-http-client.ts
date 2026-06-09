import type { IHttpClient } from './http-client';

/**
 * `fetch`-based {@link IHttpClient}. Owns base-URL joining, request timeout, and
 * mapping failures to {@link HttpError}/{@link NetworkError}/{@link TimeoutError}.
 *
 * Phase 1: typed stub. Implementation lands in Phase 3.
 */
export class FetchHttpClient implements IHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number = 8000,
  ) {}

  getJson(path: string): Promise<unknown> {
    throw new Error(
      `FetchHttpClient.getJson not implemented yet (url: ${this.baseUrl}${path}, timeout: ${this.timeoutMs}ms)`,
    );
  }
}
