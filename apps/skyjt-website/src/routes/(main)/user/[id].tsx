import { defineRoute, schema, InferOutput, validateData } from "@skyjt/typed-routes";
import { query, revalidate } from "@solidjs/router";
import { createMemo, Errored, Loading, onSettled } from "solid-js";

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

  const dataSchema = schema.object({
    id: schema.bigint(),
    name: schema.string().pattern(/^User \d+$/),
    fetch_at: schema.date(),
  });

  const result = validateData(dataSchema, data);

  if (!result.success) {
    throw new Error(result.issues.map((issue) => issue.message).join(", ") || "Invalid user data");
  }

  return result.data;
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
      <Errored fallback={<p>Error occurred while fetching user data.</p>}>
        <Loading fallback={<p>Loading user data...</p>}>
          <p>User ID: {params().id}</p>
          <p>User Name: {userData().name}</p>
          <p>User Fetched At: {userData().fetch_at.toLocaleString()}</p>
        </Loading>
      </Errored>
    </div>
  );
}
