import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockKnowledgeLinkage,
  type MockDeflectionEvent,
  type MockKnowledgeArticle,
  type MockKnowledgeFeedback
} from "@shared/network/mockKnowledgeLinkage";

interface KnowledgeLinkageState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  articles: MockKnowledgeArticle[];
  deflections: MockDeflectionEvent[];
  feedback: MockKnowledgeFeedback[];
  selectedArticleId: string;
  fetchedAt: string | null;
}

const initialState: KnowledgeLinkageState = {
  status: "idle",
  error: null,
  articles: [],
  deflections: [],
  feedback: [],
  selectedArticleId: "",
  fetchedAt: null
};

export const loadKnowledgeLinkage = createAsyncThunk("knowledgeLinkage/load", async (_, { signal }) => {
  return fetchMockKnowledgeLinkage(signal);
});

const knowledgeLinkageSlice = createSlice({
  name: "knowledgeLinkage",
  initialState,
  reducers: {
    setSelectedKnowledgeArticle(state, action: PayloadAction<string>) {
      state.selectedArticleId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadKnowledgeLinkage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadKnowledgeLinkage.fulfilled, (state, action) => {
        state.status = "ready";
        state.articles = action.payload.articles;
        state.deflections = action.payload.deflections;
        state.feedback = action.payload.feedback;
        state.selectedArticleId = state.selectedArticleId || action.payload.articles[0]?.articleId || "";
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadKnowledgeLinkage.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load knowledge linkage.";
      });
  }
});

export const { setSelectedKnowledgeArticle } = knowledgeLinkageSlice.actions;
export const knowledgeLinkageReducer = knowledgeLinkageSlice.reducer;
