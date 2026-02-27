# Runbook: Feature Owner Map and Escalation

## Purpose
Provide a single escalation map for implementation, incident response, and review routing.

## Pod Ownership by Feature Path
- `apps/support-workbench-web/src/features/` -> `@platform-foundation`
- `apps/support-workbench-web/src/features/customer-360/` -> `@pod-customer-intelligence`
- `apps/support-workbench-web/src/features/agent-intelligence-dashboard/` -> `@pod-customer-intelligence`
- `apps/support-workbench-web/src/features/chat-session/` -> `@pod-realtime-chat`
- `apps/support-workbench-web/src/features/phone-session/` -> `@pod-voice-support`
- `apps/support-workbench-web/src/features/case-history/` -> `@pod-case-lifecycle`
- `apps/support-workbench-web/src/features/case-editor/` -> `@pod-case-lifecycle`
- `apps/support-workbench-web/src/features/knowledge-assist/` -> `@pod-agent-assist`
- `apps/support-workbench-web/src/features/agent-presence/` -> `@pod-workforce-ops`

## Shared and Platform Ownership
- `apps/support-workbench-web/src/app/` -> `@platform-foundation`
- `apps/support-workbench-web/src/platform/` -> `@platform-foundation`
- `apps/support-workbench-web/src/shared/` -> `@platform-foundation`
- `packages/` -> `@platform-foundation`

## Governance Ownership
- `.github/workflows/` -> `@platform-foundation` and `@architecture-board`
- `docs/adr/` -> `@architecture-board`
- `docs/tdd/` -> `@architecture-board`
- `skills/` -> `@architecture-board`

## Escalation Rules
1. If the changed path maps to a pod-owned feature, route first review to that pod.
2. If the change touches `src/shared` or `packages`, require `@platform-foundation` review.
3. If architecture, CI policy, skills, or ADR content changes, require `@architecture-board` review.
4. For cross-feature incidents, page `@platform-foundation` first, then feature pods by impact order.

## Operational Notes
- Keep this map in sync with `CODEOWNERS`.
- Update this file in the same pull request whenever ownership paths are added or changed.
