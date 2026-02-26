export interface TelemetrySchema {
  readonly eventName: string;
  readonly sessionId: string;
  readonly traceId: string;
  readonly feature: string;
  readonly latencyMs: number;
  readonly status: "ok" | "degraded" | "error";
  readonly piiSafe: true;
}

export interface RedactionPolicy {
  readonly denyRawTextCapture: true;
  readonly denySensitiveFieldCapture: true;
  readonly samplingRate: number;
}

export const DEFAULT_REDACTION_POLICY: RedactionPolicy = {
  denyRawTextCapture: true,
  denySensitiveFieldCapture: true,
  samplingRate: 0.1
};
