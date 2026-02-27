import { describe, expect, it } from "vitest";
import { AgentIntelligenceDashboardPanel } from "@features/agent-intelligence-dashboard/AgentIntelligenceDashboardPanel";
import { loadAgentIntelligenceDashboard } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";
import { createWorkbenchStore } from "@app/providers/store";
import { renderWithStore } from "@shared/testing/renderWithStore";

describe("AgentIntelligenceDashboardPanel accessibility", () => {
  it("renders aria-live regions and keyboard focus ring utility classes", () => {
    const store = createWorkbenchStore();
    store.dispatch({
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
        alerts: [
          { alertId: "a1", severity: "urgent", message: "Immediate escalation", createdAt: "2026-02-26T10:00:00Z" }
        ],
        fetchedAt: "2026-02-26T20:20:00Z"
      }
    });

    const { container, cleanup } = renderWithStore(<AgentIntelligenceDashboardPanel />, { store });
    const assertive = container.querySelector("[aria-live='assertive']");
    const polite = container.querySelector("[aria-live='polite']");
    expect(assertive).not.toBeNull();
    expect(polite).not.toBeNull();

    const focusRingElements = container.querySelectorAll(
      "[class*='focus-visible:ring-2'][class*='focus-visible:ring-offset-2']"
    );
    expect(focusRingElements.length).toBeGreaterThan(0);
    cleanup();
  });
});
