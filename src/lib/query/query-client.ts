import { QueryClient } from '@tanstack/react-query';

/**
 * Factory for the app-wide TanStack Query client. Defaults tuned for a mobile
 * client reading a small, rarely-changing dataset: retry transient failures,
 * keep data fresh for a minute, and don't refetch on window focus.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
