import { LocationNotFoundError } from '../../src/domains/locations/errors';
import { HttpLocationRepository } from '../../src/domains/locations/repositories/http-location-repository';
import { LocationService } from '../../src/domains/locations/services/location-service';
import { HttpError } from '../../src/lib/http/errors';
import type { IHttpClient } from '../../src/lib/http/http-client';

const valid = { id: 'sf', name: 'SF', description: 'd', latitude: 37.8, longitude: -122.4 };
const invalid = { id: 'loc-invalid', name: 'bad', description: 'd', latitude: 999, longitude: -512 };

// Mock only the HTTP boundary so the real repository + service orchestration runs.
function serviceWith(getJson: IHttpClient['getJson']): LocationService {
  return new LocationService(new HttpLocationRepository({ getJson }));
}

describe('LocationService', () => {
  it('filters out invalid-coordinate locations', async () => {
    const service = serviceWith(jest.fn(async () => [valid, invalid]));
    const result = await service.getLocations();

    expect(result).toHaveLength(1);
    expect(result.some((location) => location.id === 'loc-invalid')).toBe(false);
  });

  it('passes a found location through unchanged', async () => {
    const service = serviceWith(jest.fn(async () => valid));
    const result = await service.getLocation('sf');

    expect(result.id).toBe('sf');
  });

  it('surfaces a missing location as a domain not-found error', async () => {
    const service = serviceWith(
      jest.fn(async () => {
        throw new HttpError('nf', 404);
      }),
    );

    await expect(service.getLocation('nope')).rejects.toBeInstanceOf(LocationNotFoundError);
  });
});
