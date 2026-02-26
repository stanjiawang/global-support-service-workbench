import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { MockTicketRecord } from "@shared/network/mockTicketSearch";

const selectTicketSearchSlice = (state: RootState) => state.ticketSearch;

export const selectTicketSearchSummary = createSelector([selectTicketSearchSlice], (slice) => {
  return {
    status: slice.status,
    totalTickets: slice.ticketIds.length,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectTicketSearchFilters = createSelector([selectTicketSearchSlice], (slice) => slice.filters);

const selectAllTickets = createSelector([selectTicketSearchSlice], (slice): readonly MockTicketRecord[] => {
  return slice.ticketIds
    .map((id) => slice.ticketsById[id])
    .filter((ticket): ticket is MockTicketRecord => ticket !== undefined);
});

export const selectFilteredTickets = createSelector(
  [selectAllTickets, selectTicketSearchFilters],
  (tickets, filters): readonly MockTicketRecord[] => {
    return tickets
      .filter((ticket) => {
        if (filters.ticketId && !ticket.ticketId.toLowerCase().includes(filters.ticketId.toLowerCase())) {
          return false;
        }
        if (filters.customerId && !ticket.customerId.toLowerCase().includes(filters.customerId.toLowerCase())) {
          return false;
        }
        if (filters.customerEmail && !ticket.customerEmail.toLowerCase().includes(filters.customerEmail.toLowerCase())) {
          return false;
        }
        if (filters.customerPhone && !ticket.customerPhone.toLowerCase().includes(filters.customerPhone.toLowerCase())) {
          return false;
        }
        if (filters.status && ticket.status !== filters.status) {
          return false;
        }
        if (filters.assignee && ticket.assignee.toLowerCase() !== filters.assignee.toLowerCase()) {
          return false;
        }
        if (filters.tags.length > 0) {
          const normalized = ticket.tags.map((tag) => tag.toLowerCase());
          const hasAllTags = filters.tags.every((tag) => normalized.includes(tag.toLowerCase()));
          if (!hasAllTags) {
            return false;
          }
        }
        if (filters.dateFrom && ticket.updatedAt < filters.dateFrom) {
          return false;
        }
        if (filters.dateTo && ticket.updatedAt > `${filters.dateTo}T23:59:59Z`) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
);
