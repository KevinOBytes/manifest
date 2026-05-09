declare const require: any;
declare const module: any;
declare const process: any;

const { readdirSync, statSync } = require("fs");
const { join } = require("path");

export type ArtifactCatalog = {
  souls: string[];
  skills: string[];
};

function collect(parentDir: string, markerFile: string): string[] {
  const entries: any[] = readdirSync(parentDir, { withFileTypes: true });
  return entries
    .filter((entry: any) => entry.isDirectory())
    .map((entry: any) => join(parentDir, entry.name))
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
