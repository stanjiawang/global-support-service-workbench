import type { RootState } from "@app/providers/store";
import type { HandoffRecord } from "@app/providers/handoffSlice";

export function selectActiveHandoff(state: RootState): HandoffRecord | null {
  const activeId = state.handoff.activeHandoffId;
  if (!activeId) {
    return null;
  }
  return state.handoff.recordsById[activeId] ?? null;
}

export function selectRecentHandoffs(state: RootState): readonly HandoffRecord[] {
  return state.handoff.recordIds
    .map((id) => state.handoff.recordsById[id])
    .filter((item): item is HandoffRecord => item !== undefined)
    .slice(-20)
    .reverse();
}
