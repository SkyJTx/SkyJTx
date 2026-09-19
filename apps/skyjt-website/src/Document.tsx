import type { ParentProps } from "solid-js";
import { HydrationScript, getRequestEvent } from "@solidjs/web";
import { parseServerCookies } from "~/components/ClientSettings/cookieStorage";
import { FONT_SIZE_MAP } from "~/components/ClientSettings/types";

const FOUC_PREVENTION_SCRIPT = `(function(){try{var m=document.cookie.match(/(^|;)\\s*skyjt_theme=([^;]+)/);var t=m?decodeURIComponent(m[2]):"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark-seed":"light-seed");var sm=document.cookie.match(/(^|;)\\s*skyjt_seed=([^;]+)/);if(sm){document.documentElement.style.setProperty("--seed",decodeURIComponent(sm[2]));}var fm=document.cookie.match(/(^|;)\\s*skyjt_font_size=([^;]+)/);if(fm){var f=decodeURIComponent(fm[2]);var sz={sm:"14px",md:"16px",lg:"18px",xl:"20px"};if(sz[f]){document.documentElement.style.fontSize=sz[f];}}}catch(e){}})();`;

/**
 * The document shell for the app rendered during SSR.
 */
export default function Document(props: ParentProps) {
  const event = getRequestEvent();
  const initialSettings = parseServerCookies(event?.request.headers.get("cookie"));

  return (
    <html
      lang="en"
      data-theme={initialSettings.resolvedTheme}
      style={{
        "--seed": initialSettings.seedColor,
        "font-size": FONT_SIZE_MAP[initialSettings.fontSize],
      }}
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Nattakarn Khumsupha | Portfolio</title>
        <script>{FOUC_PREVENTION_SCRIPT}</script>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
