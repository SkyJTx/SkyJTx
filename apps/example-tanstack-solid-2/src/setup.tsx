import type { RequestEvent, ResponseStub } from '@solidjs/web';
import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/solid-router';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';

/**
 * Per-request SSR setup hook for SolidJS start mode.
 */
export default async function setup(
  event: RequestEvent & { response: ResponseStub },
) {
  const url = new URL(event.request.url);

  const queryClient = createQueryClient();
  const router = createAppRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [url.pathname + url.search] }),
  );

  await router.load();

  const result = router._serverResult;
  if (result?.type === 'redirect') {
    result.redirect.headers.forEach((value, key) =>
      key === 'set-cookie'
        ? event.response.headers.append(key, value)
        : event.response.headers.set(key, value),
    );
    event.response.status = result.redirect.status;
    return () => null;
  }

  if (result) event.response.status = result.status;

  return () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
