export type ChannelType = "chat" | "phone" | "case";

export interface Customer {
  readonly customerId: string;
  readonly locale: string;
  readonly region: string;
}

export interface Interaction {
  readonly interactionId: string;
  readonly customerId: string;
  readonly channel: ChannelType;
  readonly openedAt: string;
}

export interface CaseRecord {
  readonly caseId: string;
  readonly customerId: string;
  readonly status: "open" | "pending" | "resolved" | "closed";
  readonly updatedAt: string;
}

export interface TimelineEvent {
  readonly eventId: string;
  readonly entityId: string;
  readonly channel: ChannelType;
  readonly version: number;
  readonly serverTs: string;
}

export interface AgentSession {
  readonly agentId: string;
  readonly sessionId: string;
  readonly activeInteractionIds: readonly string[];
}
