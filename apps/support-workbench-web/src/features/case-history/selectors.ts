import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";
import type { CaseRecord, TimelineEvent } from "@shared/types/entities";

export interface CaseHistorySummary {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly caseCount: number;
  readonly openCaseCount: number;
  readonly lastFetchedAt: string | null;
}

const selectCaseSlice = (state: RootState) => state.caseHistory;

export const selectCaseRecords = createSelector([selectCaseSlice], (caseSlice): readonly CaseRecord[] => {
  return caseSlice.caseIds
    .map((id) => caseSlice.casesById[id])
    .filter((caseRecord): caseRecord is CaseRecord => caseRecord !== undefined);
});

export const selectCaseTimeline = createSelector([selectCaseSlice], (caseSlice): readonly TimelineEvent[] => {
  return caseSlice.timelineIds
    .map((id) => caseSlice.timelineById[id])
    .filter((event): event is TimelineEvent => event !== undefined)
    .sort((a, b) => a.serverTs.localeCompare(b.serverTs));
});

export const selectCaseHistorySummary = createSelector([selectCaseSlice, selectCaseRecords], (caseSlice, cases) => {
  return {
    status: caseSlice.status,
    caseCount: cases.length,
    openCaseCount: cases.filter((caseRecord) => caseRecord.status === "open" || caseRecord.status === "pending").length,
    lastFetchedAt: caseSlice.lastFetchedAt
  } satisfies CaseHistorySummary;
});
