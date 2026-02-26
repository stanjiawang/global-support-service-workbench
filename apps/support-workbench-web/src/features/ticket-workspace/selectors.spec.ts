import { describe, expect, it } from "vitest";
import type { RootState } from "@app/providers/store";
import { selectFilteredSortedTickets, selectTicketWorkspaceSummary } from "@features/ticket-workspace/selectors";
import { setTicketWorkspaceFilters, ticketWorkspaceReducer } from "@features/ticket-workspace/ticketWorkspaceSlice";

function buildState(): RootState {
  let slice = ticketWorkspaceReducer(undefined, { type: "ticketWorkspace/seed" });
  slice = ticketWorkspaceReducer(slice, {
    type: "ticketWorkspace/loadIndex/fulfilled",
    payload: [
      {
        ticketId: "TKT-1201",
        customerId: "cust-101",
        customerEmail: "alice@example.com",
        customerPhone: "+1-408-555-1001",
        status: "open",
        tags: ["billing", "vip"],
        assignee: "agent-ava",
        createdAt: "2026-02-01T09:00:00Z",
        updatedAt: "2026-02-09T09:00:00Z"
      },
      {
        ticketId: "TKT-1202",
        customerId: "cust-102",
        customerEmail: "bob@example.com",
        customerPhone: "+1-408-555-1002",
        status: "pending",
        tags: ["shipping"],
        assignee: "agent-liam",
        createdAt: "2026-02-02T09:00:00Z",
        updatedAt: "2026-02-08T09:00:00Z"
      }
    ]
  });
  slice = ticketWorkspaceReducer(slice, setTicketWorkspaceFilters({ status: "open" }));
  return { ticketWorkspace: slice } as RootState;
}

describe("ticketWorkspace selectors", () => {
  it("returns workspace summary", () => {
    const summary = selectTicketWorkspaceSummary(buildState());
    expect(summary.status).toBe("ready");
    expect(summary.selectedCount).toBe(0);
  });

  it("filters and sorts tickets", () => {
    const rows = selectFilteredSortedTickets(buildState());
    expect(rows).toHaveLength(1);
    expect(rows[0]?.ticketId).toBe("TKT-1201");
  });
});
