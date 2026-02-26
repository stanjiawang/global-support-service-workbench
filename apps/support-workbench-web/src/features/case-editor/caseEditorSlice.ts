import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockCaseDraft,
  saveMockCaseDraft,
  type MockCaseDraft,
  type MockCaseSaveResult
} from "@shared/network/mockCaseEditor";

interface CaseEditorState {
  readonly status: "idle" | "loading" | "ready" | "saving" | "failed";
  readonly error: string | null;
  readonly draft: MockCaseDraft | null;
  readonly baselineDraft: MockCaseDraft | null;
  readonly lastDiscardedDraft: MockCaseDraft | null;
  readonly isDirty: boolean;
  readonly lastSavedAt: string | null;
  readonly lastRevision: number | null;
}

const initialState: CaseEditorState = {
  status: "idle",
  error: null,
  draft: null,
  baselineDraft: null,
  lastDiscardedDraft: null,
  isDirty: false,
  lastSavedAt: null,
  lastRevision: null
};

export const loadCaseDraft = createAsyncThunk("caseEditor/loadDraft", async (_, { signal }) => {
  return fetchMockCaseDraft(signal);
});

export const persistCaseDraft = createAsyncThunk(
  "caseEditor/persistDraft",
  async (draft: MockCaseDraft, { signal }): Promise<MockCaseSaveResult> => {
    return saveMockCaseDraft(draft, signal);
  }
);

const caseEditorSlice = createSlice({
  name: "caseEditor",
  initialState,
  reducers: {
    updateDraftField(
      state,
      action: PayloadAction<{ field: "subject" | "notes" | "priority" | "escalationRequired"; value: string | boolean }>
    ) {
      if (!state.draft) {
        return;
      }

      const { field, value } = action.payload;
      state.isDirty = true;

      if (field === "subject" && typeof value === "string") {
        state.draft = { ...state.draft, subject: value };
        return;
      }

      if (field === "notes" && typeof value === "string") {
        state.draft = { ...state.draft, notes: value };
        return;
      }

      if (field === "priority" && typeof value === "string") {
        state.draft = { ...state.draft, priority: value as MockCaseDraft["priority"] };
        return;
      }

      if (field === "escalationRequired" && typeof value === "boolean") {
        state.draft = { ...state.draft, escalationRequired: value };
      }
    },
    discardDraftChanges(state) {
      if (!state.draft || !state.baselineDraft) {
        return;
      }

      state.lastDiscardedDraft = state.draft;
      state.draft = state.baselineDraft;
      state.isDirty = false;
      state.error = null;
    },
    recoverDiscardedDraft(state) {
      if (!state.lastDiscardedDraft) {
        return;
      }

      state.draft = state.lastDiscardedDraft;
      state.isDirty = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCaseDraft.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCaseDraft.fulfilled, (state, action) => {
        state.status = "ready";
        state.draft = action.payload;
        state.baselineDraft = action.payload;
        state.lastDiscardedDraft = null;
        state.isDirty = false;
        state.error = null;
      })
      .addCase(loadCaseDraft.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load case draft.";
      })
      .addCase(persistCaseDraft.pending, (state) => {
        state.status = "saving";
        state.error = null;
      })
      .addCase(persistCaseDraft.fulfilled, (state, action) => {
        state.status = "ready";
        state.isDirty = false;
        state.lastSavedAt = action.payload.savedAt;
        state.lastRevision = action.payload.revision;

        if (state.draft) {
          state.draft = { ...state.draft, updatedAt: action.payload.savedAt };
          state.baselineDraft = state.draft;
          state.lastDiscardedDraft = null;
        }
      })
      .addCase(persistCaseDraft.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "ready";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to save case draft.";
      });
  }
});

export const { updateDraftField, discardDraftChanges, recoverDiscardedDraft } = caseEditorSlice.actions;
export const caseEditorReducer = caseEditorSlice.reducer;
