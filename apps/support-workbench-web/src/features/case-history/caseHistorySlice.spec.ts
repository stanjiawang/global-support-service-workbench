import { describe, expect, it } from "vitest";
import { caseHistoryReducer, ingestCaseTimelineEvent, loadCaseHistorySnapshot } from "@features/case-history/caseHistorySlice";
import type { TimelineEvent } from "@shared/types/entities";

function event(overrides?: Partial<TimelineEvent>): TimelineEvent {
  return {
    eventId: "evt-case-1",
    entityId: "case-201",
    channel: "case",
    version: 1,
    serverTs: "2026-02-26T11:00:00.000Z",
    ...overrides
  };
}

describe("caseHistorySlice", () => {
  it("enforces idempotency and stale-version rejection", () => {
    let state = caseHistoryReducer(undefined, { type: "init" });

    state = caseHistoryReducer(state, ingestCaseTimelineEvent(event()));
    expect(state.lastIngestionOutcome).toBe("accepted");
    expect(state.timelineIds).toHaveLength(1);

    state = caseHistoryReducer(state, ingestCaseTimelineEvent(event()));
    expect(state.lastIngestionOutcome).toBe("rejected-idempotent");
    expect(state.timelineIds).toHaveLength(1);

    state = caseHistoryReducer(
      state,
      ingestCaseTimelineEvent(
        event({
          eventId: "evt-case-2",
          version: 1
        })
      )
    );
    expect(state.lastIngestionOutcome).toBe("rejected-stale");
    expect(state.timelineIds).toHaveLength(1);
  });

  it("ignores stale snapshot payload versions", () => {
    const baseline = caseHistoryReducer(
      undefined,
      loadCaseHistorySnapshot.fulfilled(
        {
          version: 12,
          fetchedAt: "2026-02-26T11:00:00.000Z",
          cases: [],
          timelineEvents: [event({ eventId: "evt-case-snap-1", version: 5 })]
        },
        "request-1",
        undefined
      )
    );

    const next = caseHistoryReducer(
      baseline,
      loadCaseHistorySnapshot.fulfilled(
        {
          version: 11,
          fetchedAt: "2026-02-26T11:02:00.000Z",
          cases: [],
          timelineEvents: [event({ eventId: "evt-case-snap-2", version: 6 })]
        },
        "request-2",
        undefined
      )
    );

    expect(next.snapshotVersion).toBe(12);
    expect(next.timelineIds).toEqual(["evt-case-snap-1"]);
  });
});
