import { Loading, type ParentProps } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Router, Link } from "~/router";
import "./App.css";

export default function App(): JSX.Element {
  return (
    <Router>
      {(props: ParentProps) => (
        <div class="app-layout">
          <nav class="site-nav">
            <Link to="/">
              Home
            </Link>
            <Link
              to="/users/:id"
              params={{ id: 42 }}
              search={{ tab: "profile" }}
            >
              User 42
            </Link>
          </nav>
          <Loading fallback={<main class="content-container">Loading...</main>}>
            <main class="content-container">{props.children}</main>
          </Loading>
        </div>
      )}
    </Router>
  );
}
