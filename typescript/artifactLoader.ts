declare const require: any;
declare const module: any;
declare const process: any;

const { readdirSync, statSync } = require("fs");
const { join } = require("path");

export type ArtifactCatalog = {
  souls: string[];
  skills: string[];
};

type DirEntryLike = {
  name: string;
  isDirectory: () => boolean;
};

function collect(parentDir: string, markerFile: string): string[] {
  const entries = readdirSync(parentDir, { withFileTypes: true }) as DirEntryLike[];
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(parentDir, entry.name))
    .filter((dirPath: string) => {
      const marker = join(dirPath, markerFile);
      try {
        return statSync(marker).isFile();
      } catch {
        return false;
      }
    })
    .map((dirPath: string) => dirPath.replace(/\\/g, "/"));
}

export function discoverArtifacts(repoRoot: string): ArtifactCatalog {
  return {
    souls: collect(join(repoRoot, "souls"), "SOULS.md").sort(),
    skills: collect(join(repoRoot, ".agents", "skills"), "SKILL.md").sort(),
  };
}

if (require.main === module) {
  const catalog = discoverArtifacts(process.cwd());
  console.log("souls:");
  for (const soul of catalog.souls) console.log(`- ${soul}`);
  console.log("skills:");
  for (const skill of catalog.skills) console.log(`- ${skill}`);
}
