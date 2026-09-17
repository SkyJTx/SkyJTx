import type { RouteSectionProps } from "@solidjs/router";
import type { JSX } from "@solidjs/web";
import { Link } from "~/router";

/**
 * Top-level main layout providing navigation across the primary application views.
 */
export default function MainLayout(props: RouteSectionProps): JSX.Element {
  return (
    <div class="app-layout">
      <nav class="site-nav">
        <Link to="/">
          Home
        </Link>
        <Link
          to="/user/:id"
          params={{ id: 42 }}
        >
          User 42
        </Link>
      </nav>
      <main class="content-container">{props.children}</main>
    </div>
  );
}
