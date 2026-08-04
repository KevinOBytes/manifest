type RequireLike = ((id: string) => unknown) & { main?: unknown };
type ModuleLike = object;
type ProcessLike = { cwd: () => string };

declare const require: RequireLike;
declare const module: ModuleLike;
declare const process: ProcessLike;

export type ArtifactCatalog = {
  soul: string[];
  skills: string[];
};

type DirEntryLike = {
  name: string;
  isDirectory: () => boolean;
};

const fs = require("fs") as {
  readdirSync: (path: string, options: { withFileTypes: boolean }) => DirEntryLike[];
  statSync: (path: string) => { isFile: () => boolean };
};
const path = require("path") as { join: (...parts: string[]) => string };

function collect(parentDir: string, markerFile: string, repoRoot: string): string[] {
  let entries: DirEntryLike[];
  try {
    entries = fs.readdirSync(parentDir, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(parentDir, entry.name))
    .filter((dirPath: string) => {
      const marker = path.join(dirPath, markerFile);
      try {
        return fs.statSync(marker).isFile();
      } catch {
        return false;
      }
    })
    .map((dirPath: string) => path.join(dirPath, markerFile).slice(repoRoot.length).replace(/^[/\\]/, "").replace(/\\/g, "/"));
}

export function discoverArtifacts(repoRoot: string): ArtifactCatalog {
  return {
    soul: collect(path.join(repoRoot, "soul"), "SOUL.md", repoRoot).sort(),
    skills: collect(path.join(repoRoot, ".agents", "skills"), "SKILL.md", repoRoot).sort(),
  };
}

if (require.main === module) {
  const catalog = discoverArtifacts(process.cwd());
  console.log("soul:");
  for (const s of catalog.soul) console.log(`- ${s}`);
  console.log("skills:");
  for (const skill of catalog.skills) console.log(`- ${skill}`);
}
