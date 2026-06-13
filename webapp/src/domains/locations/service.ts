import { LocationRepository } from './repository';
import type { Location } from './types/location.schema';

/** Coordinates must be finite and within valid geographic ranges to render. */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Business logic between the UI and the repository. Filters out
 * invalid-coordinate locations so the map only receives renderable markers.
 */
export class LocationService {
  constructor(private readonly repository: LocationRepository) {}

  async getLocations(): Promise<Location[]> {
    const locations = await this.repository.getLocations();
    return locations.filter((location) => isValidCoordinate(location.latitude, location.longitude));
  }

  getLocation(id: string): Promise<Location> {
    return this.repository.getLocation(id);
  }
}
