import { createSignal } from 'solid-js';
import logo from './logo.svg';
import './App.css';

/**
 * The main app component. This is the root of the client-side application and is
 * responsible for rendering the app's UI. You can customize this file to add your
 * own components, routes, or other functionality.
 *
 * Note: This file is only used in client-side rendering (CSR) mode. If you are
 * using server-side rendering (SSR) mode, this file will not be used.
 */
export default function App() {
  const [count, setCount] = createSignal(0);

  return (
    <header class="header">
      <img src={logo} class="logo" alt="Solid logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <button class="increment" onClick={() => setCount(count() + 1)}>
        Clicks: {count()}
      </button>
      <a
        class="link"
        href="https://v2.solidjs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </header>
  );
}
