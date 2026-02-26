# ADR-0001: Canonical Cross-Channel State via Redux Toolkit

## Context
The workbench requires deterministic synchronization across chat, phone, and case channels with high auditability.

## Decision
Adopt Redux Toolkit + RTK Query as the canonical global state and server-cache layer.

## Consequences
- Predictable race handling and time-travel debugging support.
- Slightly higher baseline runtime overhead than lightweight local stores.
- Stronger cross-pod consistency for long-term maintainability.

## Guardrails
- Keep slices feature-scoped.
- Normalize entities by stable IDs.
- Use idempotent event processing and stale-version rejection.
