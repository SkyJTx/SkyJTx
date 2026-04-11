import { Title } from "@solidjs/meta";
import { untrack } from "solid-js";
import {
  useSignal,
  useComputed,
  useReactive,
  useEffect,
  useWatch,
} from "@skyjtx/signals-solid";
import CodeBlock from "../../components/CodeBlock";
import "./reactivity.css";

export default function SignalsSolidShowcase() {
  const count = useSignal(0);
  const doubleCount = useComputed(() => count.value * 2);

  const offset = useComputed({
    getter: () => count.value + 10,
    setter: (val: number) => {
      count.value = val - 10;
    },
  });

  const lastCountChange = useSignal<string>("—");

  const state = useReactive({
    x: 0,
    y: 0,
    history: [] as string[],
  });

  const effectManager = useEffect(() => {
    const currentX = state.x;
    const currentY = state.y;

    untrack(() => {
      state.history.push(`Moved to (${currentX}, ${currentY})`);
      if (state.history.length > 5) {
        state.history.shift();
      }
    });
  });

  useWatch(
    () => count.value,
    ({ value, prev }) => {
      lastCountChange.value = `${prev} → ${value}`;
    },
  );

  const handleMouseMove = (e: MouseEvent) => {
    state.x = e.clientX;
    state.y = e.clientY;
  };

  return (
    <div class="reactivity-showcase-wrapper" onMouseMove={handleMouseMove}>
      <Title>Signals - Reactivity Showcase</Title>

      <header class="showcase-header">
        <h1 class="glass-title">Signals Solid</h1>
        <p class="glass-subtitle">@skyjtx/signals-solid</p>
      </header>

      <main class="showcase-content">
        <section class="showcase-section section-signals">
          <div class="sticky-side">
            <h2 class="section-heading">Signals & Computed</h2>
            <div class="description glass-text store-description-text">
              <p class="store-description-para">
                <strong>@skyjtx/signals-solid</strong> introduces standard
                patterns like Vue/Preact but with Solid's engine under the hood.
                No more <code>[count, setCount]</code> pairing—you get purely
                reactive objects and values.
              </p>
              <p class="store-description-para">
                <strong>Read/Write the `.value`:</strong> Simply interact with
                `.value` directly and Solid's tracking detects it seamlessly.
              </p>
              <p class="store-description-para">
                Signals hold granular state natively, Computed automatically
                derive side-effects transparently, and Watch performs
                action-bounded lifecycle synchronization efficiently.
              </p>
            </div>

            <CodeBlock
              lang="tsx"
              code={`import { useSignal, useComputed } from "@skyjtx/signals-solid";

function Counter() {
  const count = useSignal(10);
  const doubleOffset = useComputed({
    getter: () => count.value * 2,
    setter: (val) => { count.value = val / 2; }
  });

  return (
    <>
       <button onClick={() => count.value++}>Add</button>
       <p>{count.value} vs Offset {doubleOffset.value}</p>
    </>
  );
}`}
            />
          </div>

          <div class="section-main">
            <div class="store-panel">
              <h3 class="history-title">Signal State Interactions</h3>

              <div class="labeled-value">
                <span class="label">Count (Signal .value)</span>
                <span class="value">{count.value}</span>
              </div>
              <div class="labeled-value">
                <span class="label">Double (Readonly Computed)</span>
                <span class="value">{doubleCount.value}</span>
              </div>
              <div class="labeled-value">
                <span class="label">Offset (+10) (Writable Computed)</span>
                <span class="value">{offset.value}</span>
              </div>
              <div class="labeled-value">
                <span class="label">Peek (untracked; won’t update)</span>
                <span class="value">{count.peek()}</span>
              </div>
              <div class="labeled-value">
                <span class="label">Watch (prev → next)</span>
                <span class="value">{lastCountChange.value}</span>
              </div>

              <div class="spaceful-row store-panel-actions">
                <button class="neu-btn" onClick={() => (count.value -= 1)}>
                  Decrement
                </button>
                <button class="neu-btn" onClick={() => (count.value += 1)}>
                  Increment
                </button>
                <button
                  class="neu-btn"
                  onClick={() => (offset.value += 5)}
                  title="Updating offset also updates count"
                >
                  Add 5 to Offset
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="showcase-section section-proxy">
          <div class="sticky-side">
            <h2 class="section-heading">Reactive Proxy & Effects</h2>
            <div class="description glass-text store-description-text">
              <p class="store-description-para">
                Using <code>useReactive()</code> allows creating deep proxies
                directly in functional boundaries. Updating the coordinates of a
                mouse instantly triggers the view to update efficiently via
                standard assignments (<code>state.x = clientX</code>).
              </p>
              <p class="store-description-para">
                <strong>Move your mouse!</strong> The position tracked below
                updates naturally and invokes tracked effect lifecycles
                continuously across UI updates effortlessly.
              </p>
            </div>
          </div>

          <div class="section-main">
            <div class="store-panel">
              <h3 class="history-title">Proxy Visualizer Array</h3>
              <div class="proxy-visualizer signals-visualizer">
                <div class="signals-coordinate">
                  <span class="coord-label">Mouse X</span>
                  <span class="coord-val">{state.x}</span>
                </div>
                <div class="signals-coordinate">
                  <span class="coord-label">Mouse Y</span>
                  <span class="coord-val">{state.y}</span>
                </div>
              </div>

              <div class="spaceful-row store-panel-actions">
                <button class="neu-btn" onClick={() => effectManager.pause()}>
                  Pause Tracking
                </button>
                <button class="neu-btn" onClick={() => effectManager.resume()}>
                  Resume Tracking
                </button>
                <button class="neu-btn" onClick={() => (state.history = [])}>
                  Clear History
                </button>
              </div>

              <div class="history-list glass-panel">
                <h3 class="history-title">Effect History (Max 5)</h3>
                <ul>
                  {state.history.map((entry) => (
                    <li>{entry}</li>
                  ))}
                  {state.history.length === 0 && (
                    <li class="empty-state">No history... Move your mouse!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
