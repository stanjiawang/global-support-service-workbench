export interface MockKnowledgeSuggestion {
  readonly suggestionId: string;
  readonly title: string;
  readonly confidence: number;
  readonly category: "policy" | "troubleshooting" | "escalation";
}

export interface MockKnowledgeAssistSnapshot {
  readonly fetchedAt: string;
  readonly suggestions: readonly MockKnowledgeSuggestion[];
}

const CATEGORY_ROTATION: Array<MockKnowledgeSuggestion["category"]> = ["troubleshooting", "policy", "escalation"];

const KNOWLEDGE_SNAPSHOT: MockKnowledgeAssistSnapshot = {
  fetchedAt: "2026-02-26T01:20:00Z",
  suggestions: Array.from({ length: 30 }, (_, idx) => {
    const i = idx + 1;
    const category = CATEGORY_ROTATION[idx % CATEGORY_ROTATION.length] ?? "troubleshooting";
    const confidence = Number((0.62 + (idx % 10) * 0.035).toFixed(2));

    return {
      suggestionId: `ka-${100 + i}`,
      title:
        category === "troubleshooting"
          ? `Troubleshooting flow ${i}: session recovery and verification`
          : category === "policy"
            ? `Policy guidance ${i}: eligibility and exception handling`
            : `Escalation playbook ${i}: handoff and context package`,
      confidence,
      category
    };
  })
};

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

export async function fetchMockKnowledgeAssistSnapshot(signal?: AbortSignal): Promise<MockKnowledgeAssistSnapshot> {
  await delay(200, signal);
  return KNOWLEDGE_SNAPSHOT;
}
