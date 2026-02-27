import { describe, expect, it } from "vitest";
import { createWorkbenchStore } from "@app/providers/store";
import { CustomerIntelligence } from "@features/agent-intelligence-dashboard/CustomerIntelligence";
import { InteractionTimeline } from "@features/agent-intelligence-dashboard/InteractionTimeline";
import { loadAgentIntelligenceDashboard } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";
import { renderWithStore } from "@shared/testing/renderWithStore";

describe("agent intelligence components", () => {
  it("renders customer pulse triage fields in one view", () => {
    const { container, cleanup } = renderWithStore(
      <CustomerIntelligence
        pulse={{
          ticketId: "TKT-1501",
          customerId: "cust-201",
          sentiment: "positive",
          deviceHealth: "healthy",
          urgency: "low",
          riskScore: 22
        }}
      />
    );

    expect(container.textContent).toContain("Customer Pulse");
    expect(container.textContent).toContain("Sentiment");
    expect(container.textContent).toContain("Device Health");
    expect(container.textContent).toContain("Case Urgency");
    expect(container.textContent).toContain("Risk Score");
    cleanup();
  });

  it("renders timeline entries with channel labels and accessible row labels", () => {
    const store = createWorkbenchStore();
    store.dispatch({
      type: loadAgentIntelligenceDashboard.fulfilled.type,
      payload: {
        queueTickets: [],
        customerPulse: null,
        timelineEvents: [
          {
            eventId: "evt-1",
            ticketId: "TKT-1501",
            channel: "chat",
            title: "chat interaction",
            summary: "customer started chat",
            occurredAt: "2026-02-26T10:00:00Z"
          },
          {
            eventId: "evt-2",
            ticketId: "TKT-1501",
            channel: "phone",
            title: "phone call",
            summary: "agent returned call",
            occurredAt: "2026-02-25T10:00:00Z"
          },
          {
            eventId: "evt-3",
            ticketId: "TKT-1501",
            channel: "store_visit",
            title: "store visit",
            summary: "device handed off",
            occurredAt: "2026-02-20T10:00:00Z"
          }
        ],
        alerts: [],
        fetchedAt: "2026-02-26T20:20:00Z"
      }
    });

    const { container, cleanup } = renderWithStore(<InteractionTimeline />, { store });
    expect(container.textContent).toContain("Today");
    expect(container.textContent).toContain("Yesterday");
    expect(container.textContent).toContain("Earlier");
    expect(container.textContent).toContain("Chat");
    expect(container.textContent).toContain("Phone");
    expect(container.textContent).toContain("Store Visit");
    const rowButtons = container.querySelectorAll("button[aria-label]");
    expect(rowButtons.length).toBeGreaterThan(0);
    cleanup();
  });
});
