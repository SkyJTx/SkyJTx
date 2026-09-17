import { Title } from "@solidjs/meta";
import type { JSX } from "@solidjs/web";
import { Link } from "~/router";

/**
 * Home page view highlighting typed routing capabilities.
 */
export default function Home(): JSX.Element {  
  return (
    <div class="home-view">
      <Title>SkyJT Website</Title>
      <h1>SkyJT Website</h1>
      <p>End-to-end compile-time typed routes with parameter validation on Solid 2.</p>
      <div class="links">
        <Link
          to="/user/:id"
          params={{ id: 42 }}
        >
          View User 42
        </Link>
      </div>
    </div>
  );
}
