import type { AppDispatch } from "@app/providers/store";
import { logTelemetryEvent } from "@app/providers/telemetrySlice";
import type { TelemetryStatus } from "@shared/telemetry/telemetryContract";

function traceId(): string {
  return `trace-${Math.random().toString(36).slice(2, 10)}`;
}

export function emitTelemetry(
  dispatch: AppDispatch,
  params: {
    readonly eventName: string;
    readonly feature: string;
    readonly latencyMs: number;
    readonly status?: TelemetryStatus;
  }
): void {
  dispatch(
    logTelemetryEvent({
      eventName: params.eventName,
      traceId: traceId(),
      feature: params.feature,
      latencyMs: params.latencyMs,
      status: params.status ?? "ok",
      piiSafe: true,
      recordedAt: new Date().toISOString()
    })
  );
}
