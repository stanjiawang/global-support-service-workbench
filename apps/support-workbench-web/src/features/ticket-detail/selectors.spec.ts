import { describe, expect, it } from "vitest";
import type { RootState } from "@app/providers/store";
import { selectActiveTicketDetail, selectTicketDetailSummary } from "@features/ticket-detail/selectors";
import { loadTicketDirectory, setSelectedTicketId, ticketDetailReducer } from "@features/ticket-detail/ticketDetailSlice";
import type { MockTicketDetailRecord } from "@shared/network/mockTicketDetail";

function buildDetail(ticketId: string): MockTicketDetailRecord {
  return {
    ticketId,
    customerId: "cust-101",
    status: "open",
    priority: "high",
    assignee: "agent-ava",
    tags: ["billing", "vip"],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-07T10:00:00Z",
    timeline: [],
    notes: [],
    attachments: [],
    slaClocks: [],
    auditTrail: []
  };
}

function buildState(): RootState {
  let slice = ticketDetailReducer(undefined, { type: "ticketDetail/seed" });
  slice = ticketDetailReducer(slice, {
    type: loadTicketDirectory.fulfilled.type,
    payload: ["TKT-1201", "TKT-1202"]
  });
  slice = ticketDetailReducer(slice, {
    type: "ticketDetail/loadDetail/fulfilled",
    payload: buildDetail("TKT-1201")
  });
  slice = ticketDetailReducer(slice, setSelectedTicketId("TKT-1201"));
  return { ticketDetail: slice } as RootState;
}

describe("ticketDetail selectors", () => {
  it("returns ticket detail summary", () => {
    const summary = selectTicketDetailSummary(buildState());
    expect(summary.indexedTickets).toBe(2);
    expect(summary.selectedTicketId).toBe("TKT-1201");
    expect(summary.status).toBe("ready");
  });

  it("returns active ticket detail", () => {
    const active = selectActiveTicketDetail(buildState());
    expect(active?.ticketId).toBe("TKT-1201");
    expect(active?.priority).toBe("high");
  });
});
