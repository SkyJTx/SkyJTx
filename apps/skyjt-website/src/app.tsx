import { Errored, Loading, type ParentProps } from "solid-js";
import type { JSX } from "@solidjs/web";
import { Router } from "~/router";
import { ClientSettingsProvider } from "~/components/ClientSettings";
import "./app.css";

/**
 * Root application component configuring global client settings, the router shell, and loading fallback.
 */
export default function App(): JSX.Element {
  return (
    <ClientSettingsProvider>
      <Router>
        {(props: ParentProps) => (
          <Errored fallback={(error) => <div>{String(error())}</div>}>
            <Loading fallback={<div>Loading...</div>}>{props.children}</Loading>
          </Errored>
        )}
      </Router>
    </ClientSettingsProvider>
  );
}
