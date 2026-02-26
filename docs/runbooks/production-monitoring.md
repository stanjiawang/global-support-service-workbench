# Runbook: Production Monitoring and Stability

## Signals
- Crash-free session rate
- Timeline freshness latency
- Case save success rate
- Time to first agent action
- Real-time reconnect failure rate

## Triage Workflow
1. Detect alert by feature and region.
2. Correlate frontend telemetry with API latency and error rates.
3. Confirm blast radius via feature flag and release cohort.
4. Roll back or disable impacted feature flag if SLO breach persists.
5. File post-incident action items to ADR and architecture backlog.

## Privacy Constraints
- No raw transcripts or free-text payloads in telemetry.
- Enforce allowlist schemas and redaction middleware before export.
