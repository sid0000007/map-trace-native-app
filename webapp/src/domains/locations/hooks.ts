'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { LocationNotFoundError } from './errors';
import { LocationRepository } from './repository';
import { LocationService } from './service';
import type { Location } from './types/location.schema';

const service = new LocationService(new LocationRepository());

/** All renderable locations. */
export function useLocations(): UseQueryResult<Location[], Error> {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => service.getLocations(),
  });
}

/** A single location by id (no retry on not-found). */
export function useLocation(id: string): UseQueryResult<Location, Error> {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => service.getLocation(id),
    enabled: id.length > 0,
    retry: (failureCount, error) =>
      !(error instanceof LocationNotFoundError) && failureCount < 2,
  });
}
