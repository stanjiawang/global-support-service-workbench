import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockRoutingSnapshot, type MockRoutingAgent, type MockRoutingQueue } from "@shared/network/mockAssignmentRouting";

export interface RoutingTransferRecord {
  ticketId: string;
  fromQueueId: string;
  toAgentId: string;
  mode: "manual" | "skills";
  transferredAt: string;
}

interface AssignmentRoutingState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  queuesById: Record<string, MockRoutingQueue>;
  queueIds: string[];
  agentsById: Record<string, MockRoutingAgent>;
  agentIds: string[];
  selectedQueueId: string;
  selectedTicketId: string;
  transferLog: RoutingTransferRecord[];
  fetchedAt: string | null;
}

const initialState: AssignmentRoutingState = {
  status: "idle",
  error: null,
  queuesById: {},
  queueIds: [],
  agentsById: {},
  agentIds: [],
  selectedQueueId: "queue-billing",
  selectedTicketId: "",
  transferLog: [],
  fetchedAt: null
};

export const loadRoutingSnapshot = createAsyncThunk("assignmentRouting/loadSnapshot", async (_, { signal }) => {
  return fetchMockRoutingSnapshot(signal);
});

function bestAgentForSkills(agents: readonly MockRoutingAgent[], requiredSkills: readonly string[]): MockRoutingAgent | null {
  const scored = agents.map((agent) => {
    const skillHits = requiredSkills.filter((skill) => agent.skills.includes(skill)).length;
    const capacityLeft = Math.max(0, agent.maxCapacity - agent.activeLoad);
    const score = skillHits * 100 + capacityLeft;
    return { agent, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.agent ?? null;
}

const assignmentRoutingSlice = createSlice({
  name: "assignmentRouting",
  initialState,
  reducers: {
    setSelectedQueue(state, action: PayloadAction<string>) {
      state.selectedQueueId = action.payload;
      const queue = state.queuesById[action.payload];
      state.selectedTicketId = queue?.ticketIds[0] ?? "";
    },
    setSelectedTicketId(state, action: PayloadAction<string>) {
      state.selectedTicketId = action.payload;
    },
    transferOwnershipToAgent(state, action: PayloadAction<{ agentId: string; mode: "manual" | "skills" }>) {
      const queue = state.queuesById[state.selectedQueueId];
      const ticketId = state.selectedTicketId;
      const agent = state.agentsById[action.payload.agentId];
      if (!queue || !ticketId || !agent) {
        return;
      }

      queue.ticketIds = queue.ticketIds.filter((id) => id !== ticketId);
      queue.backlog = Math.max(0, queue.backlog - 1);
      agent.activeLoad += 1;
      state.transferLog = [
        {
          ticketId,
          fromQueueId: queue.queueId,
          toAgentId: agent.agentId,
          mode: action.payload.mode,
          transferredAt: new Date().toISOString()
        },
        ...state.transferLog
      ];
      state.selectedTicketId = queue.ticketIds[0] ?? "";
    },
    routeSelectedTicketBySkills(state) {
      const queue = state.queuesById[state.selectedQueueId];
      if (!queue || !state.selectedTicketId) {
        return;
      }
      const agents = state.agentIds
        .map((id) => state.agentsById[id])
        .filter((agent): agent is MockRoutingAgent => agent !== undefined);
      const best = bestAgentForSkills(agents, queue.requiredSkills);
      if (!best) {
        return;
      }
      assignmentRoutingSlice.caseReducers.transferOwnershipToAgent(state, {
        type: "assignmentRouting/transferOwnershipToAgent",
        payload: { agentId: best.agentId, mode: "skills" }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRoutingSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadRoutingSnapshot.fulfilled, (state, action) => {
        const queuesById: Record<string, MockRoutingQueue> = {};
        const queueIds: string[] = [];
        for (const queue of action.payload.queues) {
          queuesById[queue.queueId] = { ...queue, ticketIds: [...queue.ticketIds] };
          queueIds.push(queue.queueId);
        }

        const agentsById: Record<string, MockRoutingAgent> = {};
        const agentIds: string[] = [];
        for (const agent of action.payload.agents) {
          agentsById[agent.agentId] = { ...agent, skills: [...agent.skills] };
          agentIds.push(agent.agentId);
        }

        const firstQueueId = queueIds[0] ?? "";

        state.status = "ready";
        state.queuesById = queuesById;
        state.queueIds = queueIds;
        state.agentsById = agentsById;
        state.agentIds = agentIds;
        state.selectedQueueId = firstQueueId;
        state.selectedTicketId = queuesById[firstQueueId]?.ticketIds[0] ?? "";
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadRoutingSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load assignment routing snapshot.";
      });
  }
});

export const { setSelectedQueue, setSelectedTicketId, transferOwnershipToAgent, routeSelectedTicketBySkills } =
  assignmentRoutingSlice.actions;
export const assignmentRoutingReducer = assignmentRoutingSlice.reducer;
