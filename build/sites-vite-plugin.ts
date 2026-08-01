import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// Packages hosting metadata and migrations after Vite finishes compiling.
export function packageHostingMetadata(): Plugin {
  let root = process.cwd();

  return {
    name: "hosting-metadata",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", "hosting");
      const sitesOutputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, "hosting.config.json");
      const sitesHostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");

      await rm(outputDirectory, { recursive: true, force: true });
      await rm(sitesOutputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });
      await mkdir(sitesOutputDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.config.json"));
      }
      if (await exists(sitesHostingConfig)) {
        await cp(
          sitesHostingConfig,
          resolve(sitesOutputDirectory, "hosting.json"),
        );
      }
      if (await exists(drizzleSource)) {
        await cp(drizzleSource, resolve(outputDirectory, "drizzle"), {
          recursive: true,
        });
        await cp(drizzleSource, resolve(sitesOutputDirectory, "drizzle"), {
          recursive: true,
        });
      }
    },
  };
}
