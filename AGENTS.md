# AGENTS.md instructions for /Users/stan/Work/global-support-service-workbench

## Project Source of Truth
Use only project-local architecture documentation and skills for implementation decisions.

### Required docs
- /Users/stan/Work/global-support-service-workbench/docs/tdd/system-architecture-plan.md
- /Users/stan/Work/global-support-service-workbench/docs/tdd/global-support-service-workbench.md
- /Users/stan/Work/global-support-service-workbench/docs/tdd/acceptance-test-matrix.md
- /Users/stan/Work/global-support-service-workbench/docs/adr/0001-state-management-rtk.md
- /Users/stan/Work/global-support-service-workbench/docs/adr/0002-realtime-transport-fallback.md
- /Users/stan/Work/global-support-service-workbench/docs/adr/0003-observability-and-a11y-gates.md
- /Users/stan/Work/global-support-service-workbench/docs/runbooks/production-monitoring.md

## Local skills to use
Load these skills from this repository path only:
- /Users/stan/Work/global-support-service-workbench/skills/workbench-feature-guardrails/SKILL.md
- /Users/stan/Work/global-support-service-workbench/skills/workbench-rtk-sync-patterns/SKILL.md
- /Users/stan/Work/global-support-service-workbench/skills/workbench-network-resilience/SKILL.md
- /Users/stan/Work/global-support-service-workbench/skills/workbench-a11y-by-design/SKILL.md
- /Users/stan/Work/global-support-service-workbench/skills/workbench-observability-telemetry/SKILL.md
- /Users/stan/Work/global-support-service-workbench/skills/workbench-ci-quality-gates/SKILL.md

## Usage rules
- When a task touches feature boundaries, use `workbench-feature-guardrails` first.
- When a task touches cross-channel state/events, use `workbench-rtk-sync-patterns`.
- When a task touches networking/fallback/polling/realtime behavior, use `workbench-network-resilience`.
- When a task touches UI components or interactions, use `workbench-a11y-by-design`.
- When a task touches instrumentation/metrics/errors/performance telemetry, use `workbench-observability-telemetry`.
- For PR readiness and CI checks, always use `workbench-ci-quality-gates`.

## Guardrail strictness
Treat hard-stop conditions defined in each skill as merge blockers unless explicitly overridden by a documented ADR decision.
