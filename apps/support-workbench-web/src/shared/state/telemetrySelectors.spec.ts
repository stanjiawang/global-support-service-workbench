import { describe, expect, it } from "vitest";
import type { RootState } from "@app/providers/store";
import { selectRecentTelemetry } from "@shared/state/telemetrySelectors";

describe("selectRecentTelemetry", () => {
  it("returns the latest 30 events in descending recorded order", () => {
    const events = Array.from({ length: 40 }, (_, index) => ({
      eventName: `event-${index}`,
      sessionId: "session-1",
      traceId: `trace-${index}`,
      feature: "case-history",
      latencyMs: index,
      status: "ok" as const,
      piiSafe: true as const,
      recordedAt: `2026-02-26T00:00:${String(index).padStart(2, "0")}.000Z`
    }));

    const state = {
      telemetry: {
        sessionId: "session-1",
        events
      }
    } as unknown as RootState;

    const recent = selectRecentTelemetry(state);
    expect(recent).toHaveLength(30);
    expect(recent[0]?.eventName).toBe("event-39");
    expect(recent[29]?.eventName).toBe("event-10");
  });
});
