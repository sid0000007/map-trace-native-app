import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react-native';
import { type ReactElement, type ReactNode } from 'react';

/** A QueryClient tuned for tests: no auto-retry delays, no cache carry-over. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0,
        gcTime: 0,
      },
    },
  });
}

/** Renders `ui` wrapped in a fresh QueryClientProvider. */
export function renderWithClient(ui: ReactElement): RenderResult {
  const client = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return render(ui, { wrapper: Wrapper });
}
