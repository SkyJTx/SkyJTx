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

type Action = "clean" | "build" | "test" | "pack" | "publish" | "bump";

const action = process.argv[2] as Action | undefined;

const usage = () => {
  console.log(
    "Usage: bun run scripts/packages.ts <clean|build|test|pack|publish|bump> [patch|minor|major]",
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

const bumpVersion = (version: string, type: "patch" | "minor" | "major"): string => {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid version format: ${version}`);
  }
  let [major, minor, patch] = parts;
  if (type === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
};

const bumpVersions = async (type: "patch" | "minor" | "major" = "patch") => {
  console.log(`[packages] Bumping package versions (${type})...`);
  const pkgConfigs: { path: string; name: string; oldVersion: string; newVersion: string; json: any }[] = [];

  for (const pkg of packages) {
    const text = await Bun.file(`${pkg.path}/package.json`).text();
    const json = JSON.parse(text);
    const oldVersion = json.version;
    if (!oldVersion) {
      console.error(`[packages] Missing version in ${pkg.path}/package.json`);
      process.exit(1);
    }
    const newVersion = bumpVersion(oldVersion, type);
    pkgConfigs.push({
      path: pkg.path,
      name: json.name,
      oldVersion,
      newVersion,
      json,
    });
  }

  const nameToNewVersion = new Map<string, string>();
  for (const config of pkgConfigs) {
    nameToNewVersion.set(config.name, config.newVersion);
  }

  for (const config of pkgConfigs) {
    config.json.version = config.newVersion;

    if (config.json.dependencies) {
      for (const dep of Object.keys(config.json.dependencies)) {
        if (nameToNewVersion.has(dep)) {
          config.json.dependencies[dep] = `^${nameToNewVersion.get(dep)}`;
        }
      }
    }
    if (config.json.devDependencies) {
      for (const dep of Object.keys(config.json.devDependencies)) {
        if (nameToNewVersion.has(dep)) {
          config.json.devDependencies[dep] = `^${nameToNewVersion.get(dep)}`;
        }
      }
    }
    if (config.json.peerDependencies) {
      for (const dep of Object.keys(config.json.peerDependencies)) {
        if (nameToNewVersion.has(dep)) {
          config.json.peerDependencies[dep] = `^${nameToNewVersion.get(dep)}`;
        }
      }
    }

    const indent = 2;
    await Bun.write(`${config.path}/package.json`, JSON.stringify(config.json, null, indent) + "\n");
    console.log(`[packages] ${config.name}: ${config.oldVersion} -> ${config.newVersion}`);
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
    case "bump": {
      const bumpType = (process.argv[3] || "patch") as "patch" | "minor" | "major";
      if (!["patch", "minor", "major"].includes(bumpType)) {
        console.error(`[packages] Invalid bump type: ${bumpType}`);
        usage();
        process.exit(1);
      }
      await bumpVersions(bumpType);
      break;
    }
    default:
      usage();
      process.exit(1);
  }
};

main().catch((error) => {
  console.error("[packages] Unexpected error:", error);
  process.exit(1);
});
