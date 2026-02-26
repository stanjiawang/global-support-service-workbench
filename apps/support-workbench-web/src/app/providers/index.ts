export interface ProviderContract {
  readonly name: string;
  readonly requiredIn: "all" | "interactive-only" | "observability-only";
}

export const PROVIDER_CONTRACTS: readonly ProviderContract[] = [
  { name: "ReduxProvider", requiredIn: "all" },
  { name: "TelemetryProvider", requiredIn: "all" },
  { name: "AccessibilityProvider", requiredIn: "all" },
  { name: "RealtimeTransportProvider", requiredIn: "interactive-only" }
];
