# Network Resilience Checklist

## Canonical project references
- /Users/stan/Work/global-support-service-workbench/docs/adr/0002-realtime-transport-fallback.md
- /Users/stan/Work/global-support-service-workbench/apps/support-workbench-web/src/shared/network/transportPolicy.ts
- /Users/stan/Work/global-support-service-workbench/docs/tdd/system-architecture-plan.md

## Mandatory checks
- Fallback sequence fixed to WebSocket -> SSE -> long polling.
- Adaptive cadence uses visibility + activity + network quality.
- Graceful degradation preserves core workflows.
- Asset hinting behavior stays explicit for preload/preconnect.

## Required output checklist
- Fallback decision table
- Low-bandwidth checklist
- HTTP/1 compatibility note
