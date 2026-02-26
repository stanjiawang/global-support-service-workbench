# CI Gate Checklist

## Canonical project references
- /Users/stan/Work/global-support-service-workbench/.github/workflows/ci.yml
- /Users/stan/Work/global-support-service-workbench/docs/tdd/global-support-service-workbench.md
- /Users/stan/Work/global-support-service-workbench/docs/tdd/acceptance-test-matrix.md

## Mandatory checks
- Required gates present: typecheck, lint, test, a11y, docs:lint.
- No merge if required gate fails.
- Architecture-impacting code changes include docs updates.

## Required output checklist
- Gate status summary
- Missing evidence checklist
- Docs update status
