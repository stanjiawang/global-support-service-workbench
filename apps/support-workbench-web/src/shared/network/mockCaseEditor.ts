export interface MockCaseDraft {
  readonly caseId: string;
  readonly subject: string;
  readonly notes: string;
  readonly priority: "low" | "medium" | "high";
  readonly escalationRequired: boolean;
  readonly updatedAt: string;
}

export interface MockCaseSaveResult {
  readonly savedAt: string;
  readonly revision: number;
}

const TEMPLATE_DRAFT: MockCaseDraft = {
  caseId: "case-241",
  subject: "Subscription cancellation follow-up",
  notes:
    "Customer requested cancellation details and refund eligibility confirmation. Verify policy window and provide final outcome summary.",
  priority: "medium",
  escalationRequired: false,
  updatedAt: "2026-02-26T01:40:00Z"
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

export async function fetchMockCaseDraft(signal?: AbortSignal): Promise<MockCaseDraft> {
  await delay(180, signal);
  return TEMPLATE_DRAFT;
}

export async function saveMockCaseDraft(draft: MockCaseDraft, signal?: AbortSignal): Promise<MockCaseSaveResult> {
  await delay(260, signal);

  if (draft.subject.trim().length < 8) {
    throw new Error("Subject must be at least 8 characters.");
  }

  if (draft.notes.trim().length < 24) {
    throw new Error("Notes must be at least 24 characters.");
  }

  return {
    savedAt: new Date().toISOString(),
    revision: Math.floor(Date.now() / 1000)
  };
}
