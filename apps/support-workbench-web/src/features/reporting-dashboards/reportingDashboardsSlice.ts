import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchMockReportingSnapshot,
  type MockAgentProductivityMetric,
  type MockQueueHealthMetric,
  type MockResolutionTrendPoint
} from "@shared/network/mockReportingDashboards";

interface ReportingDashboardsState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  queueHealth: MockQueueHealthMetric[];
  agentProductivity: MockAgentProductivityMetric[];
  resolutionTrend: MockResolutionTrendPoint[];
  slaCompliancePct: number;
  firstResponseMinutesP50: number;
  fetchedAt: string | null;
}

const initialState: ReportingDashboardsState = {
  status: "idle",
  error: null,
  queueHealth: [],
  agentProductivity: [],
  resolutionTrend: [],
  slaCompliancePct: 0,
  firstResponseMinutesP50: 0,
  fetchedAt: null
};

export const loadReportingDashboards = createAsyncThunk("reportingDashboards/load", async (_, { signal }) => {
  return fetchMockReportingSnapshot(signal);
});

const reportingDashboardsSlice = createSlice({
  name: "reportingDashboards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReportingDashboards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadReportingDashboards.fulfilled, (state, action) => {
        state.status = "ready";
        state.queueHealth = action.payload.queueHealth;
        state.agentProductivity = action.payload.agentProductivity;
        state.resolutionTrend = action.payload.resolutionTrend;
        state.slaCompliancePct = action.payload.slaCompliancePct;
        state.firstResponseMinutesP50 = action.payload.firstResponseMinutesP50;
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadReportingDashboards.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load reporting dashboards.";
      });
  }
});

export const reportingDashboardsReducer = reportingDashboardsSlice.reducer;
