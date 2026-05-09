from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ArtifactCatalog:
    souls: list[str]
    skills: list[str]


def discover_artifacts(repo_root: Path) -> ArtifactCatalog:
    souls_root = repo_root / "souls"
    skills_root = repo_root / ".agents" / "skills"

    souls = sorted(
        str(path.parent.relative_to(repo_root))
        for path in souls_root.glob("*/SOULS.md")
        if path.is_file()
    )

    skills = sorted(
        str(path.parent.relative_to(repo_root))
        for path in skills_root.glob("*/SKILL.md")
        if path.is_file()
    )

    return ArtifactCatalog(souls=souls, skills=skills)


if __name__ == "__main__":
    catalog = discover_artifacts(Path(__file__).resolve().parents[1])
    print("souls:")
    for soul in catalog.souls:
        print(f"- {soul}")
    print("skills:")
    for skill in catalog.skills:
        print(f"- {skill}")
