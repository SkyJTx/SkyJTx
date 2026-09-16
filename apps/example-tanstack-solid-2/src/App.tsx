import { QueryClientProvider } from '@tanstack/solid-query';
import { RouterProvider } from '@tanstack/solid-router';

import { createQueryClient } from './lib/queries';
import { createAppRouter } from './router';
import './App.css';

const queryClient = createQueryClient();
const router = createAppRouter(queryClient);

/**
 * Root application component for client-side hydration.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

