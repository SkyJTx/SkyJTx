import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { StoresProvider } from "@skyjt/store-solid";
import { QueriesProvider } from "@skyjt/query-solid";

export default function App() {
  return (
    <Router
      root={(props) => (
        <QueriesProvider>
          <StoresProvider>
            <MetaProvider>
              <Title>Reactivity Studio</Title>
              <Suspense>{props.children}</Suspense>
            </MetaProvider>
          </StoresProvider>
        </QueriesProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
