---
name: workbench-ci-quality-gates
description: Enforce strict CI and PR quality gate consistency for the workbench. Use when opening PRs, modifying CI workflows, changing build/test/lint scripts, or reviewing whether required quality gates and documentation updates are present.
---

# Workbench CI Quality Gates

Block merges when required quality evidence is missing.

## Mandatory Workflow
1. Read `references/ci-gate-checklist.md`.
2. Verify required gates exist and are not bypassed: `typecheck`, `lint`, `test`, `a11y`, `docs:lint`.
3. Verify architecture-impacting changes include docs updates.
4. Report gate status and missing evidence checklist.

## Hard Stop Conditions
- Any required gate removed or bypassed.
- PR proceeds with failing required gates.
- Architecture-impacting changes without docs updates.

## Required Output Format
- Gate status summary (`pass`/`fail` by gate).
- Missing evidence checklist.
- Architecture-doc update status.

## Validation Commands
- `rg "typecheck|lint|test|a11y|docs_lint" <repo-root>/.github/workflows/ci.yml`
- `rg "docs/tdd|docs/adr" <repo-root>`
