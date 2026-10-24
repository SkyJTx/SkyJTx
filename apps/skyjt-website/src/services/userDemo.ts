import { query } from "@solidjs/router";
import { validateData, type InferOutput } from "@skyjt/typed-routes-solid";
import * as v from "valibot";

export const UserDataSchema = v.object({
  id: v.pipe(v.number(), v.safeInteger(), v.minValue(1)),
  name: v.pipe(v.string(), v.regex(/^[A-Za-z0-9 ]+$/)),
  fetch_at: v.date(),
});
export type UserData = v.InferOutput<typeof UserDataSchema>;

export const UserRouteParamsSchema = v.object({
  id: v.number(),
});
export type UserRouteParams = InferOutput<typeof UserRouteParamsSchema>;

export const loadUserData = query(async (id: number) => {
  "use server";

  const res = await new Promise<{
    ok: boolean;
    json: () => Promise<unknown>;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id,
            name: "User " + id,
            fetch_at: new Date(),
          }),
      });
    }, 500);
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user data for id ${id}`);
  }

  const data = await res.json();
  const result = validateData(UserDataSchema, data);

  if (!result.success) {
    throw new Error(result.issues.map((issue) => issue.message).join(", ") || "Invalid user data");
  }

  return result.data;
}, "user-data-query");
