# Acceptance Test Matrix

## Functional Journeys
1. Agent switches between chat, phone, and case views without stale context.
2. Concurrent channel updates resolve deterministically with timeline integrity.
3. Case save and escalation workflows remain available under degraded networking.

## Accessibility Journeys
1. All critical paths are keyboard-operable without pointer input.
2. Screen-reader semantics are available for interactive controls and status announcements.
3. Focus order remains logical through route transitions and modal interactions.

## Reliability and Observability Journeys
1. Real-time reconnect behavior emits telemetry for retries and terminal failures.
2. SLO breaches trigger alert routing and runbook actions.
3. Client performance metrics emit Web Vitals and feature-level latency spans.

## CI Gate Enforcement
1. PRs must pass `typecheck`, `lint`, `test`, `a11y`, and `docs:lint` within `quality-gates`.
2. PRs must pass the `required-gates` aggregator check before merge.
