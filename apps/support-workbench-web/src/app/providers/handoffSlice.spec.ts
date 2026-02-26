import { describe, expect, it } from "vitest";
import { acceptHandoffOnPhone, beginHandoff, escalateHandoffToCase, handoffReducer } from "@app/providers/handoffSlice";

describe("handoffSlice", () => {
  it("progresses handoff stage from chat to phone to case", () => {
    let state = handoffReducer(undefined, { type: "init" });

    state = handoffReducer(
      state,
      beginHandoff({
        handoffId: "handoff-1",
        customerId: "cust-101",
        interactionId: "chat-901",
        startedAt: "2026-02-26T10:00:00.000Z"
      })
    );
    expect(state.activeHandoffId).toBe("handoff-1");
    expect(state.recordsById["handoff-1"]?.stage).toBe("chat_queued");

    state = handoffReducer(
      state,
      acceptHandoffOnPhone({
        handoffId: "handoff-1",
        acceptedAt: "2026-02-26T10:01:00.000Z"
      })
    );
    expect(state.recordsById["handoff-1"]?.stage).toBe("phone_active");

    state = handoffReducer(
      state,
      escalateHandoffToCase({
        handoffId: "handoff-1",
        caseId: "case-201",
        escalatedAt: "2026-02-26T10:02:00.000Z"
      })
    );
    expect(state.recordsById["handoff-1"]?.stage).toBe("case_opened");
    expect(state.recordsById["handoff-1"]?.caseId).toBe("case-201");
  });
});
