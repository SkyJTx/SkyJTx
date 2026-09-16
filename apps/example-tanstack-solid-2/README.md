# SkyJT Website

SolidJS 2 Fullstack application powered by TanStack Router and TanStack Query.

## Architecture

- **SolidJS 2 (@solidjs/web, @solidjs/vite-plugin)**: Drives server functions and turnkey streaming SSR.
- **TanStack Router (@tanstack/solid-router, @tanstack/router-plugin)**: File-based, type-safe routing under src/routes, automatic code splitting, and 
outeTree.gen.ts.
- **TanStack Query (@tanstack/solid-query)**: Cache management and client-side data state.

## Available Scripts

In apps/skyjt-website:

- bun run dev: Start local development server with streaming SSR.
- bun run build: Build client assets (dist/client) and SSR server handler (dist/server).
- bun run serve: Preview the built production application.
- bun run test: Run unit tests via Vitest.
- bun run lint: Lint source files via Oxlint.

