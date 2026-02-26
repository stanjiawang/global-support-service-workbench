import { describe, expect, it } from "vitest";
import { logTelemetryEvent, telemetryReducer } from "@app/providers/telemetrySlice";

describe("telemetrySlice", () => {
  it("creates a session id and appends events with session binding", () => {
    const initialState = telemetryReducer(undefined, { type: "init" });

    const nextState = telemetryReducer(
      initialState,
      logTelemetryEvent({
        eventName: "route_change",
        traceId: "trace-1",
        feature: "shell",
        latencyMs: 12,
        status: "ok",
        piiSafe: true,
        recordedAt: "2026-02-26T00:00:00.000Z"
      })
    );

    expect(nextState.sessionId.startsWith("session-")).toBe(true);
    expect(nextState.events).toHaveLength(1);
    expect(nextState.events[0]?.sessionId).toBe(nextState.sessionId);
  });

  it("keeps only the latest 200 events", () => {
    let state = telemetryReducer(undefined, { type: "init" });

    for (let index = 0; index < 205; index += 1) {
      state = telemetryReducer(
        state,
        logTelemetryEvent({
          eventName: `event-${index}`,
          traceId: `trace-${index}`,
          feature: "customer-360",
          latencyMs: index,
          status: "ok",
          piiSafe: true,
          recordedAt: `2026-02-26T00:00:${String(index).padStart(2, "0")}.000Z`
        })
      );
    }

    expect(state.events).toHaveLength(200);
    expect(state.events[0]?.eventName).toBe("event-5");
    expect(state.events[199]?.eventName).toBe("event-204");
  });
});
