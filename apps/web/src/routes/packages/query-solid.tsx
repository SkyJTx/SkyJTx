import { Title } from "@solidjs/meta";
import { useSolidQuery, useSolidMutation } from "@skyjtx/query-solid";
import { Suspense, ErrorBoundary } from "solid-js";
import CodeBlock from "../../components/CodeBlock";
import "./reactivity.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchUser(id: string) {
  await sleep(5000); // Simulate network latency
  if (id === "404") throw new Error("User not found");
  return {
    id,
    name: "Alice Framework",
    email: "alice@example.com",
    status: "active",
  };
}

async function updateUser(variables: { id: string; name: string }) {
  await sleep(800);
  const shuffledName = variables.name.split("").sort(() => 0.5 - Math.random()).join("");
  return {
    id: Math.random().toString(36).substring(2, 9), // Simulate new ID generation
    name: shuffledName,
    email: "alice@example.com",
    status: "active",
  };
}

function UserProfilePanel() {
  const query = useSolidQuery({
    queryKey: () => ["user", "1"],
    queryFn: () => fetchUser("1"),
  });

  const mutation = useSolidMutation({
    mutationFn: updateUser,
    onSuccess(data) {
      console.log("Updated user successfully:", data);
      query.mutate(data); // Update the cache with new data
    },
  });

  return (
    <div class="store-panel">
      <h3 class="history-title">Profile Data (Client/Server Shared)</h3>

      <div class="labeled-value">
        <span class="label">Query Status</span>
        <span
          class={`value ${query.isLoading ? "status-loading" : query.isError ? "status-error" : "status-success"}`}
        >
          {query.isLoading ? "Loading..." : query.isError ? "Error" : "Success"}
        </span>
      </div>

      {!query.isLoading && query.data && (
        <>
          <div class="labeled-value">
            <span class="label">ID</span>
            <span class="value">{query.data.id}</span>
          </div>
          <div class="labeled-value">
            <span class="label">Name</span>
            <span class="value">{query.data.name}</span>
          </div>
          <div class="labeled-value">
            <span class="label">Email</span>
            <span class="value">{query.data.email}</span>
          </div>
        </>
      )}

      {query.isError && (
        <div class="labeled-value">
          <span class="label status-error">Error Message</span>
          <span class="value">{String(query.error)}</span>
        </div>
      )}

      <div class="spaceful-row store-panel-actions">
        <button
          class="neu-btn"
          disabled={mutation.isPending || query.isLoading}
          onClick={() =>
            mutation.mutate({
              id: "1",
              name: "Alice Updated " + Math.round(Math.random() * 100),
            })
          }
        >
          {mutation.isPending ? "Updating Name..." : "Mutate Name"}
        </button>
        <button class="neu-btn" onClick={() => query.refetch()}>
          Refetch Data
        </button>
      </div>

      {mutation.isSuccess && (
        <p class="success-message">✓ Mutation was successful!</p>
      )}
    </div>
  );
}

export default function QuerySolidShowcase() {
  return (
    <div class="reactivity-showcase-wrapper">
      <Title>Queries - Reactivity Showcase</Title>

      <header class="showcase-header">
        <h1 class="glass-title">Query Solid</h1>
        <p class="glass-subtitle">@skyjtx/query-solid</p>
      </header>

      <main class="showcase-content">
        <section class="showcase-section section-stores">
          <div class="sticky-side">
            <h2 class="section-heading">Suspense & SSR Data Fetching</h2>
            <div class="description glass-text store-description-text">
              <p class="store-description-para">
                <strong>@skyjtx/query-solid</strong> replicates modern
                composables for data synchronization, specifically built for
                Solid's Suspense and native SSR mechanics.
              </p>
              <p class="store-description-para">
                <strong>Safety & Reliability:</strong> Query keys define cache
                boundaries. During Server-Side Rendering, resources accurately
                block output until resolved, hydrating directly into the client
                via <code>seroval</code>.
              </p>
              <p class="store-description-para">
                <strong>Signals-first:</strong> Destructuring the hook yields a
                reactive proxy. Changing statuses like <code>isLoading</code>{" "}
                naturally cascade down without explicit tracking.
              </p>
            </div>

            <CodeBlock
              lang="tsx"
              code={`import { useSolidQuery } from "@skyjtx/query-solid";
import { Suspense } from "solid-js";

function Profile() {
  const query = useSolidQuery({
    queryKey: "user",
    queryFn: async () => fetchUser("1"),
  });

  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      {query.data && <p>Name: {query.data.name}</p>}
      <button onClick={() => query.refetch()}>
        Refresh
      </button>
    </Suspense>
  );
}`}
            />
          </div>

          <div class="section-main">
            <div class="stores-panels-vertical">
              <ErrorBoundary
                fallback={(err) => <p>Failed to load profile: {String(err)}</p>}
              >
                <Suspense
                  fallback={
                    <div class="store-panel loading-fallback">
                      <h3 class="history-title">
                        Profile Data (Client/Server Shared)
                      </h3>
                      <p class="loading-text">
                        Fetching initial data over network...
                      </p>
                    </div>
                  }
                >
                  <UserProfilePanel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
