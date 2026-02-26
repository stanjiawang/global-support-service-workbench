import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockAgentPresenceSnapshot,
  type AgentStatus,
  type MockAgentPresenceRecord
} from "@shared/network/mockAgentPresence";

interface AgentPresenceState {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly error: string | null;
  readonly agentsById: Record<string, MockAgentPresenceRecord>;
  readonly agentIds: readonly string[];
  readonly queueDepth: number;
  readonly fetchedAt: string | null;
}

const initialState: AgentPresenceState = {
  status: "idle",
  error: null,
  agentsById: {},
  agentIds: [],
  queueDepth: 0,
  fetchedAt: null
};

function recomputeQueueDepth(agentsById: Record<string, MockAgentPresenceRecord>, baselineQueueDepth: number): number {
  const agents = Object.values(agentsById);
  const availableCount = agents.filter((agent) => agent.status === "available").length;
  const busyCount = agents.filter((agent) => agent.status === "busy").length;
  const pressure = Math.max(0, 34 - availableCount);
  const loadFactor = Math.floor(busyCount / 6);
  return Math.max(0, baselineQueueDepth + pressure + loadFactor);
}

export const loadAgentPresenceSnapshot = createAsyncThunk("agentPresence/loadSnapshot", async (_, { signal }) => {
  return fetchMockAgentPresenceSnapshot(signal);
});

const agentPresenceSlice = createSlice({
  name: "agentPresence",
  initialState,
  reducers: {
    setAgentStatus(state, action: PayloadAction<{ agentId: string; status: AgentStatus }>) {
      const existing = state.agentsById[action.payload.agentId];
      if (!existing) {
        return;
      }

      state.agentsById[action.payload.agentId] = {
        ...existing,
        status: action.payload.status,
        activeSessions: action.payload.status === "available" ? Math.max(1, existing.activeSessions) : 0
      };
      state.queueDepth = recomputeQueueDepth(state.agentsById, state.queueDepth);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAgentPresenceSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAgentPresenceSnapshot.fulfilled, (state, action) => {
        const nextById: Record<string, MockAgentPresenceRecord> = {};
        const nextIds: string[] = [];

        for (const agent of action.payload.agents) {
          nextById[agent.agentId] = agent;
          nextIds.push(agent.agentId);
        }

        state.status = "succeeded";
        state.agentsById = nextById;
        state.agentIds = nextIds;
        state.fetchedAt = action.payload.fetchedAt;
        state.queueDepth = recomputeQueueDepth(nextById, action.payload.queueDepth);
      })
      .addCase(loadAgentPresenceSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load agent presence snapshot.";
      });
  }
});

export const { setAgentStatus } = agentPresenceSlice.actions;
export const agentPresenceReducer = agentPresenceSlice.reducer;
