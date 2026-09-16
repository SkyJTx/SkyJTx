import { describe, it, expect, vi } from "vitest";
import { interceptFileRoutes } from "../src/interceptor/interceptor";
import { defineRoute } from "../src/router/define-route";
import { schema } from "../src/schema/builtin";

describe("Route Manifest Interceptor", () => {
  it("intercepts file route manifest and executes validated preload", async () => {
    const onErrorMock = vi.fn();
    const preloadMock = vi.fn((args: { params: { id: number }; search: { tab?: string } }) => {
      return { userId: args.params.id, tab: args.search.tab };
    });

    const userRoute = defineRoute({
      params: schema.object({
        id: schema.number(),
      }),
      search: schema.object({
        tab: schema.string().optional(),
      }),
      preload: preloadMock,
      onError: onErrorMock,
    });

    const manifest = [
      {
        path: "/users/:id",
        page: true,
        $component: {
          src: "/routes/users/[id].tsx",
          require: () => ({
            default: () => "User Component",
          }),
        },
        $$route: {
          require: () => ({
            route: userRoute,
          }),
        },
      },
    ] as const;

    const intercepted = interceptFileRoutes(manifest);

    expect(intercepted).toHaveLength(1);
    expect(intercepted[0].path).toBe("/users/:id");
    expect(intercepted[0].component).toBeDefined();
    expect(intercepted[0].preload).toBeDefined();

    // Call intercepted preload with raw string parameters
    const preloadResult = await (intercepted[0].preload as (args: unknown) => unknown)({
      params: { id: "42" },
      location: { query: { tab: "profile" } },
    });

    expect(preloadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { id: 42 },
        search: { tab: "profile" },
      }),
    );
    expect(preloadResult).toEqual({ userId: 42, tab: "profile" });
  });

  it("triggers onError callback on invalid parameters during preload", async () => {
    const onErrorMock = vi.fn();

    const userRoute = defineRoute({
      params: schema.object({
        id: schema.number(),
      }),
      preload: () => "ok",
      onError: onErrorMock,
    });

    const manifest = [
      {
        path: "/users/:id",
        page: true,
        $component: {
          src: "/routes/users/[id].tsx",
          require: () => ({
            default: () => "User Component",
          }),
        },
        $$route: {
          require: () => ({
            route: userRoute,
          }),
        },
      },
    ] as const;

    const intercepted = interceptFileRoutes(manifest);

    // Call with non-numeric string that fails number schema
    await (intercepted[0].preload as (args: unknown) => unknown)({
      params: { id: "not-a-number" },
      location: { query: {} },
    });

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock.mock.calls[0][0].error.target).toBe("params");
  });
});
