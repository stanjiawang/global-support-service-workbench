# RTK Sync Checklist

## Canonical project references
- /Users/stan/Work/global-support-service-workbench/apps/support-workbench-web/src/shared/state/crossChannelState.ts
- /Users/stan/Work/global-support-service-workbench/packages/api-contracts/src/index.ts
- /Users/stan/Work/global-support-service-workbench/docs/adr/0001-state-management-rtk.md

## Mandatory checks
- Entity normalization by stable IDs.
- Event idempotency by `eventId`.
- Stale update rejection by version.
- Request supersession via `AbortController`.
- Zustand usage restricted to local UI transient state.

## Required output checklist
- Conflict matrix
- Race test cases
- Entity coverage map
