import { HttpError } from '../../../lib/http/errors';
import type { IHttpClient } from '../../../lib/http/http-client';
import { LocationNotFoundError } from '../errors';
import { locationSchema, locationsSchema, type Location } from '../types/location.schema';
import type { ILocationRepository } from './location-repository';

/**
 * HTTP-backed location repository. This is the single Zod parse boundary: it
 * fetches raw JSON via the injected {@link IHttpClient} and validates it against
 * the location schema before returning typed domain objects. A 404 on a single
 * fetch is translated into a {@link LocationNotFoundError} domain error.
 */
export class HttpLocationRepository implements ILocationRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async getLocations(): Promise<Location[]> {
    const payload = await this.httpClient.getJson('/locations');
    return locationsSchema.parse(payload);
  }

  async getLocation(id: string): Promise<Location> {
    try {
      const payload = await this.httpClient.getJson(`/locations/${encodeURIComponent(id)}`);
      return locationSchema.parse(payload);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        throw new LocationNotFoundError(id);
      }
      throw error;
    }
  }
}
