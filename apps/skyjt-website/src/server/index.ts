import { Elysia } from "elysia";
import * as v from "valibot";
import { storageRoutes } from "./modules/storage";

export const PingResponseSchema = v.object({
  status: v.literal("active"),
  timestamp: v.number(),
  path: v.string(),
});
export type PingResponse = v.InferOutput<typeof PingResponseSchema>;

const app = new Elysia({ prefix: "/api" })
  .use(storageRoutes)
  .get("/", () => "Hello World")
  .get("/ping", ({ request }): PingResponse => {
      const url = new URL(request.url);
      const responsePayload: PingResponse = {
        status: "active",
        timestamp: Date.now(),
        path: url.pathname,
      };
      return responsePayload;
    }
  );

export default app;
export type AppType = typeof app;
