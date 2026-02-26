export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly telemetryBaseUrl: string;
  readonly websocketBaseUrl: string;
  readonly environment: "development" | "staging" | "production";
}
