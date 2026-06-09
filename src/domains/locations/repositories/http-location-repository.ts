import type { IHttpClient } from '../../../lib/http/http-client';
import type { ILocationRepository } from './location-repository';
import type { Location } from '../types/location.schema';

/**
 * HTTP-backed location repository. This is the single Zod parse boundary: it
 * fetches raw JSON via the injected {@link IHttpClient} and validates it against
 * the location schema before returning typed domain objects.
 *
 * Phase 1: typed stub only — the fetch + parse logic lands in Phase 3.
 */
export class HttpLocationRepository implements ILocationRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  getLocations(): Promise<Location[]> {
    throw new Error(
      `HttpLocationRepository.getLocations not implemented yet (client: ${typeof this.httpClient})`,
    );
  }

  getLocation(id: string): Promise<Location> {
    throw new Error(`HttpLocationRepository.getLocation not implemented yet (id: ${id})`);
  }
}
