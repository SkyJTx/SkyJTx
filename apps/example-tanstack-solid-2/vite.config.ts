import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solid({
      start: {
        setup: './src/setup.tsx',
      },
      ssr: true,
      diagnostics: true,
    }),
  ],
  resolve: {
    dedupe: ['solid-js', '@solidjs/web'],
  },
  ssr: {
    noExternal: true,
  },
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

