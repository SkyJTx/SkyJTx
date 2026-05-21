const packages = [
  {
    path: "packages/signals-solid",
  },
  {
    path: "packages/query-solid",
  },
  {
    path: "packages/store-solid",
  },
];

type Action = "clean" | "build" | "test" | "pack" | "publish";

const action = process.argv[2] as Action | undefined;

const usage = () => {
  console.log(
    "Usage: bun run scripts/packages.ts <clean|build|test|pack|publish>",
  );
};

const run = (command: string, args: string[], cwd: string) => {
  const label = [command, ...args].join(" ");
  console.log(`\n[packages] ${label} (${cwd})`);
  const result = Bun.spawnSync({
    cmd: [command, ...args],
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
};

const runCapture = (command: string, args: string[], cwd: string) => {
  const result = Bun.spawnSync({
    cmd: [command, ...args],
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    exitCode: result.exitCode ?? 1,
    stdout: result.stdout?.toString() ?? "",
    stderr: result.stderr?.toString() ?? "",
  };
};

const readPackageJson = async (cwd: string) => {
  const text = await Bun.file(`${cwd}/package.json`).text();
  const parsed = JSON.parse(text) as { name?: string; version?: string };
  return {
    name: parsed.name ?? "",
    version: parsed.version ?? "",
  };
};

const npmVersionExists = (name: string, version: string, cwd: string) => {
  const target = `${name}@${version}`;
  const result = runCapture("bunx", ["npm", "view", target, "version"], cwd);
  if (result.exitCode === 0) {
    return true;
  }

  const combined = `${result.stdout}\n${result.stderr}`.toLowerCase();
  if (combined.includes("not found") || combined.includes("404")) {
    return false;
  }

  console.error(`[packages] npm view failed for ${target}`);
  console.error(result.stderr || result.stdout);
  process.exit(1);
};

if (!action) {
  usage();
  process.exit(1);
}

const runInOrder = (command: string, args: string[]) => {
  for (const pkg of packages) {
    run(command, args, pkg.path);
  }
};

const publishIfNeeded = async () => {
  for (const pkg of packages) {
    const { name, version } = await readPackageJson(pkg.path);
    if (!name || !version) {
      console.error(`[packages] Missing name or version in ${pkg.path}`);
      process.exit(1);
    }

    if (npmVersionExists(name, version, pkg.path)) {
      console.log(`[packages] skip ${name}@${version} (already published)`);
      continue;
    }

    run("bunx", ["npm", "publish", "--access", "public"], pkg.path);
  }
};

const main = async () => {
  switch (action) {
    case "clean":
      runInOrder("bun", ["run", "clean"]);
      break;
    case "build":
      runInOrder("bun", ["run", "build"]);
      break;
    case "test":
      runInOrder("bun", ["test"]);
      break;
    case "pack":
      runInOrder("bunx", ["npm", "pack"]);
      break;
    case "publish":
      await publishIfNeeded();
      break;
    default:
      usage();
      process.exit(1);
  }
};

main().catch((error) => {
  console.error("[packages] Unexpected error:", error);
  process.exit(1);
});
