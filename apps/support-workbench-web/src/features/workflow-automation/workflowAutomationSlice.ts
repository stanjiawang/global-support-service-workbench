import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockWorkflowAutomation,
  type MockAutomationMacro,
  type MockAutomationRule,
  type MockAutomationTemplate,
  type MockAutomationTrigger
} from "@shared/network/mockWorkflowAutomation";

interface WorkflowAutomationState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  triggers: MockAutomationTrigger[];
  macros: MockAutomationMacro[];
  templates: MockAutomationTemplate[];
  rules: MockAutomationRule[];
  fetchedAt: string | null;
}

const initialState: WorkflowAutomationState = {
  status: "idle",
  error: null,
  triggers: [],
  macros: [],
  templates: [],
  rules: [],
  fetchedAt: null
};

export const loadWorkflowAutomation = createAsyncThunk("workflowAutomation/load", async (_, { signal }) => {
  return fetchMockWorkflowAutomation(signal);
});

const workflowAutomationSlice = createSlice({
  name: "workflowAutomation",
  initialState,
  reducers: {
    toggleTrigger(state, action: PayloadAction<string>) {
      state.triggers = state.triggers.map((trigger) =>
        trigger.triggerId === action.payload ? { ...trigger, enabled: !trigger.enabled } : trigger
      );
    },
    toggleRule(state, action: PayloadAction<string>) {
      state.rules = state.rules.map((rule) => (rule.ruleId === action.payload ? { ...rule, enabled: !rule.enabled } : rule));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkflowAutomation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadWorkflowAutomation.fulfilled, (state, action) => {
        state.status = "ready";
        state.triggers = action.payload.triggers;
        state.macros = action.payload.macros;
        state.templates = action.payload.templates;
        state.rules = action.payload.rules;
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadWorkflowAutomation.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load workflow automation.";
      });
  }
});

export const { toggleTrigger, toggleRule } = workflowAutomationSlice.actions;
export const workflowAutomationReducer = workflowAutomationSlice.reducer;
