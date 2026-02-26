# ADR-0002: Hybrid Real-Time Transport with Graceful Degradation

## Context
Global support traffic includes varying network quality and environments with constrained connectivity.

## Decision
Use WebSocket for active interactions, with fallback to SSE and long polling.

## Consequences
- Low latency where available with resilient fallback behavior.
- Additional complexity in transport orchestration and contract testing.

## Guardrails
- Adaptive cadence based on visibility, activity, and network quality.
- Preserve core case and escalation workflows under degraded conditions.
