/**
 * Centralised TanStack Query key factory for the locations domain. Keeping keys
 * in one place avoids typos and makes targeted cache invalidation predictable.
 * The query hooks (`useLocations`, `useLocation`) that consume these arrive in Phase 3.
 */
export const locationKeys = {
  all: ['locations'],
  list: () => [...locationKeys.all, 'list'],
  detail: (id: string) => [...locationKeys.all, 'detail', id],
};
