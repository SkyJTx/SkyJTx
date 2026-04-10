import { createResource, ErrorBoundary, Suspense } from "solid-js";
import { codeToHtml } from "shiki";

export default function CodeBlock(props: { code: string; lang: string }) {
  const [html] = createResource(
    () => props.code,
    async (code) => {
      // Generates an HTML string of the highlighted code
      return await codeToHtml(code, {
        lang: props.lang,
        theme: "github-dark-dimmed",
      });
    },
  );

  return (
    <ErrorBoundary
      fallback={
        <pre class="codeblock shiki-container">
          <code>{props.code}</code>
        </pre>
      }
    >
      <Suspense
        fallback={
          <pre class="codeblock shiki-container">
            <code>{props.code}</code>
          </pre>
        }
      >
        <div
          class="shiki-container"
          innerHTML={html()}
          style={{
            "border-radius": "12px",
            overflow: "hidden",
            margin: "1.5rem 0",
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
