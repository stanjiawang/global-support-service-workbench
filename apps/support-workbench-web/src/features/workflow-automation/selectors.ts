import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

const selectSlice = (state: RootState) => state.workflowAutomation;

export const selectWorkflowAutomationSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    triggerCount: slice.triggers.length,
    enabledTriggers: slice.triggers.filter((item) => item.enabled).length,
    macroCount: slice.macros.length,
    templateCount: slice.templates.length,
    ruleCount: slice.rules.length,
    enabledRules: slice.rules.filter((item) => item.enabled).length,
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectWorkflowTriggers = createSelector([selectSlice], (slice) => slice.triggers);
export const selectWorkflowMacros = createSelector([selectSlice], (slice) => slice.macros);
export const selectWorkflowTemplates = createSelector([selectSlice], (slice) => slice.templates);
export const selectWorkflowRules = createSelector([selectSlice], (slice) => slice.rules);
