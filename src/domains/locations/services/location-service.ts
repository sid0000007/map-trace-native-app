import type { ILocationRepository } from '../repositories/location-repository';
import type { Location } from '../types/location.schema';

/**
 * Service Layer: orchestrates business logic between the UI/hooks and the
 * repository. Depends only on the {@link ILocationRepository} interface.
 *
 * Phase 1: thin delegating stub. Business rules (e.g. filtering invalid
 * coordinates, sorting) are added in Phase 3.
 */
export class LocationService {
  constructor(private readonly repository: ILocationRepository) {}

  getLocations(): Promise<Location[]> {
    return this.repository.getLocations();
  }

  getLocation(id: string): Promise<Location> {
    return this.repository.getLocation(id);
  }
}
