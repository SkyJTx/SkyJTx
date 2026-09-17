import { Loading, type ParentProps } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Router } from "~/router";
import "./App.css";

/**
 * Root application component configuring the router shell and loading fallback.
 */
export default function App(): JSX.Element {
  return (
    <Router>
      {(props: ParentProps) => (
        <Loading fallback={<main class="content-container">Loading...</main>}>
          {props.children}
        </Loading>
      )}
    </Router>
  );
}
