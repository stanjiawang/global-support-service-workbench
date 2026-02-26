export interface MockRoutingQueue {
  queueId: string;
  name: string;
  requiredSkills: string[];
  ticketIds: string[];
  backlog: number;
}

export interface MockRoutingAgent {
  agentId: string;
  displayName: string;
  skills: string[];
  activeLoad: number;
  maxCapacity: number;
}

export interface MockRoutingSnapshot {
  fetchedAt: string;
  queues: MockRoutingQueue[];
  agents: MockRoutingAgent[];
}

const SKILL_POOL = ["billing", "ios", "mac", "shipping", "warranty", "refund", "vip"] as const;

const QUEUES: MockRoutingQueue[] = [
  {
    queueId: "queue-billing",
    name: "Billing Priority",
    requiredSkills: ["billing", "vip"],
    ticketIds: ["TKT-1201", "TKT-1210", "TKT-1223", "TKT-1251", "TKT-1292"],
    backlog: 38
  },
  {
    queueId: "queue-device",
    name: "Device Support",
    requiredSkills: ["ios", "mac", "warranty"],
    ticketIds: ["TKT-1202", "TKT-1211", "TKT-1244", "TKT-1272", "TKT-1305", "TKT-1330"],
    backlog: 52
  },
  {
    queueId: "queue-fulfillment",
    name: "Fulfillment & Shipping",
    requiredSkills: ["shipping", "refund"],
    ticketIds: ["TKT-1209", "TKT-1234", "TKT-1261", "TKT-1289"],
    backlog: 29
  }
];

const AGENTS: MockRoutingAgent[] = Array.from({ length: 14 }, (_, idx) => {
  const i = idx + 1;
  const skills = [SKILL_POOL[i % SKILL_POOL.length]!, SKILL_POOL[(i + 2) % SKILL_POOL.length]!, SKILL_POOL[(i + 4) % SKILL_POOL.length]!];
  const activeLoad = 2 + (i % 6);
  return {
    agentId: `agent-${100 + i}`,
    displayName: `Agent ${String.fromCharCode(64 + i)}`,
    skills,
    activeLoad,
    maxCapacity: 10
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

export async function fetchMockRoutingSnapshot(signal?: AbortSignal): Promise<MockRoutingSnapshot> {
  await delay(160, signal);
  return {
    fetchedAt: "2026-02-26T19:05:00Z",
    queues: QUEUES,
    agents: AGENTS
  };
}
