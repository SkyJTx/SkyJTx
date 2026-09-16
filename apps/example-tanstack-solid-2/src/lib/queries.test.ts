import { describe, expect, it } from 'vitest';
import { createQueryClient } from './queries';

describe('createQueryClient', () => {
  it('creates a QueryClient with configured default staleTime', () => {
    const client = createQueryClient();
    expect(client).toBeDefined();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });
});

