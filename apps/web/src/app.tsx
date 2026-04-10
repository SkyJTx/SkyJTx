import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { StoresProvider } from "@skyjtx/store-solid";

export default function App() {
  return (
    <Router
      root={(props) => (
        <StoresProvider>
          <MetaProvider>
            <Title>Reactivity Studio</Title>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </StoresProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
