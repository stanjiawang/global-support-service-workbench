export interface AiSuggestionRequest {
  ticketId: string;
  draft: string;
}

export interface AiSuggestionResult {
  ticketId: string;
  suggestion: string;
}

export interface AiSummaryRequest {
  ticketId: string;
  transcript: string;
}

export interface AiSummaryResult {
  ticketId: string;
  summary: string;
}

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

export async function fetchMockAiSuggestion(
  request: AiSuggestionRequest,
  signal?: AbortSignal
): Promise<AiSuggestionResult> {
  await delay(120, signal);
  return {
    ticketId: request.ticketId,
    suggestion: `Thanks for the details. I reviewed your case and can confirm the next best action is to validate device diagnostics, then apply the pending support policy update.`
  };
}

export async function fetchMockAiSummary(request: AiSummaryRequest, signal?: AbortSignal): Promise<AiSummaryResult> {
  await delay(160, signal);
  const compressed = request.transcript.replace(/\s+/g, " ").trim().slice(0, 180);
  return {
    ticketId: request.ticketId,
    summary: `Auto-summary: ${compressed}${compressed.length >= 180 ? "..." : ""}`
  };
}
