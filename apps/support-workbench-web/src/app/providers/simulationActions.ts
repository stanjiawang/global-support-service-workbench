import { ingestCaseTimelineEvent } from "@features/case-history/caseHistorySlice";
import { ingestChatTimelineEvent } from "@features/chat-session/chatSessionSlice";
import { acceptHandoffOnPhone, beginHandoff, escalateHandoffToCase } from "@app/providers/handoffSlice";
import type { RootState } from "@app/providers/store";
import type { AppDispatch } from "@app/providers/store";
import type { TimelineEvent } from "@shared/types/entities";

function eventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function latestEntityVersion(state: RootState, entityId: string, source: "chat" | "case"): number {
  if (source === "chat") {
    return state.chatSession.entityVersionById[entityId] ?? 0;
  }
  return state.caseHistory.entityVersionById[entityId] ?? 0;
}

function firstChatEntity(state: RootState): string {
  return state.chatSession.interactionIds[0] ?? "chat-901";
}

function firstCaseEntity(state: RootState): string {
  return state.caseHistory.caseIds[0] ?? "case-100";
}

export function simulateChatFreshEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const entityId = firstChatEntity(state);
    const version = latestEntityVersion(state, entityId, "chat") + 1;

    const event: TimelineEvent = {
      eventId: eventId("sim-chat-fresh"),
      entityId,
      channel: "chat",
      version,
      serverTs: new Date().toISOString()
    };

    dispatch(ingestChatTimelineEvent(event));
  };
}

export function simulateChatReplayEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const replayId = state.chatSession.lastIngestionEventId ?? state.chatSession.timelineIds[0];

    if (!replayId) {
      return;
    }

    const existing = state.chatSession.timelineById[replayId];
    if (!existing) {
      return;
    }

    dispatch(ingestChatTimelineEvent(existing));
  };
}

export function simulateChatStaleEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const entityId = firstChatEntity(state);
    const currentVersion = latestEntityVersion(state, entityId, "chat");

    const event: TimelineEvent = {
      eventId: eventId("sim-chat-stale"),
      entityId,
      channel: "chat",
      version: currentVersion > 0 ? currentVersion - 1 : 0,
      serverTs: new Date().toISOString()
    };

    dispatch(ingestChatTimelineEvent(event));
  };
}

export function simulateCaseFreshEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const entityId = firstCaseEntity(state);
    const version = latestEntityVersion(state, entityId, "case") + 1;

    const event: TimelineEvent = {
      eventId: eventId("sim-case-fresh"),
      entityId,
      channel: "case",
      version,
      serverTs: new Date().toISOString()
    };

    dispatch(ingestCaseTimelineEvent(event));
  };
}

export function simulateCaseReplayEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const replayId = state.caseHistory.lastIngestionEventId ?? state.caseHistory.timelineIds[0];

    if (!replayId) {
      return;
    }

    const existing = state.caseHistory.timelineById[replayId];
    if (!existing) {
      return;
    }

    dispatch(ingestCaseTimelineEvent(existing));
  };
}

export function simulateCaseStaleEvent() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const entityId = firstCaseEntity(state);
    const currentVersion = latestEntityVersion(state, entityId, "case");

    const event: TimelineEvent = {
      eventId: eventId("sim-case-stale"),
      entityId,
      channel: "case",
      version: currentVersion > 0 ? currentVersion - 1 : 0,
      serverTs: new Date().toISOString()
    };

    dispatch(ingestCaseTimelineEvent(event));
  };
}

function activeHandoffId(state: RootState): string | null {
  return state.handoff.activeHandoffId;
}

export function startChatToPhoneHandoff() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const interactionId = firstChatEntity(state);
    const interaction = state.chatSession.interactionsById[interactionId];
    const customerId = interaction?.customerId ?? "cust-101";
    const timestamp = new Date().toISOString();
    const handoffId = eventId("handoff");

    dispatch(
      beginHandoff({
        handoffId,
        customerId,
        interactionId,
        startedAt: timestamp
      })
    );

    dispatch(
      ingestChatTimelineEvent({
        eventId: eventId("evt-handoff-chat"),
        entityId: interactionId,
        channel: "chat",
        version: latestEntityVersion(getState(), interactionId, "chat") + 1,
        serverTs: timestamp
      })
    );
  };
}

export function acceptCurrentHandoffOnPhone() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const handoffId = activeHandoffId(state);
    if (!handoffId) {
      return;
    }

    const handoff = state.handoff.recordsById[handoffId];
    if (!handoff) {
      return;
    }

    const timestamp = new Date().toISOString();

    dispatch(
      acceptHandoffOnPhone({
        handoffId,
        acceptedAt: timestamp
      })
    );

    dispatch(
      ingestChatTimelineEvent({
        eventId: eventId("evt-handoff-phone"),
        entityId: handoff.interactionId,
        channel: "phone",
        version: latestEntityVersion(getState(), handoff.interactionId, "chat") + 1,
        serverTs: timestamp
      })
    );
  };
}

export function escalateCurrentHandoffToCase() {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const handoffId = activeHandoffId(state);
    if (!handoffId) {
      return;
    }

    const handoff = state.handoff.recordsById[handoffId];
    if (!handoff) {
      return;
    }

    const caseId = firstCaseEntity(state);
    const timestamp = new Date().toISOString();

    dispatch(
      escalateHandoffToCase({
        handoffId,
        caseId,
        escalatedAt: timestamp
      })
    );

    dispatch(
      ingestCaseTimelineEvent({
        eventId: eventId("evt-handoff-case"),
        entityId: caseId,
        channel: "case",
        version: latestEntityVersion(getState(), caseId, "case") + 1,
        serverTs: timestamp
      })
    );
  };
}
