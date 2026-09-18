import { defineRoute, schema, InferOutput } from "@skyjt/typed-routes";
import { query, revalidate } from "@solidjs/router";
import { createMemo, Loading, onSettled } from "solid-js";

const loadUserData = query(async (id: number) => {
  "use server";
  const res = await new Promise<{
    ok: boolean;
    json: () => Promise<unknown>;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve({ id, name: "User " + id + " at " + new Date().toLocaleTimeString() }),
      });
    }, 500);
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user data for id ${id}`);
  }

  console.log("Fetched user data for id", id);

  const data = await res.json();

  return data as { id: number; name: string };
}, "user-data-query");

const routeSchema = schema.object({
  id: schema.number(),
});

export const route = defineRoute({
  params: routeSchema,
  preload: async ({ params }) => loadUserData(params.id),
});

export type UserRouteParams = InferOutput<typeof routeSchema>;

export default function UserRoute() {
  const params = route.useParams();
  const userData = createMemo(() => loadUserData(params().id));

  onSettled(() => {
    console.log("User data query settled for id", params().id);

    const intervalId = setInterval(() => {
      revalidate(loadUserData.keyFor(params().id));
    }, 1000);

    return () => {
      console.log("Cleanup for user data query for id", params().id);
      clearInterval(intervalId);
    }
  });

  return (
    <div>
      <Loading fallback={<p>Loading user data...</p>}>
        <p>User ID: {params().id}</p>
        <p>User Name: {userData()?.name}</p>
      </Loading>
    </div>
  );
}
