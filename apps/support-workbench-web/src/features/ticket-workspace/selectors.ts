import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { WorkspaceTicketRecord } from "@features/ticket-workspace/ticketWorkspaceSlice";

const selectTicketWorkspaceSlice = (state: RootState) => state.ticketWorkspace;

export const selectTicketWorkspaceSummary = createSelector([selectTicketWorkspaceSlice], (slice) => {
  return {
    status: slice.status,
    selectedCount: slice.selectedIds.length,
    viewCount: slice.savedViews.length,
    activeViewId: slice.activeViewId,
    error: slice.error
  };
});

export const selectTicketWorkspaceFilters = createSelector([selectTicketWorkspaceSlice], (slice) => slice.filters);
export const selectTicketWorkspaceSort = createSelector([selectTicketWorkspaceSlice], (slice) => {
  return { sortBy: slice.sortBy, sortDirection: slice.sortDirection };
});
export const selectSavedTicketViews = createSelector([selectTicketWorkspaceSlice], (slice) => slice.savedViews);
export const selectSelectedTicketIds = createSelector([selectTicketWorkspaceSlice], (slice) => slice.selectedIds);

const selectAllTickets = createSelector([selectTicketWorkspaceSlice], (slice): WorkspaceTicketRecord[] => {
  return slice.ticketIds
    .map((id) => slice.ticketsById[id])
    .filter((ticket): ticket is WorkspaceTicketRecord => ticket !== undefined);
});

export const selectFilteredSortedTickets = createSelector(
  [selectAllTickets, selectTicketWorkspaceFilters, selectTicketWorkspaceSort],
  (tickets, filters, sort) => {
    const query = filters.query.trim().toLowerCase();
    const filtered = tickets.filter((ticket) => {
      if (query) {
        const matches =
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.customerId.toLowerCase().includes(query) ||
          ticket.customerEmail.toLowerCase().includes(query) ||
          ticket.customerPhone.toLowerCase().includes(query);
        if (!matches) {
          return false;
        }
      }

      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      if (filters.assignee && ticket.assignee.toLowerCase() !== filters.assignee.toLowerCase()) {
        return false;
      }

      if (filters.tags.length > 0) {
        const normalizedTags = ticket.tags.map((tag) => tag.toLowerCase());
        if (!filters.tags.every((tag) => normalizedTags.includes(tag.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });

    const direction = sort.sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.sortBy === "ticketId") {
        return direction * a.ticketId.localeCompare(b.ticketId);
      }
      if (sort.sortBy === "status") {
        return direction * a.status.localeCompare(b.status);
      }
      return direction * a.updatedAt.localeCompare(b.updatedAt);
    });
  }
);
