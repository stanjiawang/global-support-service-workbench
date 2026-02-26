import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { TimelineEvent } from "@shared/types/entities";

export interface WorkbenchAggregateSummary {
  readonly chatStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly caseStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly interactionCount: number;
  readonly caseCount: number;
  readonly openOrPendingCaseCount: number;
  readonly totalProcessedEventCount: number;
  readonly chatLastIngestionOutcome: "accepted" | "rejected-idempotent" | "rejected-stale" | "n/a";
  readonly caseLastIngestionOutcome: "accepted" | "rejected-idempotent" | "rejected-stale" | "n/a";
}

const selectChatSlice = (state: RootState) => state.chatSession;
const selectCaseSlice = (state: RootState) => state.caseHistory;

export const selectWorkbenchAggregateSummary = createSelector([selectChatSlice, selectCaseSlice], (chatSlice, caseSlice) => {
  const openOrPendingCaseCount = caseSlice.caseIds
    .map((id) => caseSlice.casesById[id])
    .filter((caseRecord) => caseRecord !== undefined)
    .filter((caseRecord) => caseRecord.status === "open" || caseRecord.status === "pending").length;

  return {
    chatStatus: chatSlice.status,
    caseStatus: caseSlice.status,
    interactionCount: chatSlice.interactionIds.length,
    caseCount: caseSlice.caseIds.length,
    openOrPendingCaseCount,
    totalProcessedEventCount: chatSlice.processedEventIds.length + caseSlice.processedEventIds.length,
    chatLastIngestionOutcome: chatSlice.lastIngestionOutcome ?? "n/a",
    caseLastIngestionOutcome: caseSlice.lastIngestionOutcome ?? "n/a"
  } satisfies WorkbenchAggregateSummary;
});

export interface UnifiedTimelineItem {
  readonly source: "chat-session" | "case-history";
  readonly event: TimelineEvent;
}

export const selectUnifiedTimeline = createSelector([selectChatSlice, selectCaseSlice], (chatSlice, caseSlice) => {
  const chatTimeline: UnifiedTimelineItem[] = chatSlice.timelineIds
    .map((id) => chatSlice.timelineById[id])
    .filter((event): event is TimelineEvent => event !== undefined)
    .map((event) => ({ source: "chat-session" as const, event }));

  const caseTimeline: UnifiedTimelineItem[] = caseSlice.timelineIds
    .map((id) => caseSlice.timelineById[id])
    .filter((event): event is TimelineEvent => event !== undefined)
    .map((event) => ({ source: "case-history" as const, event }));

  return [...chatTimeline, ...caseTimeline].sort((a, b) => a.event.serverTs.localeCompare(b.event.serverTs));
});
