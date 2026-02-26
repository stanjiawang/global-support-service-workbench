---
name: workbench-feature-guardrails
description: Enforce feature boundary and ownership consistency for the Global Support & Service Workbench. Use when adding or changing files in apps/support-workbench-web/src/features/*, introducing shared abstractions, moving code across feature/shared/platform layers, or preparing PRs that may affect architecture ownership.
---

# Workbench Feature Guardrails

Use strict boundary checks for all feature-scope implementation work.

## Required Inputs
- Repository root path.
- Changed file list or PR diff scope.

## Mandatory Workflow
1. Read references in `references/boundary-rules.md`.
2. Run `scripts/check-boundaries.sh <repo-root>`.
3. Verify ownership alignment against `CODEOWNERS` and route ownership artifacts.
4. If architecture-impacting changes exist, require ADR update note in PR summary.

## Hard Stop Conditions
- Any feature imports another feature directly.
- Ownership mappings in `CODEOWNERS` are inconsistent with changed feature paths.
- Architecture-impacting change has no ADR update note.

## Required Output Format
- Boundary check summary:
  - `pass` or `fail`
  - violating files and import statements
- Allowed/blocked import paths decision list.
- ADR note requirement status.

## Validation Commands
- `bash /Users/stan/Work/global-support-service-workbench/skills/workbench-feature-guardrails/scripts/check-boundaries.sh <repo-root>`
- `rg "^/apps/support-workbench-web/src/features/" <repo-root>/CODEOWNERS`
