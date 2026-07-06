import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

export default defineConfig(async (config) => {
  const watching = !!config.watch;

  const parsed_options = preset.parsePresetOptions(
    {
      entries: [
        {
          entry: "src/index.ts",
        },
      ],
    },
    watching
  );

  if (!watching) {
    const package_fields = preset.generatePackageExports(parsed_options);
    await preset.writePackageJson(package_fields);
  }

  return preset.generateTsupOptions(parsed_options).map((options) => ({
    ...options,
    external: [
      ...(options.external || []),
      "solid-js",
    ],
  }));
});
