export type FeatureRoute =
  | "/customer-360"
  | "/chat-session"
  | "/phone-session"
  | "/case-history"
  | "/case-editor"
  | "/ticket-search"
  | "/ticket-detail"
  | "/ticket-workspace"
  | "/knowledge-assist"
  | "/agent-presence";

export interface RouteDescriptor {
  readonly path: FeatureRoute;
  readonly feature: string;
  readonly ownershipPod: string;
}

export const ROUTE_DESCRIPTORS: readonly RouteDescriptor[] = [
  { path: "/customer-360", feature: "customer-360", ownershipPod: "pod-customer-intelligence" },
  { path: "/chat-session", feature: "chat-session", ownershipPod: "pod-realtime-chat" },
  { path: "/phone-session", feature: "phone-session", ownershipPod: "pod-voice-support" },
  { path: "/case-history", feature: "case-history", ownershipPod: "pod-case-lifecycle" },
  { path: "/case-editor", feature: "case-editor", ownershipPod: "pod-case-lifecycle" },
  { path: "/ticket-search", feature: "ticket-search", ownershipPod: "pod-case-lifecycle" },
  { path: "/ticket-detail", feature: "ticket-detail", ownershipPod: "pod-case-lifecycle" },
  { path: "/ticket-workspace", feature: "ticket-workspace", ownershipPod: "pod-case-lifecycle" },
  { path: "/knowledge-assist", feature: "knowledge-assist", ownershipPod: "pod-agent-assist" },
  { path: "/agent-presence", feature: "agent-presence", ownershipPod: "pod-workforce-ops" }
];
