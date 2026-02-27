import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockAgentIntelligenceSnapshot,
  submitMockCaseStatusUpdate,
  type AgentAlert,
  type AgentQueueTicket,
  type CaseStatus,
  type CaseStatusUpdateRequest,
  type CaseStatusUpdateResult,
  type CustomerPulseModel,
  type TimelineChannel,
  type TimelineEventModel
} from "@shared/network/mockAgentIntelligence";
import {
  fetchMockAiSuggestion,
  fetchMockAiSummary,
  type AiSuggestionRequest,
  type AiSuggestionResult,
  type AiSummaryRequest,
  type AiSummaryResult
} from "@shared/network/mockAiInference";

export type { CaseStatus, TimelineChannel, CustomerPulseModel, TimelineEventModel, AiSuggestionRequest, AiSuggestionResult, AiSummaryRequest, AiSummaryResult, CaseStatusUpdateRequest, CaseStatusUpdateResult };

export interface OptimisticStatusOperation {
  requestId: string;
  previousStatus: CaseStatus;
  nextStatus: CaseStatus;
  startedAt: string;
}

interface AgentIntelligenceState {
  dashboardStatus: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  queueTickets: Array<AgentQueueTicket & { isNew?: boolean }>;
  customerPulse: CustomerPulseModel | null;
  timelineEvents: TimelineEventModel[];
  alerts: AgentAlert[];
  caseStatusById: Record<string, CaseStatus>;
  pendingStatusOps: Record<string, OptimisticStatusOperation>;
  aiSuggestionByTicket: Record<string, string>;
  summaryGhostByTicket: Record<string, string>;
  fetchedAt: string | null;
}

const initialState: AgentIntelligenceState = {
  dashboardStatus: "idle",
  error: null,
  queueTickets: [],
  customerPulse: null,
  timelineEvents: [],
  alerts: [],
  caseStatusById: {},
  pendingStatusOps: {},
  aiSuggestionByTicket: {},
  summaryGhostByTicket: {},
  fetchedAt: null
};

export const loadAgentIntelligenceDashboard = createAsyncThunk(
  "agentIntelligence/loadDashboard",
  async (_, { signal }) => fetchMockAgentIntelligenceSnapshot(signal)
);

export const updateCaseStatusOptimistic = createAsyncThunk(
  "agentIntelligence/updateCaseStatus",
  async (request: CaseStatusUpdateRequest, { signal }) => submitMockCaseStatusUpdate(request, signal)
);

export const generateAiSuggestion = createAsyncThunk(
  "agentIntelligence/generateSuggestion",
  async (request: AiSuggestionRequest, { signal }) => fetchMockAiSuggestion(request, signal)
);

export const generateAiSummary = createAsyncThunk(
  "agentIntelligence/generateSummary",
  async (request: AiSummaryRequest, { signal }) => fetchMockAiSummary(request, signal)
);

function nextIncomingId(queueTickets: readonly AgentQueueTicket[]): string {
  const max = queueTickets.reduce((current, ticket) => {
    const numeric = Number(ticket.ticketId.replace(/\D/g, ""));
    return Number.isFinite(numeric) && numeric > current ? numeric : current;
  }, 1600);
  return `TKT-${max + 1}`;
}

const agentIntelligenceSlice = createSlice({
  name: "agentIntelligence",
  initialState,
  reducers: {
    addIncomingQueueTicket(state) {
      const ticketId = nextIncomingId(state.queueTickets);
      const nextTicket: AgentQueueTicket = {
        ticketId,
        customerId: `cust-${200 + (state.queueTickets.length % 40)}`,
        status: "new",
        subject: "Incoming support ticket",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.queueTickets = [{ ...nextTicket, isNew: true }, ...state.queueTickets];
      state.caseStatusById[ticketId] = "new";
      state.alerts = [
        {
          alertId: `alert-${Date.now()}`,
          severity: "info" as const,
          message: `New ticket ${ticketId} entered queue.`,
          createdAt: new Date().toISOString()
        },
        ...state.alerts
      ].slice(0, 20);
    },
    clearTicketEntranceFlag(state, action: PayloadAction<string>) {
      state.queueTickets = state.queueTickets.map((ticket) =>
        ticket.ticketId === action.payload ? { ...ticket, isNew: false } : ticket
      );
    },
    dismissAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((item) => item.alertId !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAgentIntelligenceDashboard.pending, (state) => {
        state.dashboardStatus = "loading";
        state.error = null;
      })
      .addCase(loadAgentIntelligenceDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "ready";
        state.queueTickets = action.payload.queueTickets;
        state.customerPulse = action.payload.customerPulse;
        state.timelineEvents = action.payload.timelineEvents;
        state.alerts = action.payload.alerts;
        state.caseStatusById = action.payload.queueTickets.reduce<Record<string, CaseStatus>>((acc, ticket) => {
          acc[ticket.ticketId] = ticket.status;
          return acc;
        }, {});
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadAgentIntelligenceDashboard.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.dashboardStatus = "idle";
          return;
        }
        state.dashboardStatus = "failed";
        state.error = action.error.message ?? "Unable to load agent intelligence dashboard.";
      })
      .addCase(updateCaseStatusOptimistic.pending, (state, action) => {
        const { ticketId, nextStatus } = action.meta.arg;
        const previousStatus = state.caseStatusById[ticketId] ?? "open";
        state.caseStatusById[ticketId] = nextStatus;
        state.pendingStatusOps[ticketId] = {
          requestId: action.meta.requestId,
          previousStatus,
          nextStatus,
          startedAt: new Date().toISOString()
        };
      })
      .addCase(updateCaseStatusOptimistic.fulfilled, (state, action) => {
        const ticketId = action.payload.ticketId;
        const operation = state.pendingStatusOps[ticketId];
        if (!operation || operation.requestId !== action.meta.requestId) {
          return;
        }
        delete state.pendingStatusOps[ticketId];
      })
      .addCase(updateCaseStatusOptimistic.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          return;
        }

        const ticketId = action.meta.arg.ticketId;
        const operation = state.pendingStatusOps[ticketId];
        if (!operation || operation.requestId !== action.meta.requestId) {
          return;
        }

        state.caseStatusById[ticketId] = operation.previousStatus;
        delete state.pendingStatusOps[ticketId];
        state.alerts = [
          {
            alertId: `alert-${Date.now()}`,
            severity: "urgent" as const,
            message: `Status update for ${ticketId} was rolled back due to an upstream conflict.`,
            createdAt: new Date().toISOString()
          },
          ...state.alerts
        ].slice(0, 20);
      })
      .addCase(generateAiSuggestion.fulfilled, (state, action) => {
        state.aiSuggestionByTicket[action.payload.ticketId] = action.payload.suggestion;
      })
      .addCase(generateAiSummary.pending, (state, action) => {
        state.summaryGhostByTicket[action.meta.arg.ticketId] = "Summarizing case history...";
      })
      .addCase(generateAiSummary.fulfilled, (state, action) => {
        state.summaryGhostByTicket[action.payload.ticketId] = action.payload.summary;
      });
  }
});

export const { addIncomingQueueTicket, clearTicketEntranceFlag, dismissAlert } = agentIntelligenceSlice.actions;
export const agentIntelligenceReducer = agentIntelligenceSlice.reducer;
