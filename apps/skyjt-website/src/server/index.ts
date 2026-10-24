import { Elysia, t } from "elysia";
import { storageRoutes } from "./modules/storage";

export const PingResponseSchema = t.Object({
  status: t.Literal("active"),
  timestamp: t.Number(),
  path: t.String(),
});

const app = new Elysia({ prefix: "/api" })
  .use(storageRoutes)
  .get("/", () => "Hello World")
  .get(
    "/ping",
    {
      response: PingResponseSchema,
    },
    ({ request }) => {
      const url = new URL(request.url);
      return {
        status: "active" as const,
        timestamp: Date.now(),
        path: url.pathname,
      };
    }
  );

export default app;
export type AppType = typeof app;
