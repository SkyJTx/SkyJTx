import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/solid-router';

import type { RouterContext } from '../router';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({ meta: [{ title: 'SkyJT Website' }] }),
  component: () => (
    <>
      <HeadContent />
      <nav class="site-nav">
        <Link to="/">Home</Link>
      </nav>
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main>
      <h1>Page Not Found</h1>
      <p>The requested page does not exist.</p>
    </main>
  ),
});

