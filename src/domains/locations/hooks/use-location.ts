import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { locationService } from '../../../lib/config/locations';
import { LocationNotFoundError } from '../errors';
import type { Location } from '../types/location.schema';
import { locationKeys } from './location-keys';

/**
 * Fetches a single location by id. Disabled for an empty id, and does not retry
 * a "not found" result (retrying a 404 is pointless), while still retrying
 * transient failures.
 */
export function useLocation(id: string): UseQueryResult<Location, Error> {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => locationService.getLocation(id),
    enabled: id.length > 0,
    retry: (failureCount, error) => {
      if (error instanceof LocationNotFoundError) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
