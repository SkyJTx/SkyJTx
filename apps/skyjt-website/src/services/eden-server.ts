import { treaty } from "@elysiajs/eden";
import { getRequestEvent, type RequestEvent } from "@solidjs/web";
import app, { type AppType } from "~/server";

/**
 * Hop-by-hop headers per RFC 9110 / RFC 7230 that must not be forwarded across proxy boundaries.
 */
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

/**
 * Permitted host domains for authority header preservation.
 */
const ALLOWED_HOST_PATTERNS = [
  /^localhost(:\d+)?$/,
  /^127\.0\.0\.1(:\d+)?$/,
  /^([a-z0-9-]+\.)*skyjt\.dev$/,
  /^([a-z0-9-]+\.)*pages\.dev$/,
];

function isAllowedHost(host: string): boolean {
  return ALLOWED_HOST_PATTERNS.some((pattern) => pattern.test(host));
}

export interface EdenServerOptions {
  readonly event?: RequestEvent;
  readonly headers?: HeadersInit;
  readonly env?: unknown;
  readonly signal?: AbortSignal;
  readonly fetcher?: (req: Request, env?: unknown) => Promise<Response>;
}

/**
 * Creates an Eden Treaty server instance with hardened bidirectional HTTP context forwarding.
 */
export function createEdenServer(options?: EdenServerOptions) {
  const fetcherHandler = async (url: string, init?: RequestInit): Promise<Response> => {
    const event = options?.event ?? (() => {
      try {
        return getRequestEvent();
      } catch {
        return undefined;
      }
    })();

    let env = options?.env;
    if (!env && event) {
      env = (event as { context?: { cloudflare?: { env?: unknown } } })?.context?.cloudflare?.env;
    }

    let signal = options?.signal || init?.signal;
    if (!signal && event?.request?.signal) {
      signal = event.request.signal;
    }

    // Sanitize headers for the outgoing request
    const reqHeaders = new Headers(init?.headers);
    const method = (init?.method || "GET").toUpperCase();
    if (method === "GET" || method === "HEAD") {
      reqHeaders.delete("content-length");
      reqHeaders.delete("content-type");
    }
    HOP_BY_HOP_HEADERS.forEach((h) => reqHeaders.delete(h));

    const req = new Request(url, {
      ...init,
      headers: reqHeaders,
      signal,
    });

    if (options?.fetcher) {
      return options.fetcher(req, env);
    }

    return (app.fetch as (request: Request, env?: unknown) => Promise<Response>)(req, env);
  };

  return treaty<AppType>("http://localhost", {
    headers: () => {
      const merged = new Headers();
      const event = options?.event ?? (() => {
        try {
          return getRequestEvent();
        } catch {
          return undefined;
        }
      })();

      if (event?.request?.headers) {
        event.request.headers.forEach((val, key) => {
          const lowerKey = key.toLowerCase();
          if (HOP_BY_HOP_HEADERS.has(lowerKey)) {
            return;
          }
          merged.set(key, val);
        });

        // Host authority with whitelist verification
        const rawHost = event.request.headers.get("host") || "";
        if (rawHost && isAllowedHost(rawHost)) {
          if (!merged.has("x-forwarded-host")) {
            merged.set("x-forwarded-host", rawHost);
          }
        }

        if (!merged.has("x-forwarded-proto")) {
          const url = new URL(event.request.url);
          merged.set("x-forwarded-proto", url.protocol.replace(":", ""));
        }
      }

      if (options?.headers) {
        new Headers(options.headers).forEach((val, key) => {
          merged.set(key, val);
        });
      }

      return Object.fromEntries(merged.entries());
    },

    onResponse: (response: Response) => {
      const event = options?.event ?? (() => {
        try {
          return getRequestEvent();
        } catch {
          return undefined;
        }
      })();

      if (event?.response?.headers) {
        const setCookies = typeof response.headers.getSetCookie === "function"
          ? response.headers.getSetCookie()
          : [response.headers.get("set-cookie")].filter((c): c is string => Boolean(c));

        for (const cookie of setCookies) {
          if (cookie) {
            event.response.headers.append("Set-Cookie", cookie);
          }
        }
      }
    },

    fetcher: fetcherHandler as typeof fetch,
  });
}

export const edenServer = createEdenServer();
export type EdenServer = typeof edenServer;
