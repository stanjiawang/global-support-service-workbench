import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { MockTranscriptMessage, MockTranscriptThread } from "@shared/network/mockCommunicationLogging";

const selectSlice = (state: RootState) => state.communicationLogging;

export const selectCommunicationSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    threadCount: slice.threadIds.length,
    selectedThreadId: slice.selectedThreadId || "N/A",
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectCommunicationThreads = createSelector([selectSlice], (slice): MockTranscriptThread[] => {
  return slice.threadIds
    .map((id) => slice.threadsById[id])
    .filter((thread): thread is MockTranscriptThread => thread !== undefined)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

export const selectSelectedThreadMessages = createSelector([selectSlice], (slice): MockTranscriptMessage[] => {
  const ids = slice.messageIdsByThread[slice.selectedThreadId] ?? [];
  return ids
    .map((id) => slice.messagesById[id])
    .filter((message): message is MockTranscriptMessage => message !== undefined)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
});
