import { describe, expect, it } from "vitest";
import { createWorkbenchStore } from "@app/providers/store";
import {
  acceptCurrentHandoffOnPhone,
  escalateCurrentHandoffToCase,
  startChatToPhoneHandoff
} from "@app/providers/simulationActions";
import { loadCaseHistorySnapshot } from "@features/case-history/caseHistorySlice";
import { loadChatSessionSnapshot } from "@features/chat-session/chatSessionSlice";

describe("handoff simulation actions", () => {
  it("creates an end-to-end chat -> phone -> case handoff with timeline continuity", async () => {
    const store = createWorkbenchStore();

    await store.dispatch(loadChatSessionSnapshot());
    await store.dispatch(loadCaseHistorySnapshot());

    const chatBefore = store.getState().chatSession.timelineIds.length;
    const caseBefore = store.getState().caseHistory.timelineIds.length;

    store.dispatch(startChatToPhoneHandoff());
    store.dispatch(acceptCurrentHandoffOnPhone());
    store.dispatch(escalateCurrentHandoffToCase());

    const state = store.getState();
    const activeId = state.handoff.activeHandoffId;

    expect(activeId).toBeTruthy();
    if (!activeId) {
      throw new Error("Expected active handoff id");
    }

    expect(state.handoff.recordsById[activeId]?.stage).toBe("case_opened");
    expect(state.chatSession.timelineIds.length).toBeGreaterThan(chatBefore);
    expect(state.caseHistory.timelineIds.length).toBeGreaterThan(caseBefore);
    expect(state.chatSession.lastIngestionOutcome).toBe("accepted");
    expect(state.caseHistory.lastIngestionOutcome).toBe("accepted");
  });
});
