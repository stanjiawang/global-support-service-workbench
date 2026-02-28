import type { PageIntent, PrimaryAction } from "@shared/ui/contracts";

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
  | "/permissions-rbac"
  | "/knowledge-linkage"
  | "/reporting-dashboards"
  | "/agent-intelligence-dashboard"
  | "/knowledge-assist"
  | "/agent-presence";

export interface RouteDescriptor {
  readonly path: FeatureRoute;
  readonly feature: string;
  readonly ownershipPod: string;
  readonly group: "Queue & Search" | "Case Execution" | "Customer Context" | "Operations & Reporting";
  readonly intent: PageIntent;
  readonly primaryAction: PrimaryAction;
  readonly prefetchPriority: "high" | "medium" | "low";
}

export const ROUTE_DESCRIPTORS: readonly RouteDescriptor[] = [
  {
    path: "/customer-360",
    feature: "customer-360",
    ownershipPod: "pod-customer-intelligence",
    group: "Customer Context",
    intent: "investigation",
    primaryAction: { label: "Refresh customer context", actionId: "customer.refresh" },
    prefetchPriority: "medium"
  },
  {
    path: "/chat-session",
    feature: "chat-session",
    ownershipPod: "pod-realtime-chat",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Sync chat", actionId: "chat.refresh" },
    prefetchPriority: "medium"
  },
  {
    path: "/phone-session",
    feature: "phone-session",
    ownershipPod: "pod-voice-support",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Open voice controls", actionId: "phone.open_controls" },
    prefetchPriority: "low"
  },
  {
    path: "/case-history",
    feature: "case-history",
    ownershipPod: "pod-case-lifecycle",
    group: "Case Execution",
    intent: "investigation",
    primaryAction: { label: "Refresh case history", actionId: "case_history.refresh" },
    prefetchPriority: "medium"
  },
  {
    path: "/case-editor",
    feature: "case-editor",
    ownershipPod: "pod-case-lifecycle",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Save draft", actionId: "case_editor.save" },
    prefetchPriority: "high"
  },
  {
    path: "/ticket-search",
    feature: "ticket-search",
    ownershipPod: "pod-case-lifecycle",
    group: "Queue & Search",
    intent: "triage",
    primaryAction: { label: "Run search", actionId: "ticket_search.execute" },
    prefetchPriority: "high"
  },
  {
    path: "/ticket-detail",
    feature: "ticket-detail",
    ownershipPod: "pod-case-lifecycle",
    group: "Case Execution",
    intent: "investigation",
    primaryAction: { label: "Load ticket", actionId: "ticket_detail.load" },
    prefetchPriority: "high"
  },
  {
    path: "/ticket-workspace",
    feature: "ticket-workspace",
    ownershipPod: "pod-case-lifecycle",
    group: "Queue & Search",
    intent: "triage",
    primaryAction: { label: "Apply bulk action", actionId: "ticket_workspace.bulk_apply" },
    prefetchPriority: "high"
  },
  {
    path: "/assignment-routing",
    feature: "assignment-routing",
    ownershipPod: "pod-case-lifecycle",
    group: "Operations & Reporting",
    intent: "operations",
    primaryAction: { label: "Refresh queues", actionId: "assignment_routing.refresh" },
    prefetchPriority: "low"
  },
  {
    path: "/customer-profile-depth",
    feature: "customer-profile-depth",
    ownershipPod: "pod-customer-intelligence",
    group: "Customer Context",
    intent: "investigation",
    primaryAction: { label: "Load customer profile", actionId: "customer_profile.load" },
    prefetchPriority: "medium"
  },
  {
    path: "/communication-logging",
    feature: "communication-logging",
    ownershipPod: "pod-realtime-chat",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Link communication", actionId: "communication.link" },
    prefetchPriority: "low"
  },
  {
    path: "/workflow-automation",
    feature: "workflow-automation",
    ownershipPod: "pod-case-lifecycle",
    group: "Operations & Reporting",
    intent: "operations",
    primaryAction: { label: "Create automation", actionId: "workflow.create" },
    prefetchPriority: "low"
  },
  {
    path: "/permissions-rbac",
    feature: "permissions-rbac",
    ownershipPod: "pod-platform-governance",
    group: "Operations & Reporting",
    intent: "governance",
    primaryAction: { label: "Review role access", actionId: "rbac.review" },
    prefetchPriority: "low"
  },
  {
    path: "/knowledge-linkage",
    feature: "knowledge-linkage",
    ownershipPod: "pod-agent-assist",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Attach article", actionId: "knowledge.attach" },
    prefetchPriority: "low"
  },
  {
    path: "/reporting-dashboards",
    feature: "reporting-dashboards",
    ownershipPod: "pod-workforce-ops",
    group: "Operations & Reporting",
    intent: "operations",
    primaryAction: { label: "Refresh dashboard", actionId: "reporting.refresh" },
    prefetchPriority: "low"
  },
  {
    path: "/agent-intelligence-dashboard",
    feature: "agent-intelligence-dashboard",
    ownershipPod: "pod-customer-intelligence",
    group: "Customer Context",
    intent: "triage",
    primaryAction: { label: "Simulate incoming ticket", actionId: "agent_intelligence.simulate_ticket" },
    prefetchPriority: "high"
  },
  {
    path: "/knowledge-assist",
    feature: "knowledge-assist",
    ownershipPod: "pod-agent-assist",
    group: "Case Execution",
    intent: "resolution",
    primaryAction: { label: "Generate suggestion", actionId: "knowledge_assist.generate" },
    prefetchPriority: "low"
  },
  {
    path: "/agent-presence",
    feature: "agent-presence",
    ownershipPod: "pod-workforce-ops",
    group: "Operations & Reporting",
    intent: "operations",
    primaryAction: { label: "Update presence", actionId: "agent_presence.update" },
    prefetchPriority: "low"
  },
];
