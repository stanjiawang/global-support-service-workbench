import type { AgentSession, CaseRecord, Customer, Interaction, TimelineEvent } from "@shared/types/entities";

export interface EntityBucket<T> {
  readonly byId: Record<string, T>;
  readonly allIds: readonly string[];
}

export interface CrossChannelState {
  readonly customers: EntityBucket<Customer>;
  readonly interactions: EntityBucket<Interaction>;
  readonly cases: EntityBucket<CaseRecord>;
  readonly timelineEvents: EntityBucket<TimelineEvent>;
  readonly agentSessions: EntityBucket<AgentSession>;
  readonly processedEventIds: readonly string[];
}

export interface EventConflictPolicy {
  readonly rejectStaleVersions: true;
  readonly idempotentByEventId: true;
  readonly abortSupersededRequests: true;
  readonly optimisticUpdateScope: "low-risk-ui-only";
}

export const EVENT_CONFLICT_POLICY: EventConflictPolicy = {
  rejectStaleVersions: true,
  idempotentByEventId: true,
  abortSupersededRequests: true,
  optimisticUpdateScope: "low-risk-ui-only"
};
