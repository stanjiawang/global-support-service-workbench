export type TicketStatus = "new" | "open" | "pending" | "resolved" | "closed";

export interface MockTicketRecord {
  readonly ticketId: string;
  readonly customerId: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly status: TicketStatus;
  readonly tags: string[];
  readonly assignee: string;
  readonly updatedAt: string;
  readonly createdAt: string;
}

const ASSIGNEES = ["agent-ava", "agent-liam", "agent-emma", "agent-noah", "agent-mia"] as const;
const TAGS = ["billing", "shipping", "ios", "mac", "warranty", "vip", "refund", "escalated"] as const;

function iso(day: number, hour: number, minute: number): string {
  const d = String(day).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `2026-02-${d}T${h}:${m}:00Z`;
}

const MOCK_TICKETS: readonly MockTicketRecord[] = Array.from({ length: 180 }, (_, idx) => {
  const i = idx + 1;
  const statusOrder: readonly TicketStatus[] = ["new", "open", "pending", "resolved", "closed"];
  const status = statusOrder[i % statusOrder.length] ?? "open";
  const customerSeq = 100 + ((i % 48) + 1);
  const ticketSeq = 1200 + i;
  const assignee = ASSIGNEES[i % ASSIGNEES.length] ?? "agent-ava";
  const primaryTag = TAGS[i % TAGS.length] ?? "ios";
  const secondaryTag = TAGS[(i + 3) % TAGS.length] ?? "billing";

  return {
    ticketId: `TKT-${ticketSeq}`,
    customerId: `cust-${customerSeq}`,
    customerEmail: `customer${customerSeq}@example.com`,
    customerPhone: `+1-408-555-${String(1000 + (i % 9000)).padStart(4, "0")}`,
    status,
    tags: [primaryTag, secondaryTag],
    assignee,
    createdAt: iso(1 + (i % 20), 8 + (i % 10), (i * 3) % 60),
    updatedAt: iso(6 + (i % 20), 9 + (i % 10), (i * 7) % 60)
  };
});

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

export async function fetchMockTicketSearchIndex(signal?: AbortSignal): Promise<readonly MockTicketRecord[]> {
  await delay(180, signal);
  return MOCK_TICKETS;
}
