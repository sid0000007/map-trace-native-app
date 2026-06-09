import type { Location } from '../types/location.schema';

/**
 * Abstraction over the location data source (Repository Pattern). The UI and
 * service layers depend on this interface, never on a concrete implementation,
 * so the source can be swapped (HTTP today, a database tomorrow) without change.
 */
export interface ILocationRepository {
  /** Returns every location in the pool. */
  getLocations(): Promise<Location[]>;
  /** Returns a single location by id, or rejects if it does not exist. */
  getLocation(id: string): Promise<Location>;
}
