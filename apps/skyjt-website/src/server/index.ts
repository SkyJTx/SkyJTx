import Elysia from "elysia";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello World")
  .get("/ping", ({ request }) => {
    const url = new URL(request.url);
    return {
      status: "active",
      timestamp: Date.now(),
      path: url.pathname,
    };
  });

export default app;
export type AppType = typeof app;