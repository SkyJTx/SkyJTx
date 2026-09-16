import type { ParentProps } from 'solid-js';
import { HydrationScript } from '@solidjs/web';

/**
 * Root HTML document shell rendered on the server for streaming SSR.
 */
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>SkyJT Website</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}

