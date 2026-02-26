import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import {
  discardDraftChanges,
  loadCaseDraft,
  persistCaseDraft,
  recoverDiscardedDraft,
  updateDraftField
} from "@features/case-editor/caseEditorSlice";
import { selectCaseEditorState } from "@features/case-editor/selectors";
import { selectActiveHandoff } from "@shared/state/handoffSelectors";
import { DetailList } from "@shared/ui/DetailList";

export function CaseEditorPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const editor = useSelector(selectCaseEditorState);
  const activeHandoff = useSelector(selectActiveHandoff);

  if (!editor.draft) {
    return (
      <section className="feature-panel" aria-labelledby="case-editor-heading">
        <h2 id="case-editor-heading">case-editor</h2>
        <p>Draft unavailable. Reload the draft snapshot.</p>
        <button type="button" className="nav-btn" onClick={() => dispatch(loadCaseDraft())}>
          Load draft
        </button>
      </section>
    );
  }

  const draft = editor.draft;

  return (
    <section className="feature-panel" aria-labelledby="case-editor-heading">
      <h2 id="case-editor-heading">case-editor</h2>
      <p>Mock case draft editor with validation and save lifecycle.</p>

      <h3>Status</h3>
      <DetailList
        ariaLabel="Case editor status"
        items={[
          { label: "State", value: editor.status },
          { label: "Dirty", value: editor.isDirty ? "true" : "false" },
          { label: "Last saved", value: editor.lastSavedAt ?? "N/A" },
          { label: "Revision", value: editor.lastRevision ? String(editor.lastRevision) : "N/A" },
          { label: "Error", value: editor.error ?? "none" },
          { label: "Active handoff", value: activeHandoff?.handoffId ?? "none" },
          { label: "Handoff stage", value: activeHandoff?.stage ?? "none" },
          { label: "Handoff case", value: activeHandoff?.caseId ?? "none" }
        ]}
      />

      <h3>Draft Form</h3>
      <div className="form-grid">
        <label className="field-label" htmlFor="case-subject">
          Subject
        </label>
        <input
          id="case-subject"
          className="text-input"
          value={draft.subject}
          onChange={(event) =>
            dispatch(updateDraftField({ field: "subject", value: event.currentTarget.value }))
          }
        />

        <label className="field-label" htmlFor="case-priority">
          Priority
        </label>
        <select
          id="case-priority"
          className="text-input"
          value={draft.priority}
          onChange={(event) => dispatch(updateDraftField({ field: "priority", value: event.currentTarget.value }))}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <label className="field-label" htmlFor="case-notes">
          Notes
        </label>
        <textarea
          id="case-notes"
          className="text-area"
          value={draft.notes}
          onChange={(event) => dispatch(updateDraftField({ field: "notes", value: event.currentTarget.value }))}
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={draft.escalationRequired}
            onChange={(event) =>
              dispatch(updateDraftField({ field: "escalationRequired", value: event.currentTarget.checked }))
            }
          />
          Escalation required
        </label>
      </div>

      <p className="inline-actions">
        <button
          type="button"
          className="nav-btn"
          disabled={!activeHandoff || activeHandoff.stage !== "case_opened"}
          onClick={() => {
            dispatch(updateDraftField({ field: "escalationRequired", value: true }));
            dispatch(
              updateDraftField({
                field: "notes",
                value: `[Handoff ${activeHandoff?.handoffId}] Routed from phone escalation.\n\n${draft.notes}`
              })
            );
          }}
        >
          Apply handoff context
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => dispatch(persistCaseDraft(draft))}
          disabled={editor.status === "saving"}
        >
          {editor.status === "saving" ? "Saving..." : "Save draft"}
        </button>
        <button type="button" className="nav-btn" onClick={() => dispatch(discardDraftChanges())} disabled={!editor.isDirty}>
          Discard unsaved changes
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => dispatch(recoverDiscardedDraft())}
          disabled={!editor.lastDiscardedDraft}
        >
          Recover discarded draft
        </button>
        <button type="button" className="nav-btn" onClick={() => dispatch(loadCaseDraft())}>
          Reset from template
        </button>
      </p>
    </section>
  );
}
