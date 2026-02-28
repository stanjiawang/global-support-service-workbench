import { describe, expect, it } from "vitest";
import {
  agentIntelligenceReducer,
  generateAiSummary,
  loadAgentIntelligenceDashboard,
  updateCaseStatusOptimistic
} from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";

describe("agentIntelligenceSlice", () => {
  it("applies optimistic status update and rolls back on matching failed request", () => {
    let state = agentIntelligenceReducer(undefined, { type: "seed" });
    state = agentIntelligenceReducer(state, {
      type: loadAgentIntelligenceDashboard.fulfilled.type,
      payload: {
        queueTickets: [
          {
            ticketId: "TKT-1501",
            customerId: "cust-201",
            status: "open",
            subject: "Support request",
            createdAt: "2026-02-26T10:00:00Z",
            updatedAt: "2026-02-26T10:00:00Z"
          }
        ],
        customerPulse: {
          ticketId: "TKT-1501",
          customerId: "cust-201",
          sentiment: "neutral",
          deviceHealth: "warning",
          urgency: "high",
          riskScore: 72
        },
        timelineEvents: [],
        alerts: [],
        fetchedAt: "2026-02-26T20:20:00Z"
      }
    });

    state = agentIntelligenceReducer(state, {
      type: updateCaseStatusOptimistic.pending.type,
      meta: {
        requestId: "r1",
        arg: { ticketId: "TKT-1501", nextStatus: "resolved" }
      }
    });
    expect(state.caseStatusById["TKT-1501"]).toBe("resolved");

    state = agentIntelligenceReducer(state, {
      type: updateCaseStatusOptimistic.rejected.type,
      meta: {
        requestId: "r1",
        arg: { ticketId: "TKT-1501", nextStatus: "resolved" }
      },
      error: { name: "Error", message: "failed" }
    });
    expect(state.caseStatusById["TKT-1501"]).toBe("open");
    expect(state.alerts[0]?.severity).toBe("urgent");
  });

  it("ignores stale rejected response for superseded optimistic request", () => {
    let state = agentIntelligenceReducer(undefined, { type: "seed" });
    state = agentIntelligenceReducer(state, {
      type: loadAgentIntelligenceDashboard.fulfilled.type,
      payload: {
        queueTickets: [
          {
            ticketId: "TKT-1501",
            customerId: "cust-201",
            status: "open",
            subject: "Support request",
            createdAt: "2026-02-26T10:00:00Z",
            updatedAt: "2026-02-26T10:00:00Z"
          }
        ],
        customerPulse: {
          ticketId: "TKT-1501",
          customerId: "cust-201",
          sentiment: "neutral",
          deviceHealth: "warning",
          urgency: "high",
          riskScore: 72
        },
        timelineEvents: [],
        alerts: [],
        fetchedAt: "2026-02-26T20:20:00Z"
      }
    });

    state = agentIntelligenceReducer(state, {
      type: updateCaseStatusOptimistic.pending.type,
      meta: {
        requestId: "r1",
        arg: { ticketId: "TKT-1501", nextStatus: "pending" }
      }
    });

    state = agentIntelligenceReducer(state, {
      type: updateCaseStatusOptimistic.pending.type,
      meta: {
        requestId: "r2",
        arg: { ticketId: "TKT-1501", nextStatus: "resolved" }
      }
    });

    state = agentIntelligenceReducer(state, {
      type: updateCaseStatusOptimistic.rejected.type,
      meta: {
        requestId: "r1",
        arg: { ticketId: "TKT-1501", nextStatus: "pending" }
      },
      error: { name: "Error", message: "failed" }
    });

    expect(state.caseStatusById["TKT-1501"]).toBe("resolved");
    expect(state.pendingStatusOps["TKT-1501"]?.requestId).toBe("r2");
  });

  it("stores ghost summary text after summary generation", () => {
    let state = agentIntelligenceReducer(undefined, { type: "seed" });
    state = agentIntelligenceReducer(state, {
      type: generateAiSummary.pending.type,
      meta: { requestId: "sum1", arg: { ticketId: "TKT-1501", transcript: "long history" } }
    });
    expect(state.summaryGhostByTicket["TKT-1501"]).toContain("Summarizing");

    state = agentIntelligenceReducer(state, {
      type: generateAiSummary.fulfilled.type,
      payload: { ticketId: "TKT-1501", summary: "Auto-summary: example" }
    });
    expect(state.summaryGhostByTicket["TKT-1501"]).toBe("Auto-summary: example");
  });
});
