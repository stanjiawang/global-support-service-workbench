import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { MockTicketDetailRecord } from "@shared/network/mockTicketDetail";

const selectTicketDetailSlice = (state: RootState) => state.ticketDetail;

export const selectTicketDetailSummary = createSelector([selectTicketDetailSlice], (slice) => {
  return {
    status: slice.status,
    selectedTicketId: slice.selectedTicketId,
    indexedTickets: slice.availableTicketIds.length,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectTicketDirectory = createSelector([selectTicketDetailSlice], (slice) => slice.availableTicketIds);

export const selectActiveTicketDetail = createSelector([selectTicketDetailSlice], (slice): MockTicketDetailRecord | null => {
  return slice.detailsById[slice.selectedTicketId] ?? null;
});
