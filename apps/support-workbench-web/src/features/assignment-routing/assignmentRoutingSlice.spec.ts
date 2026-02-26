import { describe, expect, it } from "vitest";
import {
  assignmentRoutingReducer,
  routeSelectedTicketBySkills,
  setSelectedQueue,
  transferOwnershipToAgent
} from "@features/assignment-routing/assignmentRoutingSlice";

describe("assignmentRoutingSlice", () => {
  it("routes selected ticket using skills strategy", () => {
    let state = assignmentRoutingReducer(undefined, { type: "seed" });
    state = assignmentRoutingReducer(state, {
      type: "assignmentRouting/loadSnapshot/fulfilled",
      payload: {
        fetchedAt: "2026-02-26T19:05:00Z",
        queues: [
          {
            queueId: "queue-1",
            name: "Queue 1",
            requiredSkills: ["billing", "vip"],
            ticketIds: ["TKT-1201"],
            backlog: 1
          }
        ],
        agents: [
          { agentId: "agent-a", displayName: "Agent A", skills: ["billing"], activeLoad: 1, maxCapacity: 10 },
          { agentId: "agent-b", displayName: "Agent B", skills: ["billing", "vip"], activeLoad: 5, maxCapacity: 10 }
        ]
      }
    });
    state = assignmentRoutingReducer(state, routeSelectedTicketBySkills());
    expect(state.transferLog).toHaveLength(1);
    expect(state.transferLog[0]?.toAgentId).toBe("agent-b");
  });

  it("supports manual transfer ownership", () => {
    let state = assignmentRoutingReducer(undefined, { type: "seed" });
    state = assignmentRoutingReducer(state, {
      type: "assignmentRouting/loadSnapshot/fulfilled",
      payload: {
        fetchedAt: "2026-02-26T19:05:00Z",
        queues: [
          {
            queueId: "queue-1",
            name: "Queue 1",
            requiredSkills: ["billing"],
            ticketIds: ["TKT-1201", "TKT-1202"],
            backlog: 2
          }
        ],
        agents: [{ agentId: "agent-a", displayName: "Agent A", skills: ["billing"], activeLoad: 1, maxCapacity: 10 }]
      }
    });
    state = assignmentRoutingReducer(state, setSelectedQueue("queue-1"));
    state = assignmentRoutingReducer(state, transferOwnershipToAgent({ agentId: "agent-a", mode: "manual" }));
    expect(state.transferLog[0]?.ticketId).toBe("TKT-1201");
    expect(state.queuesById["queue-1"]?.ticketIds).toEqual(["TKT-1202"]);
  });
});
