import { Title } from "@solidjs/meta";
import type { JSX } from "@solidjs/web";
import { defineRoute, schema } from "@skyjt/typed-routes";

/**
 * Route definition without hardcoded path string.
 * Validates path parameters and search query params.
 */
export const route = defineRoute({
  params: schema.object({
    id: schema.number(),
  }),
  search: schema.object({
    tab: schema.string().optional(),
    tag: schema.array(schema.string()).optional(),
  }),
});

export default function UserPage(): JSX.Element {
  const params = route.useParams();
  const search = route.useSearch();

  return (
    <div class="user-view">
      <Title>User #{params().id}</Title>
      <h2>User Profile: #{params().id}</h2>
      <p>Active Tab: {search().tab ?? "overview"}</p>
      <p>Tags: {search().tag ? search().tag?.join(", ") : "none"}</p>
    </div>
  );
}
