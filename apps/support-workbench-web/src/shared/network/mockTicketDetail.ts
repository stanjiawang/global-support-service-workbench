export type TicketDetailStatus = "new" | "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface MockTicketTimelineEntry {
  entryId: string;
  channel: "chat" | "phone" | "email" | "case";
  action: string;
  actor: string;
  timestamp: string;
  summary: string;
}

export interface MockTicketNote {
  noteId: string;
  author: string;
  body: string;
  createdAt: string;
  visibility: "internal" | "customer-visible";
}

export interface MockTicketAttachment {
  attachmentId: string;
  fileName: string;
  mimeType: string;
  sizeKb: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface MockTicketSlaClock {
  clockId: string;
  label: string;
  targetAt: string;
  remainingMinutes: number;
  status: "healthy" | "at-risk" | "breached";
}

export interface MockTicketAuditEvent {
  eventId: string;
  field: string;
  fromValue: string;
  toValue: string;
  actor: string;
  changedAt: string;
  reason: string;
}

export interface MockTicketDetailRecord {
  ticketId: string;
  customerId: string;
  status: TicketDetailStatus;
  priority: TicketPriority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  timeline: MockTicketTimelineEntry[];
  notes: MockTicketNote[];
  attachments: MockTicketAttachment[];
  slaClocks: MockTicketSlaClock[];
  auditTrail: MockTicketAuditEvent[];
}

const AGENTS = ["agent-ava", "agent-liam", "agent-emma", "agent-noah", "agent-mia"] as const;
const TAGS = ["billing", "shipping", "ios", "mac", "warranty", "vip", "refund", "escalated"] as const;
const STATUSES: TicketDetailStatus[] = ["new", "open", "pending", "resolved", "closed"];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "critical"];

function iso(day: number, hour: number, minute: number): string {
  const d = String(day).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `2026-02-${d}T${h}:${m}:00Z`;
}

function buildTimeline(ticketId: string, seed: number): MockTicketTimelineEntry[] {
  const channels: MockTicketTimelineEntry["channel"][] = ["chat", "phone", "email", "case"];
  return Array.from({ length: 14 }, (_, idx) => {
    const i = idx + 1;
    const channel = channels[(seed + i) % channels.length] ?? "case";
    return {
      entryId: `${ticketId}-tl-${i}`,
      channel,
      action: `event-${i}`,
      actor: AGENTS[(seed + i) % AGENTS.length] ?? "agent-ava",
      timestamp: iso(4 + ((seed + i) % 20), 8 + ((seed + i) % 10), (seed * 7 + i * 3) % 60),
      summary: `${channel} interaction update ${i}`
    };
  });
}

function buildNotes(ticketId: string, seed: number): MockTicketNote[] {
  return Array.from({ length: 6 }, (_, idx) => {
    const i = idx + 1;
    return {
      noteId: `${ticketId}-note-${i}`,
      author: AGENTS[(seed + i) % AGENTS.length] ?? "agent-ava",
      body: `Case note ${i} for ${ticketId}: verified customer context and next action.`,
      createdAt: iso(5 + ((seed + i) % 20), 9 + ((seed + i) % 10), (seed + i * 11) % 60),
      visibility: i % 3 === 0 ? "customer-visible" : "internal"
    };
  });
}

function buildAttachments(ticketId: string, seed: number): MockTicketAttachment[] {
  return Array.from({ length: 4 }, (_, idx) => {
    const i = idx + 1;
    return {
      attachmentId: `${ticketId}-att-${i}`,
      fileName: `artifact-${i}-${ticketId}.pdf`,
      mimeType: "application/pdf",
      sizeKb: 80 + ((seed + i) % 420),
      uploadedAt: iso(6 + ((seed + i) % 20), 10 + ((seed + i) % 9), (seed + i * 5) % 60),
      uploadedBy: AGENTS[(seed + i) % AGENTS.length] ?? "agent-ava"
    };
  });
}

function buildSlaClocks(ticketId: string, seed: number): MockTicketSlaClock[] {
  const responseRemaining = 180 - (seed % 230);
  const resolutionRemaining = 720 - (seed % 850);
  const escalationRemaining = 90 - (seed % 180);
  const toStatus = (remaining: number): MockTicketSlaClock["status"] => {
    if (remaining < 0) {
      return "breached";
    }
    if (remaining < 45) {
      return "at-risk";
    }
    return "healthy";
  };

  return [
    {
      clockId: `${ticketId}-sla-first-response`,
      label: "First response",
      targetAt: iso(9 + (seed % 10), 16, 0),
      remainingMinutes: responseRemaining,
      status: toStatus(responseRemaining)
    },
    {
      clockId: `${ticketId}-sla-resolution`,
      label: "Resolution",
      targetAt: iso(10 + (seed % 10), 18, 0),
      remainingMinutes: resolutionRemaining,
      status: toStatus(resolutionRemaining)
    },
    {
      clockId: `${ticketId}-sla-escalation`,
      label: "Escalation response",
      targetAt: iso(8 + (seed % 10), 14, 0),
      remainingMinutes: escalationRemaining,
      status: toStatus(escalationRemaining)
    }
  ];
}

function buildAuditTrail(ticketId: string, seed: number): MockTicketAuditEvent[] {
  const fields = ["status", "assignee", "priority", "tags", "queue", "slaTarget"];
  return Array.from({ length: 10 }, (_, idx) => {
    const i = idx + 1;
    const field = fields[(seed + i) % fields.length] ?? "status";
    return {
      eventId: `${ticketId}-audit-${i}`,
      field,
      fromValue: `${field}-prev-${i}`,
      toValue: `${field}-next-${i}`,
      actor: AGENTS[(seed + i) % AGENTS.length] ?? "agent-ava",
      changedAt: iso(7 + ((seed + i) % 20), 11 + ((seed + i) % 8), (seed + i * 9) % 60),
      reason: `policy-update-${(seed + i) % 4}`
    };
  });
}

const DIRECTORY = Array.from({ length: 260 }, (_, idx) => {
  const seq = 1201 + idx;
  return `TKT-${seq}`;
});

const DETAIL_MAP: Record<string, MockTicketDetailRecord> = DIRECTORY.reduce<Record<string, MockTicketDetailRecord>>(
  (acc, ticketId, idx) => {
    const seed = idx + 1;
    const customerSeq = 100 + ((seed % 60) + 1);
    acc[ticketId] = {
      ticketId,
      customerId: `cust-${customerSeq}`,
      status: STATUSES[seed % STATUSES.length] ?? "open",
      priority: PRIORITIES[seed % PRIORITIES.length] ?? "medium",
      assignee: AGENTS[seed % AGENTS.length] ?? "agent-ava",
      tags: [TAGS[seed % TAGS.length] ?? "ios", TAGS[(seed + 3) % TAGS.length] ?? "billing"],
      createdAt: iso(1 + (seed % 20), 8 + (seed % 10), (seed * 2) % 60),
      updatedAt: iso(6 + (seed % 20), 9 + (seed % 10), (seed * 5) % 60),
      timeline: buildTimeline(ticketId, seed),
      notes: buildNotes(ticketId, seed),
      attachments: buildAttachments(ticketId, seed),
      slaClocks: buildSlaClocks(ticketId, seed),
      auditTrail: buildAuditTrail(ticketId, seed)
    };
    return acc;
  },
  {}
);

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

export async function fetchMockTicketDirectory(signal?: AbortSignal): Promise<string[]> {
  await delay(120, signal);
  return DIRECTORY;
}

export async function fetchMockTicketDetail(ticketId: string, signal?: AbortSignal): Promise<MockTicketDetailRecord> {
  await delay(180, signal);
  return DETAIL_MAP[ticketId] ?? DETAIL_MAP["TKT-1201"]!;
}
