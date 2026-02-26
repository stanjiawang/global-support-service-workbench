export type TelemetryStatus = "ok" | "degraded" | "error";

export interface TelemetryEvent {
  readonly eventName: string;
  readonly sessionId: string;
  readonly traceId: string;
  readonly feature: string;
  readonly latencyMs: number;
  readonly status: TelemetryStatus;
  readonly piiSafe: true;
}

export interface SloContract {
  readonly interactionTimelineFreshnessMs: number;
  readonly caseSaveSuccessRate: number;
  readonly timeToFirstAgentActionMs: number;
  readonly crashFreeSessionRate: number;
}

export const DEFAULT_SLO_CONTRACT: SloContract = {
  interactionTimelineFreshnessMs: 3000,
  caseSaveSuccessRate: 0.995,
  timeToFirstAgentActionMs: 1200,
  crashFreeSessionRate: 0.999
};
