import type { ILocationRepository } from '../repositories/location-repository';
import type { Location } from '../types/location.schema';
import { hasValidCoordinates } from './location-rules';

/**
 * Service Layer: orchestrates business logic between the UI/hooks and the
 * repository. Depends only on the {@link ILocationRepository} interface.
 *
 * Business rule: locations with invalid/out-of-range coordinates are filtered
 * out of the list here — never in the UI — so the map only ever receives
 * renderable markers. A single bad row is dropped, not the whole response.
 */
export class LocationService {
  constructor(private readonly repository: ILocationRepository) {}

  async getLocations(): Promise<Location[]> {
    const locations = await this.repository.getLocations();
    return locations.filter(hasValidCoordinates);
  }

  getLocation(id: string): Promise<Location> {
    return this.repository.getLocation(id);
  }
}
