import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { Interaction, TimelineEvent } from "@shared/types/entities";

export interface ChatSessionSummary {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly interactionCount: number;
  readonly latestEventVersion: number;
  readonly lastFetchedAt: string | null;
}

const selectChatSlice = (state: RootState) => state.chatSession;

export const selectChatTimeline = createSelector([selectChatSlice], (chatSlice): readonly TimelineEvent[] => {
  return chatSlice.timelineIds
    .map((id) => chatSlice.timelineById[id])
    .filter((event): event is TimelineEvent => event !== undefined)
    .sort((a, b) => a.serverTs.localeCompare(b.serverTs));
});

export const selectChatInteractions = createSelector([selectChatSlice], (chatSlice): readonly Interaction[] => {
  return chatSlice.interactionIds
    .map((id) => chatSlice.interactionsById[id])
    .filter((interaction): interaction is Interaction => interaction !== undefined);
});

export const selectChatSessionSummary = createSelector([selectChatSlice, selectChatTimeline], (chatSlice, timeline) => {
  const latestEventVersion = timeline.reduce((max, event) => Math.max(max, event.version), 0);

  return {
    status: chatSlice.status,
    interactionCount: chatSlice.interactionIds.length,
    latestEventVersion,
    lastFetchedAt: chatSlice.lastFetchedAt
  } satisfies ChatSessionSummary;
});
