import { describe, expect, it } from "vitest";
import { communicationLoggingReducer, loadCommunicationSnapshot } from "@features/communication-logging/communicationLoggingSlice";

describe("communicationLoggingSlice", () => {
  it("indexes threads and messages by thread id", () => {
    let state = communicationLoggingReducer(undefined, { type: "seed" });
    state = communicationLoggingReducer(state, {
      type: loadCommunicationSnapshot.fulfilled.type,
      payload: {
        fetchedAt: "2026-02-26T19:30:00Z",
        threads: [
          {
            threadId: "thread-1",
            ticketId: "TKT-1201",
            customerId: "cust-101",
            channel: "chat",
            subject: "Chat",
            participants: ["a", "b"],
            updatedAt: "2026-02-26T10:00:00Z"
          }
        ],
        messages: [
          {
            messageId: "msg-1",
            threadId: "thread-1",
            channel: "chat",
            direction: "inbound",
            author: "customer",
            body: "hello",
            timestamp: "2026-02-26T10:01:00Z"
          }
        ]
      }
    });

    expect(state.status).toBe("ready");
    expect(state.threadIds).toEqual(["thread-1"]);
    expect(state.messageIdsByThread["thread-1"]).toEqual(["msg-1"]);
  });
});
