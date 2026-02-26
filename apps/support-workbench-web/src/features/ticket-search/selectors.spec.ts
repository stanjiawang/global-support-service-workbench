import { describe, expect, it } from "vitest";
import type { RootState } from "@app/providers/store";
import { selectFilteredTickets, selectTicketSearchSummary } from "@features/ticket-search/selectors";
import { setTicketSearchFilters, ticketSearchReducer, type TicketSearchFilters } from "@features/ticket-search/ticketSearchSlice";
import type { MockTicketRecord } from "@shared/network/mockTicketSearch";

function buildState(tickets: readonly MockTicketRecord[], filters?: Partial<TicketSearchFilters>): RootState {
  let slice = ticketSearchReducer(undefined, { type: "ticketSearch/seed" });
  slice = ticketSearchReducer(
    slice,
    {
      type: "ticketSearch/loadIndex/fulfilled",
      payload: tickets
    }
  );
  if (filters) {
    slice = ticketSearchReducer(slice, setTicketSearchFilters(filters));
  }
  return { ticketSearch: slice } as RootState;
}

describe("ticketSearch selectors", () => {
  const dataset: readonly MockTicketRecord[] = [
    {
      ticketId: "TKT-1201",
      customerId: "cust-101",
      customerEmail: "alice@example.com",
      customerPhone: "+1-408-555-1101",
      status: "open",
      tags: ["billing", "vip"],
      assignee: "agent-ava",
      createdAt: "2026-02-01T09:00:00Z",
      updatedAt: "2026-02-07T10:00:00Z"
    },
    {
      ticketId: "TKT-1202",
      customerId: "cust-102",
      customerEmail: "bob@example.com",
      customerPhone: "+1-408-555-1102",
      status: "pending",
      tags: ["shipping"],
      assignee: "agent-liam",
      createdAt: "2026-02-02T09:00:00Z",
      updatedAt: "2026-02-08T10:00:00Z"
    }
  ];

  it("returns summary metrics from slice", () => {
    const summary = selectTicketSearchSummary(buildState(dataset));
    expect(summary.totalTickets).toBe(2);
    expect(summary.status).toBe("ready");
  });

  it("filters tickets by id/customer/tag/assignee/date range", () => {
    const filtered = selectFilteredTickets(
      buildState(dataset, {
        ticketId: "1201",
        customerEmail: "alice",
        tags: ["billing"],
        assignee: "agent-ava",
        dateFrom: "2026-02-07",
        dateTo: "2026-02-07"
      })
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.ticketId).toBe("TKT-1201");
  });
});
