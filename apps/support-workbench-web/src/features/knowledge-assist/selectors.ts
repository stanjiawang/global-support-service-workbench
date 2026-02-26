import type { RootState } from "@app/providers/store";
import type { MockKnowledgeSuggestion } from "@shared/network/mockKnowledgeAssist";

export interface KnowledgeAssistSummary {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly totalSuggestions: number;
  readonly acceptedCount: number;
  readonly rejectedCount: number;
  readonly fetchedAt: string | null;
}

export function selectKnowledgeAssistSummary(state: RootState): KnowledgeAssistSummary {
  return {
    status: state.knowledgeAssist.status,
    totalSuggestions: state.knowledgeAssist.suggestionIds.length,
    acceptedCount: state.knowledgeAssist.acceptedIds.length,
    rejectedCount: state.knowledgeAssist.rejectedIds.length,
    fetchedAt: state.knowledgeAssist.fetchedAt
  };
}

export interface KnowledgeSuggestionView {
  readonly suggestion: MockKnowledgeSuggestion;
  readonly decision: "accepted" | "rejected" | "pending";
}

export function selectKnowledgeSuggestionViews(state: RootState): readonly KnowledgeSuggestionView[] {
  return state.knowledgeAssist.suggestionIds
    .map((id) => state.knowledgeAssist.suggestionsById[id])
    .filter((item): item is MockKnowledgeSuggestion => item !== undefined)
    .map((suggestion) => {
      const decision = state.knowledgeAssist.acceptedIds.includes(suggestion.suggestionId)
        ? "accepted"
        : state.knowledgeAssist.rejectedIds.includes(suggestion.suggestionId)
          ? "rejected"
          : "pending";

      return {
        suggestion,
        decision
      };
    });
}
