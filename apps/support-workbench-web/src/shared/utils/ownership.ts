export type PodName =
  | "pod-customer-intelligence"
  | "pod-realtime-chat"
  | "pod-voice-support"
  | "pod-case-lifecycle"
  | "pod-agent-assist"
  | "pod-workforce-ops";

export interface FeatureOwnership {
  readonly feature: string;
  readonly pod: PodName;
}
