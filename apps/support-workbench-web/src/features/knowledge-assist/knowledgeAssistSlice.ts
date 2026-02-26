import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockKnowledgeAssistSnapshot,
  type MockKnowledgeSuggestion
} from "@shared/network/mockKnowledgeAssist";

interface KnowledgeAssistState {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly error: string | null;
  readonly suggestionsById: Record<string, MockKnowledgeSuggestion>;
  readonly suggestionIds: readonly string[];
  readonly acceptedIds: readonly string[];
  readonly rejectedIds: readonly string[];
  readonly fetchedAt: string | null;
}

const initialState: KnowledgeAssistState = {
  status: "idle",
  error: null,
  suggestionsById: {},
  suggestionIds: [],
  acceptedIds: [],
  rejectedIds: [],
  fetchedAt: null
};

export const loadKnowledgeAssistSnapshot = createAsyncThunk(
  "knowledgeAssist/loadSnapshot",
  async (_, { signal }) => fetchMockKnowledgeAssistSnapshot(signal)
);

const knowledgeAssistSlice = createSlice({
  name: "knowledgeAssist",
  initialState,
  reducers: {
    acceptSuggestion(state, action: PayloadAction<string>) {
      const suggestionId = action.payload;
      if (!state.suggestionsById[suggestionId]) {
        return;
      }

      if (!state.acceptedIds.includes(suggestionId)) {
        state.acceptedIds = [...state.acceptedIds, suggestionId];
      }
      state.rejectedIds = state.rejectedIds.filter((id) => id !== suggestionId);
    },
    rejectSuggestion(state, action: PayloadAction<string>) {
      const suggestionId = action.payload;
      if (!state.suggestionsById[suggestionId]) {
        return;
      }

      if (!state.rejectedIds.includes(suggestionId)) {
        state.rejectedIds = [...state.rejectedIds, suggestionId];
      }
      state.acceptedIds = state.acceptedIds.filter((id) => id !== suggestionId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadKnowledgeAssistSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadKnowledgeAssistSnapshot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fetchedAt = action.payload.fetchedAt;

        const nextById: Record<string, MockKnowledgeSuggestion> = {};
        const nextIds: string[] = [];

        for (const suggestion of action.payload.suggestions) {
          nextById[suggestion.suggestionId] = suggestion;
          nextIds.push(suggestion.suggestionId);
        }

        state.suggestionsById = nextById;
        state.suggestionIds = nextIds;
      })
      .addCase(loadKnowledgeAssistSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load knowledge assist suggestions.";
      });
  }
});

export const { acceptSuggestion, rejectSuggestion } = knowledgeAssistSlice.actions;
export const knowledgeAssistReducer = knowledgeAssistSlice.reducer;
