import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { locationService } from '../../../lib/config/locations';
import type { Location } from '../types/location.schema';
import { locationKeys } from './location-keys';

/** Fetches the (coordinate-filtered) list of locations. */
export function useLocations(): UseQueryResult<Location[], Error> {
  return useQuery({
    queryKey: locationKeys.list(),
    queryFn: () => locationService.getLocations(),
  });
}
