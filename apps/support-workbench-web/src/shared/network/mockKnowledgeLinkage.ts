export interface MockKnowledgeArticle {
  articleId: string;
  title: string;
  topic: string;
  version: string;
  linkedTicketIds: string[];
}

export interface MockDeflectionEvent {
  eventId: string;
  articleId: string;
  ticketId: string;
  channel: "chat" | "phone" | "email";
  deflected: boolean;
  capturedAt: string;
}

export interface MockKnowledgeFeedback {
  feedbackId: string;
  articleId: string;
  ticketId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  submittedAt: string;
}

export interface MockKnowledgeLinkageSnapshot {
  fetchedAt: string;
  articles: MockKnowledgeArticle[];
  deflections: MockDeflectionEvent[];
  feedback: MockKnowledgeFeedback[];
}

export async function fetchMockKnowledgeLinkage(signal?: AbortSignal): Promise<MockKnowledgeLinkageSnapshot> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 150);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

  const articles: MockKnowledgeArticle[] = Array.from({ length: 16 }, (_, idx) => {
    const i = idx + 1;
    return {
      articleId: `kb-${200 + i}`,
      title: `Knowledge article ${i}`,
      topic: ["billing", "ios", "mac", "shipping"][i % 4] ?? "general",
      version: `v${1 + (i % 3)}.${i % 10}`,
      linkedTicketIds: [`TKT-${1200 + i}`, `TKT-${1300 + i}`]
    };
  });

  const deflections: MockDeflectionEvent[] = Array.from({ length: 40 }, (_, idx) => {
    const i = idx + 1;
    return {
      eventId: `defl-${i}`,
      articleId: articles[i % articles.length]!.articleId,
      ticketId: `TKT-${1200 + (i % 180)}`,
      channel: (["chat", "phone", "email"] as const)[i % 3] ?? "chat",
      deflected: i % 4 !== 0,
      capturedAt: `2026-02-${String(1 + (i % 20)).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:10:00Z`
    };
  });

  const feedback: MockKnowledgeFeedback[] = Array.from({ length: 36 }, (_, idx) => {
    const i = idx + 1;
    return {
      feedbackId: `fdbk-${i}`,
      articleId: articles[i % articles.length]!.articleId,
      ticketId: `TKT-${1200 + (i % 180)}`,
      rating: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      comment: `Feedback note ${i} about article usefulness`,
      submittedAt: `2026-02-${String(2 + (i % 20)).padStart(2, "0")}T${String(9 + (i % 8)).padStart(2, "0")}:20:00Z`
    };
  });

  return {
    fetchedAt: "2026-02-26T20:02:00Z",
    articles,
    deflections,
    feedback
  };
}
