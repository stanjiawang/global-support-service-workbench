export interface AppBootstrapConfig {
  readonly environment: "development" | "staging" | "production";
  readonly region: string;
  readonly telemetryEnabled: boolean;
}

export const APP_BOOTSTRAP_DEFAULTS: AppBootstrapConfig = {
  environment: "development",
  region: "us",
  telemetryEnabled: true
};
