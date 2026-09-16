import type { QueryClient } from '@tanstack/solid-query';
import type { RouterHistory } from '@tanstack/solid-router';
import { createRouter } from '@tanstack/solid-router';

import { routeTree } from './routeTree.gen';

/**
 * Context provided to TanStack Router instances.
 */
export interface RouterContext {
  queryClient: QueryClient;
}

/**
 * Creates a configured TanStack Router instance.
 */
export function createAppRouter(queryClient: QueryClient, history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPendingComponent: () => <main>Loading…</main>,
    disableGlobalCatchBoundary: true,
  });
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

