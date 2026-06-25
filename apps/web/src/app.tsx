import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { QueriesProvider } from "@skyjt/query-solid";
import { AppThemeProvider } from "./components/ThemeComponents/ThemeProvider";

export default function App() {
  return (
    <Router
      root={(props) => (
        <QueriesProvider>
          <MetaProvider>
            <AppThemeProvider>
              <Title>Nattakarn Khumsupha - SkyJT</Title>
              <Suspense>{props.children}</Suspense>
            </AppThemeProvider>
          </MetaProvider>
        </QueriesProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
