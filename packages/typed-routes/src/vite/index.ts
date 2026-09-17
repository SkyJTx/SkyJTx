import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";
import type {
  RuntimeAdapterName,
  RuntimeAdapterOption,
  CustomAdapterContext,
  CustomRuntimeAdapterFn,
  CustomRuntimeAdapterObject,
} from "../adapters/runtime/types";

export type {
  RuntimeAdapterName,
  RuntimeAdapterOption,
  CustomAdapterContext,
  CustomRuntimeAdapterFn,
  CustomRuntimeAdapterObject,
};

/**
 * Options for configuring typedRoutes Vite plugin.
 */
export interface TypedRoutesPluginOptions extends FileRoutesOptions {
  adapter?: RuntimeAdapterOption;
}

/**
 * Emits platform-specific server entrypoints and routing glue into the build output.
 */
export async function emitRuntimeAdapter(
  adapter: RuntimeAdapterOption,
  cwd: string = process.cwd(),
): Promise<void> {
  const distClient = join(cwd, "dist", "client");
  const distServer = join(cwd, "dist", "server");
  const serverEntry = join(distServer, "server.js");
  const context: CustomAdapterContext = {
    cwd,
    distClient,
    distServer,
    serverEntry,
  };

  if (typeof adapter === "function") {
    await adapter(context);
    return;
  }

  if (typeof adapter === "object" && adapter !== null && typeof adapter.emit === "function") {
    await adapter.emit(context);
    return;
  }

  if (adapter === "cloudflare") {
    mkdirSync(distClient, { recursive: true });
    const content = `import server from "../server/server.js";

export default {
  async fetch(request, env) {
    if (env?.ASSETS && typeof env.ASSETS.fetch === "function") {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }
    return server.fetch(request);
  },
};
`;
    writeFileSync(join(distClient, "_worker.js"), content, "utf8");
  } else if (adapter === "bun") {
    mkdirSync(distServer, { recursive: true });
    const content = `import server from "./server.js";

const port = Number(process.env.PORT) || 3000;
Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/" && !url.pathname.includes("..")) {
      const file = Bun.file(\`./dist/client\${url.pathname}\`);
      if (await file.exists()) return new Response(file);
    }
    return server.fetch(req);
  },
});
console.log(\`Bun server running on http://localhost:\${port}\`);
`;
    writeFileSync(join(distServer, "index.js"), content, "utf8");
  } else if (adapter === "node") {
    mkdirSync(distServer, { recursive: true });
    const content = `import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import server from "./server.js";

function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url || "/", \`\${protocol}://\${host}\`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
      else headers.set(key, value);
    }
  }
  const method = req.method?.toUpperCase() || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? Readable.toWeb(req) : undefined;
  return new Request(url.toString(), { method, headers, body, duplex: hasBody ? "half" : undefined });
}

async function sendWebResponse(webRes, nodeRes) {
  nodeRes.statusCode = webRes.status;
  webRes.headers.forEach((val, key) => nodeRes.setHeader(key, val));
  if (!webRes.body) return nodeRes.end();
  const reader = webRes.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    nodeRes.write(value);
  }
  nodeRes.end();
}

const port = Number(process.env.PORT) || 3000;
const httpServer = createServer(async (req, res) => {
  const pathname = (req.url || "/").split("?")[0];
  if (pathname !== "/" && !pathname.includes("..")) {
    const filePath = join(process.cwd(), "dist/client", pathname);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      return createReadStream(filePath).pipe(res);
    }
  }
  try {
    const webReq = toWebRequest(req);
    const webRes = await server.fetch(webReq);
    await sendWebResponse(webRes, res);
  } catch (err) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

httpServer.listen(port, () => {
  console.log(\`Node server running on http://localhost:\${port}\`);
});
`;
    writeFileSync(join(distServer, "index.js"), content, "utf8");
  } else if (adapter === "vercel") {
    mkdirSync(join(cwd, "api"), { recursive: true });
    const content = `import server from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

export default function handler(request) {
  return server.fetch(request);
}
`;
    writeFileSync(join(cwd, "api", "index.js"), content, "utf8");
  } else if (adapter === "aws-lambda") {
    mkdirSync(distServer, { recursive: true });
    const content = `import server from "./server.js";
import { createLambdaHandler } from "@skyjt/typed-routes/adapters/aws-lambda";

export const handler = createLambdaHandler(server);
`;
    writeFileSync(join(distServer, "lambda.js"), content, "utf8");
  }
}

/**
 * Vite plugin configuring file-system routing, Solid SSR options, and automated runtime adapter emission.
 */
export function typedRoutes(options?: TypedRoutesPluginOptions): PluginOption[] {
  const selectedAdapter = options?.adapter;
  const fsPlugins = fileRoutes({
    types: true,
    ...options,
  });

  const ssrConfigPlugin: Plugin = {
    name: "skyjt:typed-routes:ssr-config",
    config() {
      return {
        resolve: {
          dedupe: ["solid-js", "@solidjs/web"],
        },
        ssr: {
          noExternal: true,
        },
      };
    },
    async closeBundle() {
      if (!selectedAdapter) return;
      try {
        await emitRuntimeAdapter(selectedAdapter);
      } catch (error) {
        console.error("Failed to emit runtime adapter:", error);
      }
    },
  };

  const pluginsList = Array.isArray(fsPlugins) ? fsPlugins : [fsPlugins];
  return [...pluginsList, ssrConfigPlugin];
}
