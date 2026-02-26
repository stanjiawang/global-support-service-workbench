---
name: workbench-a11y-by-design
description: Enforce WCAG 2.1 AA accessibility-by-design rules for component and interaction changes. Use when adding or modifying UI components, keyboard flows, focus behavior, ARIA semantics, or accessibility CI checks.
---

# Workbench A11y by Design

Treat accessibility failures as merge blockers.

## Mandatory Workflow
1. Read `references/a11y-checklist.md`.
2. Verify semantic control usage and reject raw interactive `div` patterns.
3. Verify keyboard-only and focus-order behavior.
4. Verify ARIA authoring pattern coverage.
5. Verify CI includes and passes a11y gates.
6. Run `scripts/check-a11y-gates.sh <repo-root>`.

## Hard Stop Conditions
- Any raw interactive `div` pattern.
- Missing keyboard/focus support in changed interactions.
- Missing ARIA checks.
- Missing required a11y CI gates.

## Required Output Format
- A11y acceptance checklist per changed feature.
- Test evidence mapping (`jest-axe`, `Playwright + axe`).
- Merge-blocking issues list.

## Validation Commands
- `bash /Users/stan/Work/global-support-service-workbench/skills/workbench-a11y-by-design/scripts/check-a11y-gates.sh <repo-root>`
- `rg "onClick" <repo-root>/apps/support-workbench-web/src`
