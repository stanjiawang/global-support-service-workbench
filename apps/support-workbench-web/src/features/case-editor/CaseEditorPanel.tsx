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
import { ActionBar } from "@shared/ui/components/ActionBar";
import { FilterBar } from "@shared/ui/components/FilterBar";
import { InputField } from "@shared/ui/components/InputField";
import { StatePanel } from "@shared/ui/components/StatePanel";
import { DetailList } from "@shared/ui/DetailList";
import { emitUxEvent } from "@shared/telemetry/uxEvents";
import { useState } from "react";

export function CaseEditorPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const editor = useSelector(selectCaseEditorState);
  const activeHandoff = useSelector(selectActiveHandoff);
  const [activeSegment, setActiveSegment] = useState<"overview" | "forms" | "actions">("overview");

  if (!editor.draft) {
    return (
      <section className="feature-panel ux-panel" aria-labelledby="case-editor-heading">
        <ActionBar
          title="Case Editor"
          subtitle="Draft unavailable. Reload case template to continue."
          primaryAction={{
            label: "Load draft",
            onClick: () => dispatch(loadCaseDraft())
          }}
        />
        <StatePanel status={editor.status} error={editor.error} emptyHint="Case draft is not loaded yet." />
      </section>
    );
  }

  const draft = editor.draft;

  return (
    <section className="feature-panel ux-panel" aria-labelledby="case-editor-heading">
      <ActionBar
        title="Case Editor"
        subtitle="Draft-safe editing with validation and explicit save lifecycle."
        primaryAction={{
          label: editor.status === "saving" ? "Saving..." : "Save draft",
          onClick: () => {
            dispatch(persistCaseDraft(draft));
            emitUxEvent(dispatch, { eventName: "ui.primary_action_clicked", feature: "/case-editor" });
          },
          disabled: editor.status === "saving"
        }}
      />

      <StatePanel status={editor.status} error={editor.error} />

      <div className="ux-segmented-control" role="tablist" aria-label="Case editor sections">
        {[
          { key: "overview", label: "Overview" },
          { key: "forms", label: "Forms" },
          { key: "actions", label: "Actions" }
        ].map((segment) => (
          <button
            key={segment.key}
            type="button"
            role="tab"
            aria-selected={activeSegment === segment.key}
            className={activeSegment === segment.key ? "ux-segment-btn ux-segment-btn-active" : "ux-segment-btn"}
            onClick={() => setActiveSegment(segment.key as typeof activeSegment)}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {activeSegment === "overview" && editor.isDirty ? (
        <aside className="ux-draft-banner" aria-live="polite">
          Unsaved changes in progress. Leaving this route will require confirmation.
        </aside>
      ) : null}

      {activeSegment === "overview" ? (
        <DetailList
        ariaLabel="Case editor status"
        items={[
          { label: "State", value: editor.status },
          { label: "Dirty", value: editor.isDirty ? "true" : "false" },
          { label: "Last saved", value: editor.lastSavedAt ?? "N/A" },
          { label: "Revision", value: editor.lastRevision ? String(editor.lastRevision) : "N/A" },
          { label: "Active handoff", value: activeHandoff?.handoffId ?? "none" },
          { label: "Handoff stage", value: activeHandoff?.stage ?? "none" }
        ]}
        />
      ) : null}

      {activeSegment === "forms" ? (
        <>
          <FilterBar title="Customer and Issue Context">
            <InputField id="case-subject" label="Subject">
              <input
                id="case-subject"
                className="input-field"
                value={draft.subject}
                onChange={(event) =>
                  dispatch(updateDraftField({ field: "subject", value: event.currentTarget.value }))
                }
              />
            </InputField>

            <InputField id="case-priority" label="Priority">
              <select
                id="case-priority"
                className="input-field"
                value={draft.priority}
                onChange={(event) => dispatch(updateDraftField({ field: "priority", value: event.currentTarget.value }))}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </InputField>
          </FilterBar>

          <FilterBar title="Resolution and Compliance Notes">
            <InputField id="case-notes" label="Notes">
              <textarea
                id="case-notes"
                className="text-area"
                value={draft.notes}
                onChange={(event) => dispatch(updateDraftField({ field: "notes", value: event.currentTarget.value }))}
              />
            </InputField>

            <label className="checkbox-row" htmlFor="case-escalation-required">
              <input
                id="case-escalation-required"
                type="checkbox"
                checked={draft.escalationRequired}
                onChange={(event) =>
                  dispatch(updateDraftField({ field: "escalationRequired", value: event.currentTarget.checked }))
                }
              />
              Escalation required
            </label>
          </FilterBar>
        </>
      ) : null}

      {activeSegment === "actions" ? (
        <section className="ux-bulk-bar" aria-label="Draft actions">
        <button
          type="button"
          className="btn-secondary"
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
        <button type="button" className="btn-secondary" onClick={() => dispatch(discardDraftChanges())} disabled={!editor.isDirty}>
          Discard unsaved changes
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => dispatch(recoverDiscardedDraft())}
          disabled={!editor.lastDiscardedDraft}
        >
          Recover discarded draft
        </button>
        <button type="button" className="btn-secondary" onClick={() => dispatch(loadCaseDraft())}>
          Reset from template
        </button>
        </section>
      ) : null}
    </section>
  );
}
