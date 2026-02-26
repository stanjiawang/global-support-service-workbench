---
name: workbench-rtk-sync-patterns
description: Enforce deterministic Redux Toolkit and RTK Query synchronization patterns for chat, phone, and case channels. Use when implementing slices, RTK Query endpoints, event reducers, timeline aggregation, request conflict handling, or any cross-channel state update logic.
---

# Workbench RTK Sync Patterns

Use strict RTK patterns for all cross-channel state logic.

## Mandatory Workflow
1. Read `references/rtk-sync-checklist.md`.
2. Ensure entity model compatibility with canonical contracts.
3. Verify stale version rejection and event idempotency paths.
4. Verify request supersession uses `AbortController`.
5. Confirm Zustand scope is local ephemeral UI state only.

## Hard Stop Conditions
- Missing `eventId` idempotency handling.
- Missing stale version rejection.
- Missing request supersession behavior.
- Cross-feature/global state implemented in Zustand.

## Required Output Format
- State update conflict matrix.
- Race-condition test case list.
- Canonical entities coverage map (`Customer`, `Interaction`, `Case`, `TimelineEvent`, `AgentSession`).

## Validation Commands
- `rg "eventId|event_id|version|AbortController" <repo-root>/apps/support-workbench-web/src`
- `rg "zustand|create\(" <repo-root>/apps/support-workbench-web/src`
