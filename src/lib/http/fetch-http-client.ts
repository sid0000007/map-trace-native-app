import { HttpError, NetworkError, TimeoutError } from './errors';
import type { IHttpClient } from './http-client';

/**
 * `fetch`-based {@link IHttpClient}. Joins the base URL, enforces a request
 * timeout via AbortController, and maps low-level failures onto the typed error
 * classes ({@link HttpError}/{@link NetworkError}/{@link TimeoutError}). Returns
 * the raw JSON body as `unknown` — validation is the repository's job.
 */
export class FetchHttpClient implements IHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number = 8000,
  ) {}

  async getJson(path: string): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request to ${path} timed out after ${this.timeoutMs}ms`);
      }
      const reason = error instanceof Error ? error.message : 'unknown error';
      throw new NetworkError(`Network request to ${path} failed: ${reason}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new HttpError(`Request to ${path} failed with status ${response.status}`, response.status);
    }

    try {
      return await response.json();
    } catch {
      throw new NetworkError(`Failed to parse JSON response from ${path}`);
    }
  }
}
