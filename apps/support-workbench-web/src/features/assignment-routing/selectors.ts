import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { MockRoutingAgent, MockRoutingQueue } from "@shared/network/mockAssignmentRouting";

const selectSlice = (state: RootState) => state.assignmentRouting;

export const selectAssignmentRoutingSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    queueCount: slice.queueIds.length,
    agentCount: slice.agentIds.length,
    selectedQueueId: slice.selectedQueueId,
    selectedTicketId: slice.selectedTicketId,
    transferCount: slice.transferLog.length,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectRoutingQueues = createSelector([selectSlice], (slice): MockRoutingQueue[] => {
  return slice.queueIds
    .map((id) => slice.queuesById[id])
    .filter((queue): queue is MockRoutingQueue => queue !== undefined);
});

export const selectSelectedQueue = createSelector([selectSlice], (slice): MockRoutingQueue | null => {
  return slice.queuesById[slice.selectedQueueId] ?? null;
});

export const selectQueueTickets = createSelector([selectSelectedQueue], (queue): string[] => {
  return queue?.ticketIds ?? [];
});

export const selectRoutingAgents = createSelector([selectSlice], (slice): MockRoutingAgent[] => {
  return slice.agentIds
    .map((id) => slice.agentsById[id])
    .filter((agent): agent is MockRoutingAgent => agent !== undefined)
    .sort((a, b) => a.activeLoad - b.activeLoad);
});

export const selectTransferLog = createSelector([selectSlice], (slice) => slice.transferLog);
