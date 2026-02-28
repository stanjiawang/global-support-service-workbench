import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { TimelineEventModel } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";

const selectSlice = (state: RootState) => state.agentIntelligence;

export const selectAgentIntelligenceSummary = createSelector([selectSlice], (slice) => {
  return {
    dashboardStatus: slice.dashboardStatus,
    queueCount: slice.queueTickets.length,
    alertCount: slice.alerts.length,
    pendingOperations: Object.keys(slice.pendingStatusOps).length,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectQueueTickets = createSelector([selectSlice], (slice) => {
  return slice.queueTickets.map((ticket) => ({
    ...ticket,
    status: slice.caseStatusById[ticket.ticketId] ?? ticket.status
  }));
});

export const selectCustomerPulse = createSelector([selectSlice], (slice) => slice.customerPulse);
export const selectAlerts = createSelector([selectSlice], (slice) => slice.alerts);
export const selectPendingStatusOps = createSelector([selectSlice], (slice) => slice.pendingStatusOps);
export const selectAiSuggestionByTicket = createSelector([selectSlice], (slice) => slice.aiSuggestionByTicket);
export const selectSummaryGhostByTicket = createSelector([selectSlice], (slice) => slice.summaryGhostByTicket);

interface TimelineGroup {
  label: "Today" | "Yesterday" | "Earlier";
  events: TimelineEventModel[];
}

function dayLabel(now: Date, occurredAt: string): TimelineGroup["label"] {
  const current = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()).getTime();
  const event = new Date(occurredAt);
  const eventDay = new Date(event.getUTCFullYear(), event.getUTCMonth(), event.getUTCDate()).getTime();
  const diff = Math.round((current - eventDay) / 86400000);
  if (diff <= 0) {
    return "Today";
  }
  if (diff === 1) {
    return "Yesterday";
  }
  return "Earlier";
}

export const selectTimelineGroups = createSelector([selectSlice], (slice): TimelineGroup[] => {
  const now = new Date("2026-02-26T23:00:00Z");
  const groups: Record<TimelineGroup["label"], TimelineEventModel[]> = {
    Today: [],
    Yesterday: [],
    Earlier: []
  };

  const ordered = [...slice.timelineEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  for (const event of ordered) {
    groups[dayLabel(now, event.occurredAt)].push(event);
  }

  return [
    { label: "Today", events: groups.Today },
    { label: "Yesterday", events: groups.Yesterday },
    { label: "Earlier", events: groups.Earlier }
  ];
});
