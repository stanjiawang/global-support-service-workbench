export type CaseStatus = "new" | "open" | "pending" | "resolved" | "closed";
export type Sentiment = "positive" | "neutral" | "negative";
export type DeviceHealth = "healthy" | "warning" | "critical";
export type CaseUrgency = "low" | "med" | "high" | "critical";
export type TimelineChannel = "chat" | "phone" | "store_visit";

export interface CustomerPulseModel {
  ticketId: string;
  customerId: string;
  sentiment: Sentiment;
  deviceHealth: DeviceHealth;
  urgency: CaseUrgency;
  riskScore: number;
}

export interface TimelineEventModel {
  eventId: string;
  ticketId: string;
  channel: TimelineChannel;
  title: string;
  summary: string;
  occurredAt: string;
}

export interface AgentQueueTicket {
  ticketId: string;
  customerId: string;
  status: CaseStatus;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentAlert {
  alertId: string;
  severity: "info" | "warning" | "urgent";
  message: string;
  createdAt: string;
}

export interface AgentIntelligenceSnapshot {
  queueTickets: AgentQueueTicket[];
  customerPulse: CustomerPulseModel;
  timelineEvents: TimelineEventModel[];
  alerts: AgentAlert[];
  fetchedAt: string;
}

export interface CaseStatusUpdateRequest {
  ticketId: string;
  nextStatus: CaseStatus;
}

export interface CaseStatusUpdateResult {
  ticketId: string;
  status: CaseStatus;
  updatedAt: string;
}

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

function iso(day: number, hour: number, minute: number): string {
  return `2026-02-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`;
}

export async function fetchMockAgentIntelligenceSnapshot(signal?: AbortSignal): Promise<AgentIntelligenceSnapshot> {
  await delay(180, signal);

  const queueTickets: AgentQueueTicket[] = Array.from({ length: 20 }, (_, idx) => {
    const i = idx + 1;
    const statuses: CaseStatus[] = ["new", "open", "pending", "resolved", "closed"];
    return {
      ticketId: `TKT-${1500 + i}`,
      customerId: `cust-${200 + (i % 40)}`,
      status: statuses[i % statuses.length] ?? "open",
      subject: `Support request ${i}`,
      createdAt: iso(1 + (i % 20), 8 + (i % 8), (i * 3) % 60),
      updatedAt: iso(6 + (i % 20), 10 + (i % 8), (i * 5) % 60)
    };
  });

  const timelineEvents: TimelineEventModel[] = Array.from({ length: 26 }, (_, idx) => {
    const i = idx + 1;
    const channels: TimelineChannel[] = ["chat", "phone", "store_visit"];
    const channel = channels[i % channels.length] ?? "chat";
    return {
      eventId: `evt-intel-${i}`,
      ticketId: queueTickets[i % queueTickets.length]?.ticketId ?? "TKT-1501",
      channel,
      title: `${channel} interaction`,
      summary: `Interaction summary ${i} across support channels`,
      occurredAt: iso(4 + (i % 22), 9 + (i % 10), (i * 7) % 60)
    };
  });

  return {
    queueTickets,
    customerPulse: {
      ticketId: queueTickets[0]?.ticketId ?? "TKT-1501",
      customerId: queueTickets[0]?.customerId ?? "cust-201",
      sentiment: "neutral",
      deviceHealth: "warning",
      urgency: "high",
      riskScore: 72
    },
    timelineEvents,
    alerts: [
      { alertId: "alert-1", severity: "urgent", message: "SLA risk increased for TKT-1502", createdAt: iso(26, 14, 12) },
      { alertId: "alert-2", severity: "info", message: "New queue ticket assigned", createdAt: iso(26, 14, 10) }
    ],
    fetchedAt: "2026-02-26T20:20:00Z"
  };
}

export async function submitMockCaseStatusUpdate(
  request: CaseStatusUpdateRequest,
  signal?: AbortSignal
): Promise<CaseStatusUpdateResult> {
  await delay(140, signal);

  const numeric = Number(request.ticketId.replace(/\D/g, "")) || 0;
  const deterministicFailure = request.nextStatus === "resolved" && numeric % 7 === 0;
  if (deterministicFailure) {
    throw new Error("Upstream conflict while persisting status update.");
  }

  return {
    ticketId: request.ticketId,
    status: request.nextStatus,
    updatedAt: new Date().toISOString()
  };
}
