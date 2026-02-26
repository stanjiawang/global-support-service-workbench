import { describe, expect, it } from "vitest";
import {
  caseEditorReducer,
  discardDraftChanges,
  loadCaseDraft,
  persistCaseDraft,
  recoverDiscardedDraft,
  updateDraftField
} from "@features/case-editor/caseEditorSlice";

describe("caseEditorSlice", () => {
  it("discards unsaved changes and can recover the discarded draft", () => {
    let state = caseEditorReducer(
      undefined,
      loadCaseDraft.fulfilled(
        {
          caseId: "case-201",
          subject: "Battery issue",
          notes: "Initial notes",
          priority: "medium",
          escalationRequired: false,
          updatedAt: "2026-02-26T11:00:00.000Z"
        },
        "request-1",
        undefined
      )
    );

    state = caseEditorReducer(state, updateDraftField({ field: "notes", value: "Changed notes" }));
    expect(state.isDirty).toBe(true);
    expect(state.draft?.notes).toBe("Changed notes");

    state = caseEditorReducer(state, discardDraftChanges());
    expect(state.isDirty).toBe(false);
    expect(state.draft?.notes).toBe("Initial notes");
    expect(state.lastDiscardedDraft?.notes).toBe("Changed notes");

    state = caseEditorReducer(state, recoverDiscardedDraft());
    expect(state.isDirty).toBe(true);
    expect(state.draft?.notes).toBe("Changed notes");
  });

  it("updates baseline draft after successful save", () => {
    let state = caseEditorReducer(
      undefined,
      loadCaseDraft.fulfilled(
        {
          caseId: "case-201",
          subject: "Original subject",
          notes: "Original notes",
          priority: "medium",
          escalationRequired: false,
          updatedAt: "2026-02-26T11:00:00.000Z"
        },
        "request-1",
        undefined
      )
    );

    state = caseEditorReducer(state, updateDraftField({ field: "subject", value: "Updated subject" }));
    expect(state.isDirty).toBe(true);
    const draftBeforeSave = state.draft;
    if (!draftBeforeSave) {
      throw new Error("Expected draft to exist before save");
    }

    state = caseEditorReducer(
      state,
      persistCaseDraft.fulfilled(
        {
          savedAt: "2026-02-26T11:05:00.000Z",
          revision: 3
        },
        "request-2",
        draftBeforeSave
      )
    );

    expect(state.isDirty).toBe(false);
    expect(state.baselineDraft?.subject).toBe("Updated subject");
    expect(state.lastSavedAt).toBe("2026-02-26T11:05:00.000Z");
  });
});
