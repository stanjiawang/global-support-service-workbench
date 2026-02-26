---
name: workbench-network-resilience
description: Enforce resilient real-time transport and low-bandwidth degradation rules for the workbench. Use when implementing networking, polling cadence, transport fallback, preload/preconnect hints, or behavior tied to network quality and tab visibility.
---

# Workbench Network Resilience

Apply strict transport fallback and degradation behavior.

## Mandatory Workflow
1. Read `references/network-resilience-checklist.md`.
2. Confirm fallback chain remains WebSocket -> SSE -> long polling.
3. Confirm adaptive cadence inputs include visibility, activity, and network quality.
4. Confirm graceful degradation preserves case read/write, interaction context, and escalation actions.
5. Confirm changes remain compatible with HTTP/1-safe assumptions.

## Hard Stop Conditions
- Fallback chain altered or incomplete.
- Missing adaptive cadence behavior.
- Core degraded-mode workflows unavailable.
- HTTP/1 compatibility regressions introduced.

## Required Output Format
- Fallback decision table.
- Low-bandwidth behavior checklist.
- Regression risk note.

## Validation Commands
- `rg "websocket|sse|poll|long-poll|preload|preconnect|save-data|downlink|rtt" <repo-root>/apps/support-workbench-web/src`
