export interface ErrorBoundaryContract {
  readonly capturesRenderFailures: true;
  readonly reportsTelemetryEvent: true;
  readonly providesAccessibleRecoveryPath: true;
}
