/**
 * Minimal HTTP client abstraction. Returns `unknown` on purpose: callers (the
 * repository layer) are responsible for validating/parsing the payload with Zod.
 * This keeps validation at exactly one boundary.
 *
 * Phase 1: interface only. The fetch + timeout + error-mapping implementation
 * (using {@link HttpError}/{@link NetworkError}/{@link TimeoutError}) lands in Phase 3.
 */
export interface IHttpClient {
  /** Performs a GET request and resolves the parsed-but-unvalidated JSON body. */
  getJson(path: string): Promise<unknown>;
}
