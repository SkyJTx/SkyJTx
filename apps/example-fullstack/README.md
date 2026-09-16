# Example Fullstack

A lean fullstack application foundation built with [Solid 2](https://v2.solidjs.com) and [@solidjs/router](https://github.com/solidjs/solid-router).

## Architecture

- **SSR & Server Runtime**: Turnkey streaming SSR powered by `@solidjs/vite-plugin`.
- **Routing**: File-system routing with `filesystem-routing` feeding `@solidjs/router/fs`.
- **Testing**: Vitest with `@solidjs/testing-library` in a lightweight jsdom environment.
- **Linting**: Oxlint configured with `eslint-plugin-solid` rules.

## Available Scripts

In this package or from the monorepo root:

- `bun run dev`: Start local development server with streaming SSR
- `bun run build`: Build client assets and SSR request handler
- `bun run serve`: Preview production build
- `bun run test`: Run unit tests with Vitest
- `bun run lint`: Lint code with Oxlint
