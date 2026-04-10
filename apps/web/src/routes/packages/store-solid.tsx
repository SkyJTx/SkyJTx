import { Title } from "@solidjs/meta";
import { defineStore } from "@skyjtx/store-solid";
import CodeBlock from "../../components/CodeBlock";
import "./reactivity.css";

const useShowcaseCounterStore = defineStore("showcase.counter", () => ({
  count: typeof window === "undefined" ? 0 : Math.floor(Math.random() * 100),
  createdAt:
    typeof window === "undefined"
      ? new Date("2024-01-01T00:00:00.000Z")
      : new Date(),
  get isEven() {
    return this.count % 2 === 0;
  },
  get double() {
    return this.count * 2;
  },
  set double(value: number) {
    this.count = value / 2;
  },
  get triple() {
    return this.count * 3;
  },
  increment() {
    this.count += 1;
  },
  decrement() {
    this.count -= 1;
  },
  reset() {
    this.count = 0;
  },
}));

function StoreCounterPanel(props: { title: string }) {
  const store = useShowcaseCounterStore();

  return (
    <div class="store-panel">
      <h3 class="history-title">{props.title}</h3>
      <div class="labeled-value">
        <span class="label">Count</span>
        <span class="value">{store.count}</span>
      </div>
      <div class="labeled-value">
        <span class="label">Is Even?</span>
        <span class="value">{store.isEven ? "Yes" : "No"}</span>
      </div>
      <div class="labeled-value">
        <span class="label">Double</span>
        <span class="value">{store.double}</span>
      </div>
      <div class="labeled-value">
        <span class="label">Triple</span>
        <span class="value">{store.triple}</span>
      </div>
      <div class="spaceful-row store-panel-actions">
        <button class="neu-btn" onClick={() => store.decrement()}>
          Decrement
        </button>
        <button class="neu-btn" onClick={() => store.increment()}>
          Increment
        </button>
        <button class="neu-btn" onClick={() => store.reset()}>
          Reset
        </button>
        <button class="neu-btn" onClick={() => (store.double = 10)}>
          Set Double to 10
        </button>
      </div>
    </div>
  );
}

export default function StoreSolidShowcase() {
  const showcaseCounterStore = useShowcaseCounterStore();

  return (
    <div class="reactivity-showcase-wrapper">
      <Title>Stores - Reactivity Showcase</Title>

      <header class="showcase-header">
        <h1 class="glass-title">Store Solid</h1>
        <p class="glass-subtitle">@skyjtx/store-solid</p>
      </header>

      <main class="showcase-content">
        <section class="showcase-section section-stores">
          <div class="sticky-side">
            <h2 class="section-heading">SSR-Aware Context Stores</h2>
            <div class="description glass-text store-description-text">
              <p class="store-description-para">
                <strong>@skyjtx/store-solid</strong> provides a unified store
                pattern solving state hydration across environments.
              </p>
              <p class="store-description-para">
                <strong>Server-Client Match:</strong> The store state is
                serialized dynamically during SSR using Solid's async mechanics.
                When the client loads, it seamlessly hydrates the initial state,
                preventing UI mismatches while retaining reactivity for complex
                objects like `Date`.
              </p>
              <p class="store-description-para">
                <strong>Single Run on Server:</strong> Component-level state
                normally runs once per component. Using `defineStore`, the
                initializer runs exactly <em>once per request</em> on the server
                (thanks to context registries), improving SSR performance and
                data consistency, while keeping multiple clients strictly
                isolated.
              </p>
            </div>

            <CodeBlock
              lang="typescript"
              code={`import { defineStore } from "@skyjtx/store-solid";

const useShowcaseCounterStore = defineStore(
  "showcase.counter", 
  () => ({
    count: typeof window === "undefined" 
      ? 0 
      : Math.floor(Math.random() * 100),
    createdAt: typeof window === "undefined"
      ? new Date("2024-01-01")
      : new Date(),
    get isEven() { return this.count % 2 === 0; },
    get double() { return this.count * 2; },
    set double(val: number) { this.count = val / 2; },
    get triple() { return this.count * 3; },
    increment() { this.count += 1; },
    decrement() { this.count -= 1; },
    reset() { this.count = 0; },
  })
);`}
            />

            <div class="description glass-text store-description-text store-panel-actions">
              <p>
                Consuming the store is as simple as calling the hook returned by
                `defineStore`. Sharing state is simple and isolated deeply per
                request implicitly.
              </p>
            </div>

            <CodeBlock
              lang="tsx"
              code={`function StoreCounterPanel() {
  const store = useShowcaseCounterStore();

  return (
    <div>
      <p>Count: {store.count}</p>
      <p>Created: {store.createdAt.toDateString()}</p>
      <button onClick={() => store.increment()}>
        Increment
      </button>
    </div>
  );
}`}
            />
          </div>
          <div class="section-main">
            <div class="control-group">
              <div class="labeled-value">
                <span class="label">Store Initialized At (SSR Hydrated)</span>
                <span class="value store-created-at-value">
                  {showcaseCounterStore.createdAt.toLocaleString()}
                </span>
              </div>
            </div>

            <div class="stores-panels-vertical">
              <StoreCounterPanel title="Instance A (Reads and Mutates)" />
              <StoreCounterPanel title="Instance B (Shares the identical store)" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
