import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { emitRuntimeAdapter } from "../../src/vite/index";
import { defineRuntimeAdapter } from "../../src/adapters/runtime/custom";
import type { CustomAdapterContext } from "../../src/adapters/runtime/types";

describe("Vite Runtime Adapter Emitter", () => {
  const tempDir = join(process.cwd(), "tests", "runtime-adapters", `.temp-emitter-${Date.now()}`);

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });
  });

  afterAll(() => {
    try {
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {
      // Ignored for Windows file lock delays
    }
  });

  it("emits Cloudflare Pages _worker.js in dist/client", async () => {
    await emitRuntimeAdapter("cloudflare", tempDir);
    const workerPath = join(tempDir, "dist", "client", "_worker.js");
    expect(existsSync(workerPath)).toBe(true);

    const content = readFileSync(workerPath, "utf8");
    expect(content).toContain("env.ASSETS.fetch");
    expect(content).toContain("server.fetch");
  });

  it("emits Bun server entrypoint in dist/server/index.js", async () => {
    await emitRuntimeAdapter("bun", tempDir);
    const bunPath = join(tempDir, "dist", "server", "index.js");
    expect(existsSync(bunPath)).toBe(true);

    const content = readFileSync(bunPath, "utf8");
    expect(content).toContain("Bun.serve");
    expect(content).toContain("Bun.file");
  });

  it("emits Node.js server entrypoint in dist/server/index.js", async () => {
    await emitRuntimeAdapter("node", tempDir);
    const nodePath = join(tempDir, "dist", "server", "index.js");
    expect(existsSync(nodePath)).toBe(true);

    const content = readFileSync(nodePath, "utf8");
    expect(content).toContain("createServer");
    expect(content).toContain("sendWebResponse");
  });

  it("emits Vercel Edge entrypoint in api/index.js", async () => {
    await emitRuntimeAdapter("vercel", tempDir);
    const vercelPath = join(tempDir, "api", "index.js");
    expect(existsSync(vercelPath)).toBe(true);

    const content = readFileSync(vercelPath, "utf8");
    expect(content).toContain('runtime: "edge"');
  });

  it("emits AWS Lambda entrypoint in dist/server/lambda.js", async () => {
    await emitRuntimeAdapter("aws-lambda", tempDir);
    const lambdaPath = join(tempDir, "dist", "server", "lambda.js");
    expect(existsSync(lambdaPath)).toBe(true);

    const content = readFileSync(lambdaPath, "utf8");
    expect(content).toContain("createLambdaHandler");
  });

  it("executes custom inline function adapter with correct context", async () => {
    const fn = vi.fn(async (ctx: CustomAdapterContext) => {
      mkdirSync(ctx.distServer, { recursive: true });
      writeFileSync(join(ctx.distServer, "custom-fn.js"), "// custom fn entry", "utf8");
    });

    await emitRuntimeAdapter(fn, tempDir);

    expect(fn).toHaveBeenCalledTimes(1);
    const callArg = fn.mock.calls[0][0];
    expect(callArg.cwd).toBe(tempDir);
    expect(callArg.distClient).toBe(join(tempDir, "dist", "client"));
    expect(callArg.distServer).toBe(join(tempDir, "dist", "server"));
    expect(callArg.serverEntry).toBe(join(tempDir, "dist", "server", "server.js"));

    const outPath = join(tempDir, "dist", "server", "custom-fn.js");
    expect(existsSync(outPath)).toBe(true);
    expect(readFileSync(outPath, "utf8")).toBe("// custom fn entry");
  });

  it("executes custom object adapter created with defineRuntimeAdapter", async () => {
    const adapter = defineRuntimeAdapter({
      name: "custom-deno",
      emit: async (ctx: CustomAdapterContext) => {
        mkdirSync(ctx.distServer, { recursive: true });
        writeFileSync(join(ctx.distServer, "deno.ts"), "Deno.serve();", "utf8");
      },
    });

    await emitRuntimeAdapter(adapter, tempDir);

    const outPath = join(tempDir, "dist", "server", "deno.ts");
    expect(existsSync(outPath)).toBe(true);
    expect(readFileSync(outPath, "utf8")).toBe("Deno.serve();");
  });
});
