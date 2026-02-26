export type FeatureRoute =
  | "/customer-360"
  | "/chat-session"
  | "/phone-session"
  | "/case-history"
  | "/case-editor"
  | "/ticket-search"
  | "/ticket-detail"
  | "/ticket-workspace"
  | "/assignment-routing"
  | "/customer-profile-depth"
  | "/communication-logging"
  | "/workflow-automation"
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
  { path: "/assignment-routing", feature: "assignment-routing", ownershipPod: "pod-case-lifecycle" },
  { path: "/customer-profile-depth", feature: "customer-profile-depth", ownershipPod: "pod-customer-intelligence" },
  { path: "/communication-logging", feature: "communication-logging", ownershipPod: "pod-realtime-chat" },
  { path: "/workflow-automation", feature: "workflow-automation", ownershipPod: "pod-case-lifecycle" },
  { path: "/knowledge-assist", feature: "knowledge-assist", ownershipPod: "pod-agent-assist" },
  { path: "/agent-presence", feature: "agent-presence", ownershipPod: "pod-workforce-ops" }
];
