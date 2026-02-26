import { describe, expect, it } from "vitest";
import { loadReportingDashboards, reportingDashboardsReducer } from "@features/reporting-dashboards/reportingDashboardsSlice";

describe("reportingDashboardsSlice", () => {
  it("loads reporting snapshot", () => {
    let state = reportingDashboardsReducer(undefined, { type: "seed" });
    state = reportingDashboardsReducer(state, {
      type: loadReportingDashboards.fulfilled.type,
      payload: {
        fetchedAt: "2026-02-26T20:15:00Z",
        queueHealth: [],
        agentProductivity: [],
        resolutionTrend: [],
        slaCompliancePct: 98,
        firstResponseMinutesP50: 3.1
      }
    });
    expect(state.status).toBe("ready");
    expect(state.slaCompliancePct).toBe(98);
  });
});
