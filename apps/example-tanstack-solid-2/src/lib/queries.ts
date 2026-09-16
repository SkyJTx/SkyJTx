import { QueryClient } from '@tanstack/solid-query';

/**
 * Creates a configured TanStack QueryClient instance.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
      },
    },
  });
}
