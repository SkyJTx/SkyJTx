import type { ParentProps } from 'solid-js';
import { HydrationScript } from '@solidjs/web';

/**
 * The document shell for the app. This is the root of the HTML document and is
 * responsible for rendering the <html>, <head>, and <body> tags. The app root
 * is rendered inside the <body> tag.
 *
 * You can customize this file to add global styles, meta tags, or other
 * elements that should be present in the HTML document. This file is only
 * rendered on the server and is not part of the client-side application.
 *
 * Note: This file is only used in server-side rendering (SSR) mode. If you are
 * using client-side rendering (CSR) mode, this file will not be used.
 */
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Solid App</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
