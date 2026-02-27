import { describe, expect, it } from "vitest";
import { ROUTE_DESCRIPTORS, type FeatureRoute } from "@app/routing/routes";

describe("route descriptors UX contract", () => {
  it("provides complete UX metadata for every route", () => {
    expect(ROUTE_DESCRIPTORS.length).toBeGreaterThan(0);

    for (const descriptor of ROUTE_DESCRIPTORS) {
      expect(descriptor.group.length).toBeGreaterThan(0);
      expect(descriptor.intent.length).toBeGreaterThan(0);
      expect(descriptor.primaryAction.label.length).toBeGreaterThan(0);
      expect(descriptor.primaryAction.actionId.length).toBeGreaterThan(0);
      expect(["high", "medium", "low"]).toContain(descriptor.prefetchPriority);
    }
  });

  it("keeps high-priority prefetch on primary case-resolution routes", () => {
    const requiredHighPriority = new Set<FeatureRoute>([
      "/ticket-workspace",
      "/ticket-search",
      "/ticket-detail",
      "/case-editor",
      "/agent-intelligence-dashboard"
    ]);

    const highPriorityRoutes = new Set(
      ROUTE_DESCRIPTORS.filter((descriptor) => descriptor.prefetchPriority === "high").map((descriptor) => descriptor.path)
    );

    for (const route of requiredHighPriority) {
      expect(highPriorityRoutes.has(route)).toBe(true);
    }
  });
});
