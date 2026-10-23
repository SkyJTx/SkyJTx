import { defineRoute, InferOutput, validateData } from "@skyjt/typed-routes-solid";
import { query, revalidate } from "@solidjs/router";
import { createMemo, Errored, Loading, onSettled, Show } from "solid-js";
import * as v from "valibot";

const loadUserData = query(async (id: number) => {
  "use server";

  const res = await new Promise<{
    ok: boolean;
    json: () => Promise<unknown>;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve({
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

  const dataSchema = v.object({
    id: v.pipe(v.number(), v.safeInteger(), v.minValue(1)),
    name: v.pipe(v.string(), v.regex(/^[A-Za-z0-9 ]+$/)),
    fetch_at: v.date(),
  });

  const result = validateData(dataSchema, data);

  if (!result.success) {
    throw new Error(result.issues.map((issue) => issue.message).join(", ") || "Invalid user data");
  }

  return result.data;
}, "user-data-query");

const routeSchema = v.object({
  id: v.number(),
});

export const route = defineRoute({
  params: routeSchema,
  preload: async ({ params: [params, error] }) => {
    if (error) return;
    return loadUserData(params.id);
  },
});

export type UserRouteParams = InferOutput<typeof routeSchema>;

export default function UserRoute() {
  const [params, paramsError] = route.useParams();
  const userData = createMemo(() => {
    const p = params();
    return p ? loadUserData(p.id) : undefined;
  });

  onSettled(() => {
    const p = params();
    if (!p) return;
    console.log("User data query settled for id", p.id);

    const intervalId = setInterval(() => {
      revalidate(loadUserData.keyFor(p.id));
    }, 1000);

    return () => {
      console.log("Cleanup for user data query for id", p.id);
      clearInterval(intervalId);
    };
  });

  return (
    <div>
      <Show
        when={params()}
        fallback={
          <div role="alert">
            <p>Invalid user ID: {paramsError()?.message}</p>
          </div>
        }
      >
        {(validParams) => (
          <Errored fallback={<p>Error occurred while fetching user data.</p>}>
            <Loading fallback={<p>Loading user data...</p>}>
              <p>User ID: {validParams().id}</p>
              <Show when={userData()}>
                {(data) => (
                  <>
                    <p>User Name: {data().name}</p>
                    <p>User Fetched At: {data().fetch_at.toLocaleString()}</p>
                  </>
                )}
              </Show>
            </Loading>
          </Errored>
        )}
      </Show>
    </div>
  );
}
