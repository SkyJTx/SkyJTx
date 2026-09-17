import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import type {
  RuntimeAdapterName,
  RuntimeAdapterOption,
  CustomAdapterContext,
  CustomRuntimeAdapterFn,
  CustomRuntimeAdapterObject,
} from "../types";

export type {
  RuntimeAdapterName,
  RuntimeAdapterOption,
  CustomAdapterContext,
  CustomRuntimeAdapterFn,
  CustomRuntimeAdapterObject,
};

/**
 * Options for configuring the runtimeAdapter Vite plugin.
 */
export interface RuntimeAdapterPluginOptions {
  adapter?: RuntimeAdapterOption;
  cwd?: string;
}

/**
 * Emits platform-specific server entrypoints and hosting glue into the build output.
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
import { createCloudflarePagesHandler } from "@skyjt/runtime-adapters/cloudflare";

export default {
  fetch: createCloudflarePagesHandler(server),
};
`;
    writeFileSync(join(distClient, "_worker.js"), content, "utf8");
  } else if (adapter === "bun") {
    mkdirSync(distServer, { recursive: true });
    const content = `import server from "./server.js";
import { startBunServer } from "@skyjt/runtime-adapters/bun";

const port = Number(process.env.PORT) || 3000;
startBunServer(server, { port });
console.log(\`Bun server running on http://localhost:\${port}\`);
`;
    writeFileSync(join(distServer, "index.js"), content, "utf8");
  } else if (adapter === "node") {
    mkdirSync(distServer, { recursive: true });
    const content = `import server from "./server.js";
import { createNodeServer } from "@skyjt/runtime-adapters/node";

const port = Number(process.env.PORT) || 3000;
createNodeServer(server, { port });
console.log(\`Node server running on http://localhost:\${port}\`);
`;
    writeFileSync(join(distServer, "index.js"), content, "utf8");
  } else if (adapter === "vercel") {
    mkdirSync(join(cwd, "api"), { recursive: true });
    const content = `import server from "../dist/server/server.js";
import { createVercelEdgeHandler } from "@skyjt/runtime-adapters/vercel";

export const config = {
  runtime: "edge",
};

export default createVercelEdgeHandler(server);
`;
    writeFileSync(join(cwd, "api", "index.js"), content, "utf8");
  } else if (adapter === "aws-lambda") {
    mkdirSync(distServer, { recursive: true });
    const content = `import server from "./server.js";
import { createLambdaHandler } from "@skyjt/runtime-adapters/aws-lambda";

export const handler = createLambdaHandler(server);
`;
    writeFileSync(join(distServer, "lambda.js"), content, "utf8");
  }
}

/**
 * Vite plugin for automated runtime adapter entrypoint emission upon bundle completion.
 */
export function runtimeAdapter(options?: RuntimeAdapterPluginOptions): Plugin {
  const selectedAdapter = options?.adapter;
  const cwd = options?.cwd;

  return {
    name: "skyjt:runtime-adapters:emitter",
    apply: "build",
    async closeBundle() {
      if (!selectedAdapter) return;
      try {
        await emitRuntimeAdapter(selectedAdapter, cwd);
      } catch (error) {
        console.error("Failed to emit runtime adapter:", error);
      }
    },
  };
}
