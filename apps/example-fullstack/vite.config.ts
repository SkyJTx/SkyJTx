import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [
    solid({
      start: {},
      ssr: true,
      diagnostics: true,
      extensions: ['.jsx', '.tsx'],
    }),
    fileRoutes({ types: true }),
  ],
  server: {
    port: 3000,
  },
  test: {
    globals: false,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
});
