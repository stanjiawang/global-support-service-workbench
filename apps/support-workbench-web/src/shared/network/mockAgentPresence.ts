export type AgentStatus = "available" | "busy" | "break" | "offline";

export interface MockAgentPresenceRecord {
  readonly agentId: string;
  readonly displayName: string;
  readonly locale: string;
  readonly status: AgentStatus;
  readonly activeSessions: number;
}

export interface MockAgentPresenceSnapshot {
  readonly fetchedAt: string;
  readonly queueDepth: number;
  readonly agents: readonly MockAgentPresenceRecord[];
}

const LOCALES = ["en-US", "en-GB", "fr-FR", "de-DE", "ja-JP", "es-ES"] as const;
const STATUSES: readonly AgentStatus[] = ["available", "busy", "break", "offline"];

const AGENTS: readonly MockAgentPresenceRecord[] = Array.from({ length: 64 }, (_, idx) => {
  const i = idx + 1;
  const status = STATUSES[idx % STATUSES.length] ?? "available";
  const locale = LOCALES[idx % LOCALES.length] ?? "en-US";

  return {
    agentId: `agent-${1000 + i}`,
    displayName: `Agent ${String(i).padStart(2, "0")}`,
    locale,
    status,
    activeSessions: status === "available" ? (i % 3) + 1 : status === "busy" ? (i % 4) + 2 : 0
  };
});

const SNAPSHOT: MockAgentPresenceSnapshot = {
  fetchedAt: "2026-02-26T01:35:00Z",
  queueDepth: 27,
  agents: AGENTS
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

export async function fetchMockAgentPresenceSnapshot(signal?: AbortSignal): Promise<MockAgentPresenceSnapshot> {
  await delay(220, signal);
  return SNAPSHOT;
}
