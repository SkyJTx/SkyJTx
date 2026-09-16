import { Title } from "@solidjs/meta";
import type { JSX } from "@solidjs/web";
import { TypedLink } from "../router";

export default function NotFound(): JSX.Element {
  return (
    <main class="not-found">
      <Title>404 - Not Found</Title>
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <TypedLink to="/">Return to Home</TypedLink>
    </main>
  );
}
