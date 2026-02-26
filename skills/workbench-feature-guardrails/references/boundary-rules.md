# Boundary Rules

## Canonical project references
- /Users/stan/Work/global-support-service-workbench/docs/tdd/system-architecture-plan.md
- /Users/stan/Work/global-support-service-workbench/docs/adr/0001-state-management-rtk.md
- /Users/stan/Work/global-support-service-workbench/CODEOWNERS

## Rules
- Never import from one feature folder directly into another feature folder.
- Permit cross-feature reuse only through shared modules/contracts.
- Keep ownership mapping synchronized with feature paths in CODEOWNERS.
- Require ADR note for architecture-impacting changes.

## Required output checklist
- Boundary status
- Allowed/blocked imports
- Ownership alignment status
- ADR update note status
