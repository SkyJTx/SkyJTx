import { Title } from "@solidjs/meta";
import { untrack } from "solid-js";
import {
  useSignal,
  useComputed,
  useReactive,
  useEffect,
  useWatch,
} from "@skyjtx/signals-solid";
import "./reactivity.css";

export default function SignalsSolidShowcase() {
  // --- useSignal & useComputed ---
  const count = useSignal(0);
  const doubleCount = useComputed(() => count.value * 2);

  // Writable computed
  const offset = useComputed({
    getter: () => count.value + 10,
    setter: (val: number) => {
      count.value = val - 10;
    },
  });

  const lastCountChange = useSignal<string>("—");

  // --- useReactive ---
  const state = useReactive({
    x: 0,
    y: 0,
    history: [] as string[],
  });

  // --- useEffect & useWatch ---
  const effectManager = useEffect(() => {
    // Read only the properties we want to track
    const currentX = state.x;
    const currentY = state.y;

    // Mutate state without tracking the history array itself
    // to prevent infinite loops (since push/shift read the array)
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
        <h1 class="glass-title">Signals & Computed</h1>
        <p class="glass-subtitle">@skyjtx/signals-solid</p>
      </header>

      <main class="showcase-content">
        <section class="showcase-section section-signals">
          <div class="sticky-side">
            <h2 class="section-heading">Signals & Computed</h2>
            <p class="description glass-text">
              Signals hold state, Computed derive state, and Watch reacts to
              changes.
            </p>
          </div>
          <div class="section-main">
            <div class="control-group">
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
            </div>

            <div class="button-group spaceful-row">
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
        </section>

        <section class="showcase-section section-proxy">
          <div class="sticky-side">
            <h2 class="section-heading">Reactive Proxy & Effects</h2>
            <p class="description glass-text">
              Move your mouse! The position is tracked in a transparently
              reactive proxy object. An effect logs the movement to the history
              below.
            </p>
          </div>
          <div class="section-main">
            <div class="proxy-visualizer">
              <div class="coordinate">
                <span class="coord-label">X</span>
                <span class="coord-val">{state.x}</span>
              </div>
              <div class="coordinate">
                <span class="coord-label">Y</span>
                <span class="coord-val">{state.y}</span>
              </div>
            </div>

            <div class="effect-controls spaceful-row">
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
        </section>
      </main>
    </div>
  );
}
