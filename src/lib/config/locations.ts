import { HttpLocationRepository } from '../../domains/locations/repositories/http-location-repository';
import { LocationService } from '../../domains/locations/services/location-service';
import { FetchHttpClient } from '../http/fetch-http-client';
import { API_BASE_URL } from './env';

/**
 * Composition root for the locations domain. Wires the concrete HTTP client and
 * repository into the service. The rest of the app depends on the returned
 * {@link LocationService} (via hooks), never on these construction details.
 */
export function createLocationService(): LocationService {
  const httpClient = new FetchHttpClient(API_BASE_URL);
  const repository = new HttpLocationRepository(httpClient);
  return new LocationService(repository);
}

/** App-wide singleton consumed by the query hooks. */
export const locationService = createLocationService();
