import { Title } from "@solidjs/meta";
import type { JSX } from "@solidjs/web";
import { TypedLink } from "../router";

export default function Home(): JSX.Element {  
  return (
    <div class="home-view">
      <Title>SkyJT Website</Title>
      <h1>SkyJT Website</h1>
      <p>End-to-end compile-time typed routes with parameter validation on Solid 2.</p>
      <div class="links">
        <TypedLink
          to="/users/:id"
          params={{ id: 42 }}
          search={{ tab: "profile", tag: ["solid", "typed-routes"] }}
        >
          View User 42 (Profile)
        </TypedLink>
      </div>
    </div>
  );
}
