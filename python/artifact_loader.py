from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ArtifactCatalog:
    soul: list[str]
    skills: list[str]


def discover_artifacts(repo_root: Path) -> ArtifactCatalog:
    soul_root = repo_root / "soul"
    skills_root = repo_root / ".agents" / "skills"

    soul = sorted(
        str(path.parent.relative_to(repo_root))
        for path in soul_root.glob("*/SOUL.md")
        if path.is_file()
    )

    skills = sorted(
        str(path.parent.relative_to(repo_root))
        for path in skills_root.glob("*/SKILL.md")
        if path.is_file()
    )

    return ArtifactCatalog(soul=soul, skills=skills)


if __name__ == "__main__":
    # Script lives in <repo>/python, so parent[1] is repository root.
    catalog = discover_artifacts(Path(__file__).resolve().parents[1])
    print("soul:")
    for s in catalog.soul:
        print(f"- {s}")
    print("skills:")
    for skill in catalog.skills:
        print(f"- {skill}")
