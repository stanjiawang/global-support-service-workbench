---
name: workbench-observability-telemetry
description: Enforce client telemetry consistency, privacy safety, and SLO alignment for workbench changes. Use when adding instrumentation, changing telemetry schemas, adding client performance/error metrics, or updating observability behavior and runbooks.
---

# Workbench Observability Telemetry

Require PII-safe telemetry and explicit SLO alignment.

## Mandatory Workflow
1. Read `references/telemetry-checklist.md`.
2. Validate telemetry payload fields against PII-safe schema.
3. Validate redaction and sampling policy presence.
4. Validate SLO mapping for freshness, save success, first action latency, crash-free sessions.
5. Run `scripts/check-telemetry-schema.ts <repo-root>` when telemetry changes are present.

## Hard Stop Conditions
- Raw customer text captured.
- Sensitive fields emitted without redaction.
- No SLO impact mapping for telemetry changes.
- Telemetry schema drift from canonical contracts.

## Required Output Format
- Telemetry event catalog for changed feature.
- SLO impact statement.
- Privacy safety findings.

## Validation Commands
- `node /Users/stan/Work/global-support-service-workbench/skills/workbench-observability-telemetry/scripts/check-telemetry-schema.ts <repo-root>`
- `rg "telemetry|trace|latency|error|web-vitals" <repo-root>/apps/support-workbench-web/src`
