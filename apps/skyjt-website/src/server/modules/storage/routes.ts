import { Elysia } from "elysia";
import * as v from "valibot";
import {
  WorksDataSchema,
  PersonalInfoSchema,
  MusicWorksDataSchema,
} from "~/types";
import { StorageNotFoundError } from "./errors";
import { getObjectStream, getObjectText } from "./service";

export const storageRoutes = new Elysia({ prefix: "/storage" })
  .get(
    "/data/works",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const text = await getObjectText("worksData.json");
      if (!text) {
        return new StorageNotFoundError("worksData.json");
      }
      const raw: unknown = JSON.parse(text);
      return v.parse(WorksDataSchema, raw);
    }
  )
  .get(
    "/data/personal",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const text = await getObjectText("personalInfo.json");
      if (!text) {
        return new StorageNotFoundError("personalInfo.json");
      }
      const raw: unknown = JSON.parse(text);
      return v.parse(PersonalInfoSchema, raw);
    }
  )
  .get(
    "/data/music",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const text = await getObjectText("musicWorksData.json");
      if (!text) {
        return new StorageNotFoundError("musicWorksData.json");
      }
      const raw: unknown = JSON.parse(text);
      return v.parse(MusicWorksDataSchema, raw);
    }
  )
  .get("/file/*", async ({ params }) => {
    const rawWildcard = params["*"] || "";
    let key = rawWildcard;
    try {
      key = decodeURIComponent(rawWildcard);
    } catch {
      // Fallback to raw wildcard if malformed
    }
    const result = await getObjectStream(key);
    if (!result) {
      return new StorageNotFoundError(key);
    }

    const headers: Record<string, string> = {
      "content-type": result.contentType,
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "content-disposition": "inline",
    };
    if (result.contentLength !== undefined) {
      headers["content-length"] = String(result.contentLength);
    }

    return new Response(result.stream, { headers });
  });
