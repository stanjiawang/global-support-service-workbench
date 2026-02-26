import { describe, expect, it, vi } from "vitest";
import type { AppDispatch } from "@app/providers/store";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";

describe("emitTelemetry", () => {
  it("dispatches telemetry action with defaults", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-26T10:00:00.000Z"));
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.123456789);
    const dispatch = vi.fn() as unknown as AppDispatch;

    emitTelemetry(dispatch, {
      eventName: "state_snapshot",
      feature: "customer-360",
      latencyMs: 27
    });

    expect((dispatch as unknown as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    const [action] = (dispatch as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [
      { type: string; payload: Record<string, unknown> }
    ];
    expect(action.type).toBe("telemetry/logTelemetryEvent");
    expect(action.payload).toMatchObject({
      eventName: "state_snapshot",
      feature: "customer-360",
      latencyMs: 27,
      status: "ok",
      piiSafe: true,
      recordedAt: "2026-02-26T10:00:00.000Z"
    });
    expect(String(action.payload.traceId)).toMatch(/^trace-/);

    randomSpy.mockRestore();
    vi.useRealTimers();
  });
});
