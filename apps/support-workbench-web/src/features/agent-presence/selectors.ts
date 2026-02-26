import type { RootState } from "@app/providers/store";
import type { AgentStatus, MockAgentPresenceRecord } from "@shared/network/mockAgentPresence";

export interface AgentPresenceSummary {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly queueDepth: number;
  readonly availableCount: number;
  readonly busyCount: number;
  readonly breakCount: number;
  readonly offlineCount: number;
  readonly fetchedAt: string | null;
}

function countStatus(agents: readonly MockAgentPresenceRecord[], status: AgentStatus): number {
  return agents.filter((agent) => agent.status === status).length;
}

export function selectAgentRoster(state: RootState): readonly MockAgentPresenceRecord[] {
  return state.agentPresence.agentIds
    .map((id) => state.agentPresence.agentsById[id])
    .filter((agent): agent is MockAgentPresenceRecord => agent !== undefined);
}

export function selectAgentPresenceSummary(state: RootState): AgentPresenceSummary {
  const roster = selectAgentRoster(state);

  return {
    status: state.agentPresence.status,
    queueDepth: state.agentPresence.queueDepth,
    availableCount: countStatus(roster, "available"),
    busyCount: countStatus(roster, "busy"),
    breakCount: countStatus(roster, "break"),
    offlineCount: countStatus(roster, "offline"),
    fetchedAt: state.agentPresence.fetchedAt
  };
}
