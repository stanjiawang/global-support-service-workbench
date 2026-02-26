## Summary
- What changed:
- Why it changed:

## Scope
- [ ] Feature-local only
- [ ] Shared contract change (`/shared` or `/packages`)
- [ ] Architecture-impacting change (requires ADR/TDD update)

## Required Evidence
- [ ] `pnpm run typecheck` passed
- [ ] `pnpm run lint` passed
- [ ] `pnpm run test` passed
- [ ] `pnpm run a11y` passed
- [ ] `pnpm run docs:lint` passed
- [ ] `required-gates` check passed in GitHub Actions

## Test and A11y Evidence
- Test run output or CI job link:
- A11y run output or CI job link:

## Architecture and Documentation
- [ ] Updated relevant docs in `/docs/tdd` and/or `/docs/adr` if architecture changed
- [ ] No cross-feature imports introduced
- Related docs:
  - `docs/tdd/system-architecture-plan.md`
  - `docs/tdd/implementation-standards.md`
  - `docs/adr/0001-state-management-rtk.md`
  - `docs/adr/0002-realtime-transport-fallback.md`
  - `docs/adr/0003-observability-and-a11y-gates.md`

## Risk and Rollback
- Risk level: low / medium / high
- Rollback plan:
