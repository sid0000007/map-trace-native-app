import { LocationNotFoundError } from '../../src/domains/locations/errors';
import { HttpLocationRepository } from '../../src/domains/locations/repositories/http-location-repository';
import { HttpError } from '../../src/lib/http/errors';
import type { IHttpClient } from '../../src/lib/http/http-client';

const sample = {
  id: 'par-eiffel',
  name: 'Eiffel Tower',
  description: 'Iron lattice tower.',
  latitude: 48.8584,
  longitude: 2.2945,
};

function repositoryWith(getJson: IHttpClient['getJson']): HttpLocationRepository {
  return new HttpLocationRepository({ getJson });
}

describe('HttpLocationRepository', () => {
  it('getLocations parses and returns a typed array', async () => {
    const repo = repositoryWith(jest.fn(async () => [sample]));
    const result = await repo.getLocations();

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Eiffel Tower');
  });

  it('getLocations rejects a malformed payload', async () => {
    const repo = repositoryWith(jest.fn(async () => [{ id: 1 }]));
    await expect(repo.getLocations()).rejects.toBeTruthy();
  });

  it('getLocation requests the encoded id and parses the result', async () => {
    const paths: string[] = [];
    const repo = repositoryWith(
      jest.fn(async (path: string) => {
        paths.push(path);
        return sample;
      }),
    );

    const result = await repo.getLocation('par-eiffel');

    expect(result.id).toBe('par-eiffel');
    expect(paths[0]).toBe('/locations/par-eiffel');
  });

  it('maps a 404 to a LocationNotFoundError', async () => {
    const repo = repositoryWith(
      jest.fn(async () => {
        throw new HttpError('not found', 404);
      }),
    );

    await expect(repo.getLocation('missing')).rejects.toBeInstanceOf(LocationNotFoundError);
  });

  it('rethrows non-404 HTTP errors unchanged', async () => {
    const repo = repositoryWith(
      jest.fn(async () => {
        throw new HttpError('server error', 500);
      }),
    );

    await expect(repo.getLocation('x')).rejects.toBeInstanceOf(HttpError);
  });
});
