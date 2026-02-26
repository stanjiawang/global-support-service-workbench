import { describe, expect, it } from "vitest";
import { chatSessionReducer, ingestChatTimelineEvent, loadChatSessionSnapshot } from "@features/chat-session/chatSessionSlice";
import type { TimelineEvent } from "@shared/types/entities";

function event(overrides?: Partial<TimelineEvent>): TimelineEvent {
  return {
    eventId: "evt-chat-1",
    entityId: "chat-901",
    channel: "chat",
    version: 1,
    serverTs: "2026-02-26T10:00:00.000Z",
    ...overrides
  };
}

describe("chatSessionSlice", () => {
  it("enforces idempotency and stale-version rejection", () => {
    let state = chatSessionReducer(undefined, { type: "init" });

    state = chatSessionReducer(state, ingestChatTimelineEvent(event()));
    expect(state.lastIngestionOutcome).toBe("accepted");
    expect(state.timelineIds).toHaveLength(1);

    state = chatSessionReducer(state, ingestChatTimelineEvent(event()));
    expect(state.lastIngestionOutcome).toBe("rejected-idempotent");
    expect(state.timelineIds).toHaveLength(1);

    state = chatSessionReducer(
      state,
      ingestChatTimelineEvent(
        event({
          eventId: "evt-chat-2",
          version: 1
        })
      )
    );
    expect(state.lastIngestionOutcome).toBe("rejected-stale");
    expect(state.timelineIds).toHaveLength(1);
  });

  it("ignores stale snapshot payload versions", () => {
    const baseline = chatSessionReducer(
      undefined,
      loadChatSessionSnapshot.fulfilled(
        {
          version: 9,
          fetchedAt: "2026-02-26T10:00:00.000Z",
          interactions: [],
          timelineEvents: [event({ eventId: "evt-chat-snap-1", version: 3 })]
        },
        "request-1",
        undefined
      )
    );

    const next = chatSessionReducer(
      baseline,
      loadChatSessionSnapshot.fulfilled(
        {
          version: 8,
          fetchedAt: "2026-02-26T10:02:00.000Z",
          interactions: [],
          timelineEvents: [event({ eventId: "evt-chat-snap-2", version: 4 })]
        },
        "request-2",
        undefined
      )
    );

    expect(next.snapshotVersion).toBe(9);
    expect(next.timelineIds).toEqual(["evt-chat-snap-1"]);
  });
});
