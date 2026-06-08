import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { StoresProvider } from "@skyjt/store-solid";
import { QueriesProvider } from "@skyjt/query-solid";
import { AppThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  return (
    <Router
      root={(props) => (
        <QueriesProvider>
          <StoresProvider>
            <MetaProvider>
              <AppThemeProvider>
                <Title>Reactivity Studio</Title>
                <Suspense>{props.children}</Suspense>
              </AppThemeProvider>
            </MetaProvider>
          </StoresProvider>
        </QueriesProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
