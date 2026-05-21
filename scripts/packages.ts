const packages = [
  {
    name: "@skyjtx/signals-solid",
    path: "packages/signals-solid",
  },
  {
    name: "@skyjtx/query-solid",
    path: "packages/query-solid",
  },
  {
    name: "@skyjtx/store-solid",
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

if (!action) {
  usage();
  process.exit(1);
}

const runInOrder = (command: string, args: string[]) => {
  for (const pkg of packages) {
    run(command, args, pkg.path);
  }
};

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
    runInOrder("bunx", ["npm", "publish", "--access", "public"]);
    break;
  default:
    usage();
    process.exit(1);
}
