import { API_BASE_URL } from '@/lib/config/env';
import { LocationNotFoundError } from './errors';
import { locationSchema, locationsSchema, type Location } from './types/location.schema';

/**
 * Data access for locations — the single Zod parse boundary. Fetches raw JSON
 * from the Worker and validates it into typed `Location` objects. A 404 on a
 * single fetch becomes a `LocationNotFoundError`.
 */
export class LocationRepository {
  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load locations (status ${response.status})`);
    }
    return locationsSchema.parse(await response.json());
  }

  async getLocation(id: string): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (response.status === 404) {
      throw new LocationNotFoundError(id);
    }
    if (!response.ok) {
      throw new Error(`Failed to load location (status ${response.status})`);
    }
    return locationSchema.parse(await response.json());
  }
}
