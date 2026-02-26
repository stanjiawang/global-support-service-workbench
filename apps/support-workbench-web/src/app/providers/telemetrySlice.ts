import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TelemetryEvent } from "@shared/telemetry/telemetryContract";

export interface TelemetryLogEvent extends TelemetryEvent {
  readonly recordedAt: string;
}

interface TelemetryState {
  readonly sessionId: string;
  readonly events: readonly TelemetryLogEvent[];
}

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const initialState: TelemetryState = {
  sessionId: randomId("session"),
  events: []
};

const telemetrySlice = createSlice({
  name: "telemetry",
  initialState,
  reducers: {
    logTelemetryEvent(state, action: PayloadAction<Omit<TelemetryLogEvent, "sessionId">>) {
      const nextEvent: TelemetryLogEvent = {
        ...action.payload,
        sessionId: state.sessionId
      };

      const nextEvents = [...state.events, nextEvent];
      state.events = nextEvents.slice(-200);
    }
  }
});

export const { logTelemetryEvent } = telemetrySlice.actions;
export const telemetryReducer = telemetrySlice.reducer;
