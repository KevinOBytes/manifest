# AGENTS.md

## Purpose
This repository is a production-ready library of reusable agent artifacts:
- **Personas (Souls)** for role-specific tone, framing, and constraints
- **Skills** for task-specific execution patterns
- **Loaders** in Python and TypeScript for programmatic discovery

## Artifact Contract
1. `souls/<role>/SOULS.md` defines one role persona.
2. `.agents/skills/<skill>/SKILL.md` defines one portable skill.
3. Artifacts are plain Markdown and should be deterministic, auditable, and composable.
4. Skills should avoid hidden chain-of-thought and provide concise, actionable outputs.

## Runtime Selection Guidance
- Start from a soul matching user intent and context.
- Attach 1-3 skills needed for the task.
- Prefer minimal role blending unless user asks for multi-role synthesis.

## Safety & Quality Baselines
- Respect legal and privacy boundaries.
- Avoid unsupported claims; label uncertainty.
- Prefer source-backed, reproducible recommendations.
- Escalate high-risk domains (security, legal, medical, financial) with caveats.
