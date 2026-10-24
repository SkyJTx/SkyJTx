import { Elysia } from "elysia";
import * as v from "valibot";
import {
  WorksDataSchema,
  PersonalInfoSchema,
  MusicWorksDataSchema,
} from "~/types";
import { StorageNotFoundError } from "./errors";
import { getObjectBytes } from "./service";

export const storageRoutes = new Elysia({ prefix: "/storage" })
  .get(
    "/data/works",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const result = await getObjectBytes("worksData.json");
      if (!result) {
        return new StorageNotFoundError("worksData.json");
      }
      const raw: unknown = JSON.parse(new TextDecoder().decode(result.data));
      return v.parse(WorksDataSchema, raw);
    }
  )
  .get(
    "/data/personal",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const result = await getObjectBytes("personalInfo.json");
      if (!result) {
        return new StorageNotFoundError("personalInfo.json");
      }
      const raw: unknown = JSON.parse(new TextDecoder().decode(result.data));
      return v.parse(PersonalInfoSchema, raw);
    }
  )
  .get(
    "/data/music",
    async ({ set }) => {
      set.headers["content-type"] = "application/json; charset=utf-8";
      set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
      const result = await getObjectBytes("musicWorksData.json");
      if (!result) {
        return new StorageNotFoundError("musicWorksData.json");
      }
      const raw: unknown = JSON.parse(new TextDecoder().decode(result.data));
      return v.parse(MusicWorksDataSchema, raw);
    }
  )
  .get("/file/*", async ({ params, set }) => {
    const rawWildcard = params["*"] || "";
    const key = decodeURIComponent(rawWildcard);
    const result = await getObjectBytes(key);
    if (!result) {
      return new StorageNotFoundError(key);
    }

    set.headers["content-type"] = result.contentType;
    set.headers["cache-control"] = "public, max-age=3600, s-maxage=86400";

    const arrayBuffer = new ArrayBuffer(result.data.byteLength);
    new Uint8Array(arrayBuffer).set(result.data);

    return new Response(arrayBuffer, {
      headers: {
        "content-type": result.contentType,
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    });
  });
