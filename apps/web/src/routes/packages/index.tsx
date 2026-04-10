import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import "./reactivity.css"; // Reuse existing css style

export default function PackagesOverview() {
  return (
    <div class="reactivity-showcase-wrapper">
      <Title>Packages</Title>

      <header class="showcase-header">
        <h1 class="glass-title">Packages</h1>
        <p class="glass-subtitle">Discover our custom libraries</p>
      </header>

      <main class="showcase-content">
        <section class="showcase-section section-signals">
          <div class="sticky-side">
            <h2 class="section-heading">@skyjtx/signals-solid</h2>
            <p class="description glass-text">
              A light-weight reactivity primitives library tailored for Solid.js
            </p>
          </div>
          <div class="section-main package-cta-container">
            <p>
              Includes <code>useSignal</code>, <code>useComputed</code>,{" "}
              <code>useReactive</code>, and more.
            </p>
            <A href="/packages/signals-solid" class="neu-btn">
              Explore Signals
            </A>
          </div>
        </section>

        <section class="showcase-section section-stores">
          <div class="sticky-side">
            <h2 class="section-heading">@skyjtx/store-solid</h2>
            <p class="description glass-text">
              Context + SSR solid stores with state hydration.
            </p>
          </div>
          <div class="section-main package-cta-container">
            <p>
              Includes <code>defineStore</code>, caching store per registry and
              shares it across components.
            </p>
            <A href="/packages/store-solid" class="neu-btn">
              Explore Stores
            </A>
          </div>
        </section>
      </main>
    </div>
  );
}
