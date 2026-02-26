# Global Support & Service Workbench

This repository contains the pre-coding architecture scaffold for a feature-based, pod-scalable CRM workbench.

## Objectives
- Deterministic cross-channel state management via Redux Toolkit.
- Accessible-by-design UI architecture (WCAG 2.1 AA).
- Resilient networking for HTTP/2 primary and HTTP/1 graceful fallback.
- Production-grade observability, telemetry, and quality gates.

## Monorepo Layout
- `apps/support-workbench-web`: Frontend shell and feature modules.
- `packages/*`: Shared contracts, telemetry SDK, design system, lint and TS presets.
- `docs/*`: ADRs, runbooks, and technical design records.

## Standards
- No business logic or user-facing UI behavior should be added in this phase.
- All public interfaces must be typed and documented.
- Feature pods own `apps/support-workbench-web/src/features/<feature-name>`.
