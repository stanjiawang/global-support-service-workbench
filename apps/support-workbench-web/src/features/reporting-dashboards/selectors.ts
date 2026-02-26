import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

const selectSlice = (state: RootState) => state.reportingDashboards;

export const selectReportingSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    queueCount: slice.queueHealth.length,
    agentCount: slice.agentProductivity.length,
    trendPoints: slice.resolutionTrend.length,
    slaCompliancePct: slice.slaCompliancePct,
    firstResponseMinutesP50: slice.firstResponseMinutesP50,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectQueueHealth = createSelector([selectSlice], (slice) => slice.queueHealth);
export const selectAgentProductivity = createSelector([selectSlice], (slice) =>
  [...slice.agentProductivity].sort((a, b) => b.resolvedCount - a.resolvedCount)
);
export const selectResolutionTrend = createSelector([selectSlice], (slice) => slice.resolutionTrend);
