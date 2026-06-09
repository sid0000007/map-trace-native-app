import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';
import { createQueryClient } from './query-client';

/**
 * Provides a stable QueryClient to the React tree. The client is created once
 * per provider instance via lazy `useState` initialisation.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
