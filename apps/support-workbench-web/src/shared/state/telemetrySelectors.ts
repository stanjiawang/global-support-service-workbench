import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

export interface RecentTelemetryEvent {
  readonly recordedAt: string;
  readonly eventName: string;
  readonly feature: string;
  readonly status: string;
  readonly latencyMs: number;
}

const selectTelemetryEvents = (state: RootState) => state.telemetry.events;

export const selectRecentTelemetry = createSelector([selectTelemetryEvents], (events): readonly RecentTelemetryEvent[] => {
  return events
    .slice(-30)
    .map((event) => ({
      recordedAt: event.recordedAt,
      eventName: event.eventName,
      feature: event.feature,
      status: event.status,
      latencyMs: event.latencyMs
    }))
    .reverse();
});
