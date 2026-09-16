import type { ParentProps } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Router, TypedLink } from "./router";
import "./App.css";

export default function App(): JSX.Element {
  return (
    <Router>
      {(props: ParentProps) => (
        <div class="app-layout">
          <nav class="site-nav">
            <TypedLink to="/" activeClass="active">
              Home
            </TypedLink>
            <TypedLink
              to="/users/:id"
              params={{ id: 42 }}
              search={{ tab: "profile" }}
              activeClass="active"
            >
              User 42
            </TypedLink>
          </nav>
          <main class="content-container">{props.children}</main>
        </div>
      )}
    </Router>
  );
}
