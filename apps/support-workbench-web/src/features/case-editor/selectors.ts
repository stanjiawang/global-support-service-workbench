import type { RootState } from "@app/providers/store";

export function selectCaseEditorState(state: RootState) {
  return state.caseEditor;
}
