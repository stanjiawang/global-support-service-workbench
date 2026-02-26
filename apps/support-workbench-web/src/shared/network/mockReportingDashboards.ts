export interface MockQueueHealthMetric {
  queueId: string;
  queueName: string;
  backlog: number;
  avgWaitSeconds: number;
  slaAtRisk: number;
}

export interface MockAgentProductivityMetric {
  agentId: string;
  resolvedCount: number;
  avgHandleMinutes: number;
  csat: number;
}

export interface MockResolutionTrendPoint {
  day: string;
  resolved: number;
  reopened: number;
}

export interface MockReportingSnapshot {
  fetchedAt: string;
  queueHealth: MockQueueHealthMetric[];
  agentProductivity: MockAgentProductivityMetric[];
  resolutionTrend: MockResolutionTrendPoint[];
  slaCompliancePct: number;
  firstResponseMinutesP50: number;
}

export async function fetchMockReportingSnapshot(signal?: AbortSignal): Promise<MockReportingSnapshot> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 160);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

  return {
    fetchedAt: "2026-02-26T20:15:00Z",
    queueHealth: [
      { queueId: "q-billing", queueName: "Billing Priority", backlog: 38, avgWaitSeconds: 92, slaAtRisk: 6 },
      { queueId: "q-device", queueName: "Device Support", backlog: 52, avgWaitSeconds: 118, slaAtRisk: 11 },
      { queueId: "q-fulfillment", queueName: "Fulfillment", backlog: 29, avgWaitSeconds: 75, slaAtRisk: 4 }
    ],
    agentProductivity: Array.from({ length: 16 }, (_, idx) => {
      const i = idx + 1;
      return {
        agentId: `agent-${100 + i}`,
        resolvedCount: 18 + (i % 9),
        avgHandleMinutes: 5.2 + (i % 6) * 0.6,
        csat: 4 + (i % 10) / 20
      };
    }),
    resolutionTrend: Array.from({ length: 14 }, (_, idx) => {
      const i = idx + 1;
      return {
        day: `2026-02-${String(12 + idx).padStart(2, "0")}`,
        resolved: 120 + i * 3,
        reopened: 8 + (i % 4)
      };
    }),
    slaCompliancePct: 97.4,
    firstResponseMinutesP50: 2.8
  };
}
