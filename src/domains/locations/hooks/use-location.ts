import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { locationService } from '../../../lib/config/locations';
import { LocationNotFoundError } from '../errors';
import type { Location } from '../types/location.schema';
import { locationKeys } from './location-keys';

/**
 * Fetches a single location by id. Disabled for an empty id, and does not retry
 * a "not found" result (retrying a 404 is pointless), while still retrying
 * transient failures.
 *
 * Perceived performance: when the user arrives from the list, the full Location
 * is already in the list cache, so we seed `initialData` from it — the detail
 * renders instantly and still revalidates per `staleTime` (via
 * `initialDataUpdatedAt`).
 */
export function useLocation(id: string): UseQueryResult<Location, Error> {
  const queryClient = useQueryClient();

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
    initialData: () =>
      queryClient
        .getQueryData<Location[]>(locationKeys.list())
        ?.find((location) => location.id === id),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(locationKeys.list())?.dataUpdatedAt,
  });
}
