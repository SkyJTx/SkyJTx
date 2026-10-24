import { defineRoute } from "@skyjt/typed-routes-solid";
import { revalidate } from "@solidjs/router";
import { createMemo, Errored, Loading, onSettled, Show } from "solid-js";
import {
  loadUserData,
  UserRouteParamsSchema,
  type UserRouteParams,
} from "~/services/userDemo";

export const route = defineRoute({
  params: UserRouteParamsSchema,
  preload: async ({ params: [params, error] }) => {
    if (error) return;
    return loadUserData(params.id);
  },
});

export type { UserRouteParams };

export default function UserRoute() {
  const [params, paramsError] = route.useParams();
  const userData = createMemo(() => {
    const p = params();
    return p ? loadUserData(p.id) : undefined;
  });

  onSettled(() => {
    const p = params();
    if (!p) return;

    const intervalId = setInterval(() => {
      revalidate(loadUserData.keyFor(p.id));
    }, 1000);

    return () => {
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
