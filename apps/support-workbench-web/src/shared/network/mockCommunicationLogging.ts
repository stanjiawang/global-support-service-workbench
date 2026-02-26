export type CommunicationChannel = "email" | "sms" | "chat";

export interface MockTranscriptMessage {
  messageId: string;
  threadId: string;
  channel: CommunicationChannel;
  direction: "inbound" | "outbound";
  author: string;
  body: string;
  timestamp: string;
}

export interface MockTranscriptThread {
  threadId: string;
  ticketId: string;
  customerId: string;
  channel: CommunicationChannel;
  subject: string;
  participants: string[];
  updatedAt: string;
}

export interface MockCommunicationSnapshot {
  fetchedAt: string;
  threads: MockTranscriptThread[];
  messages: MockTranscriptMessage[];
}

const THREADS: MockTranscriptThread[] = Array.from({ length: 22 }, (_, idx) => {
  const i = idx + 1;
  const channel: CommunicationChannel = (["email", "sms", "chat"] as const)[i % 3] ?? "chat";
  return {
    threadId: `thread-${600 + i}`,
    ticketId: `TKT-${1200 + (i % 120)}`,
    customerId: `cust-${100 + (i % 48)}`,
    channel,
    subject: `${channel.toUpperCase()} follow-up ${i}`,
    participants: ["customer@example.com", "agent-ava", "agent-liam"].slice(0, 2 + (i % 2)),
    updatedAt: `2026-02-${String(5 + (i % 20)).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:00:00Z`
  };
});

const MESSAGES: MockTranscriptMessage[] = THREADS.flatMap((thread, idx) =>
  Array.from({ length: 10 }, (_, midx) => {
    const j = midx + 1;
    return {
      messageId: `${thread.threadId}-msg-${j}`,
      threadId: thread.threadId,
      channel: thread.channel,
      direction: j % 2 === 0 ? "outbound" : "inbound",
      author: j % 2 === 0 ? "agent-ava" : "customer@example.com",
      body: `Transcript line ${j} for ${thread.threadId} (${thread.channel})`,
      timestamp: `2026-02-${String(1 + ((idx + j) % 20)).padStart(2, "0")}T${String(7 + ((idx + j) % 10)).padStart(
        2,
        "0"
      )}:${String((idx * 7 + j * 3) % 60).padStart(2, "0")}:00Z`
    };
  })
);

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

export async function fetchMockCommunicationSnapshot(signal?: AbortSignal): Promise<MockCommunicationSnapshot> {
  await delay(170, signal);
  return {
    fetchedAt: "2026-02-26T19:30:00Z",
    threads: THREADS,
    messages: MESSAGES
  };
}
