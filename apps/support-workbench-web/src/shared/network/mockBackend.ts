import type { FeatureRoute } from "@app/routing/routes";
import type { CaseRecord, Interaction, TimelineEvent } from "@shared/types/entities";

export interface MockKpi {
  readonly label: string;
  readonly value: string;
}

export interface MockTimelineItem {
  readonly id: string;
  readonly channel: "chat" | "phone" | "case";
  readonly summary: string;
  readonly timestamp: string;
}

export interface MockFeaturePayload {
  readonly featureRoute: FeatureRoute;
  readonly featureName: string;
  readonly ownershipPod: string;
  readonly kpis: readonly MockKpi[];
  readonly timeline: readonly MockTimelineItem[];
}

export interface MockChatSessionSnapshot {
  readonly version: number;
  readonly fetchedAt: string;
  readonly interactions: readonly Interaction[];
  readonly timelineEvents: readonly TimelineEvent[];
}

export interface MockCaseHistorySnapshot {
  readonly version: number;
  readonly fetchedAt: string;
  readonly cases: readonly CaseRecord[];
  readonly timelineEvents: readonly TimelineEvent[];
}

export interface MockPhoneTransportSnapshot {
  readonly queueDepth: number;
  readonly activeCalls: number;
  readonly reconnectAttempts: number;
  readonly fetchedAt: string;
}

function isoAt(hour: number, minute: number, second: number): string {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  const s = String(second).padStart(2, "0");
  return `2026-02-26T${h}:${m}:${s}Z`;
}

function buildFeatureTimeline(prefix: string, channel: "chat" | "phone" | "case"): readonly MockTimelineItem[] {
  return Array.from({ length: 8 }, (_, idx) => {
    const i = idx + 1;
    return {
      id: `${prefix}-${i}`,
      channel,
      summary: `${prefix} update ${i}`,
      timestamp: isoAt(8 + Math.floor(i / 4), (i * 7) % 60, (i * 13) % 60)
    };
  });
}

const FEATURE_PAYLOADS: Record<FeatureRoute, MockFeaturePayload> = {
  "/customer-360": {
    featureRoute: "/customer-360",
    featureName: "customer-360",
    ownershipPod: "pod-customer-intelligence",
    kpis: [
      { label: "Open interactions", value: "37" },
      { label: "Recent cases", value: "54" },
      { label: "Satisfaction trend", value: "+6%" }
    ],
    timeline: buildFeatureTimeline("cust360", "chat")
  },
  "/chat-session": {
    featureRoute: "/chat-session",
    featureName: "chat-session",
    ownershipPod: "pod-realtime-chat",
    kpis: [
      { label: "Active chats", value: "42" },
      { label: "Median response", value: "19s" },
      { label: "Reconnects", value: "2" }
    ],
    timeline: buildFeatureTimeline("chat", "chat")
  },
  "/phone-session": {
    featureRoute: "/phone-session",
    featureName: "phone-session",
    ownershipPod: "pod-voice-support",
    kpis: [
      { label: "Calls waiting", value: "18" },
      { label: "Average handle", value: "6m 42s" },
      { label: "Drop rate", value: "0.4%" }
    ],
    timeline: buildFeatureTimeline("phone", "phone")
  },
  "/case-history": {
    featureRoute: "/case-history",
    featureName: "case-history",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Resolved today", value: "96" },
      { label: "Pending review", value: "23" },
      { label: "Reopen rate", value: "1.3%" }
    ],
    timeline: buildFeatureTimeline("case", "case")
  },
  "/ticket-search": {
    featureRoute: "/ticket-search",
    featureName: "ticket-search",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Indexed tickets", value: "5,420" },
      { label: "Median query latency", value: "142ms" },
      { label: "Saved views", value: "19" }
    ],
    timeline: buildFeatureTimeline("search", "case")
  },
  "/ticket-detail": {
    featureRoute: "/ticket-detail",
    featureName: "ticket-detail",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Open detail sessions", value: "27" },
      { label: "Timeline freshness", value: "99.4%" },
      { label: "Audit events/day", value: "1,184" }
    ],
    timeline: buildFeatureTimeline("detail", "case")
  },
  "/ticket-workspace": {
    featureRoute: "/ticket-workspace",
    featureName: "ticket-workspace",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Saved views used/day", value: "412" },
      { label: "Bulk actions/day", value: "286" },
      { label: "Workspace latency p95", value: "184ms" }
    ],
    timeline: buildFeatureTimeline("workspace", "case")
  },
  "/assignment-routing": {
    featureRoute: "/assignment-routing",
    featureName: "assignment-routing",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Queue auto-routes/day", value: "214" },
      { label: "Manual transfers/day", value: "143" },
      { label: "Routing accuracy", value: "96.1%" }
    ],
    timeline: buildFeatureTimeline("routing", "case")
  },
  "/customer-profile-depth": {
    featureRoute: "/customer-profile-depth",
    featureName: "customer-profile-depth",
    ownershipPod: "pod-customer-intelligence",
    kpis: [
      { label: "Profiles hydrated/day", value: "1,932" },
      { label: "Avg context load", value: "168ms" },
      { label: "Cross-channel joins", value: "98.8%" }
    ],
    timeline: buildFeatureTimeline("profile", "case")
  },
  "/case-editor": {
    featureRoute: "/case-editor",
    featureName: "case-editor",
    ownershipPod: "pod-case-lifecycle",
    kpis: [
      { label: "Drafts open", value: "21" },
      { label: "Avg save latency", value: "88ms" },
      { label: "Validation errors", value: "1" }
    ],
    timeline: buildFeatureTimeline("editor", "case")
  },
  "/knowledge-assist": {
    featureRoute: "/knowledge-assist",
    featureName: "knowledge-assist",
    ownershipPod: "pod-agent-assist",
    kpis: [
      { label: "Suggestions served", value: "312" },
      { label: "Acceptance rate", value: "68%" },
      { label: "Fallback queries", value: "11" }
    ],
    timeline: buildFeatureTimeline("assist", "chat")
  },
  "/agent-presence": {
    featureRoute: "/agent-presence",
    featureName: "agent-presence",
    ownershipPod: "pod-workforce-ops",
    kpis: [
      { label: "Agents online", value: "384" },
      { label: "Break status", value: "37" },
      { label: "Queue SLA", value: "98.7%" }
    ],
    timeline: buildFeatureTimeline("presence", "phone")
  }
};

const CHAT_SNAPSHOT: MockChatSessionSnapshot = {
  version: 14,
  fetchedAt: "2026-02-26T01:20:00Z",
  interactions: Array.from({ length: 36 }, (_, idx) => {
    const i = idx + 1;
    return {
      interactionId: `chat-${900 + i}`,
      customerId: `cust-${100 + ((i % 22) + 1)}`,
      channel: "chat" as const,
      openedAt: isoAt(9 + Math.floor(i / 12), (i * 3) % 60, (i * 5) % 60)
    };
  }),
  timelineEvents: Array.from({ length: 48 }, (_, idx) => {
    const i = idx + 1;
    const interactionId = `chat-${900 + ((i % 36) + 1)}`;
    return {
      eventId: `evt-chat-${i}`,
      entityId: interactionId,
      channel: "chat" as const,
      version: Math.floor(i / 2) + 1,
      serverTs: isoAt(10 + Math.floor(i / 20), (i * 4) % 60, (i * 7) % 60)
    };
  })
};

const CASE_SNAPSHOT: MockCaseHistorySnapshot = {
  version: 18,
  fetchedAt: "2026-02-26T01:20:00Z",
  cases: Array.from({ length: 44 }, (_, idx) => {
    const i = idx + 1;
    const statuses: readonly CaseRecord["status"][] = ["open", "pending", "resolved", "closed"];
    const status = statuses[i % statuses.length] ?? "open";
    return {
      caseId: `case-${200 + i}`,
      customerId: `cust-${100 + ((i % 22) + 1)}`,
      status: status,
      updatedAt: isoAt(8 + Math.floor(i / 15), (i * 5) % 60, (i * 11) % 60)
    };
  }),
  timelineEvents: Array.from({ length: 60 }, (_, idx) => {
    const i = idx + 1;
    const caseId = `case-${200 + ((i % 44) + 1)}`;
    return {
      eventId: `evt-case-${i}`,
      entityId: caseId,
      channel: "case" as const,
      version: Math.floor(i / 3) + 1,
      serverTs: isoAt(9 + Math.floor(i / 20), (i * 6) % 60, (i * 9) % 60)
    };
  })
};

const PHONE_SNAPSHOT: MockPhoneTransportSnapshot = {
  queueDepth: 18,
  activeCalls: 37,
  reconnectAttempts: 4,
  fetchedAt: "2026-02-26T01:20:00Z"
};

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);

    if (!signal) {
      return;
    }

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

export async function fetchMockFeaturePayload(route: FeatureRoute): Promise<MockFeaturePayload> {
  await delay(180);
  return FEATURE_PAYLOADS[route];
}

export async function fetchMockChatSessionSnapshot(signal?: AbortSignal): Promise<MockChatSessionSnapshot> {
  await delay(220, signal);
  return CHAT_SNAPSHOT;
}

export async function fetchMockCaseHistorySnapshot(signal?: AbortSignal): Promise<MockCaseHistorySnapshot> {
  await delay(220, signal);
  return CASE_SNAPSHOT;
}

export async function fetchMockPhoneTransportSnapshot(signal?: AbortSignal): Promise<MockPhoneTransportSnapshot> {
  await delay(180, signal);
  return PHONE_SNAPSHOT;
}
