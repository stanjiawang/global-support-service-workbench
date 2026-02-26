import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type HandoffStage = "chat_queued" | "phone_active" | "case_opened";

export interface HandoffRecord {
  readonly handoffId: string;
  readonly customerId: string;
  readonly interactionId: string;
  readonly stage: HandoffStage;
  readonly startedAt: string;
  readonly phoneAcceptedAt: string | null;
  readonly caseOpenedAt: string | null;
  readonly caseId: string | null;
  readonly lastUpdatedAt: string;
}

interface HandoffState {
  readonly activeHandoffId: string | null;
  readonly recordsById: Record<string, HandoffRecord>;
  readonly recordIds: readonly string[];
}

const initialState: HandoffState = {
  activeHandoffId: null,
  recordsById: {},
  recordIds: []
};

const handoffSlice = createSlice({
  name: "handoff",
  initialState,
  reducers: {
    beginHandoff(
      state,
      action: PayloadAction<{
        readonly handoffId: string;
        readonly customerId: string;
        readonly interactionId: string;
        readonly startedAt: string;
      }>
    ) {
      const nextRecord: HandoffRecord = {
        handoffId: action.payload.handoffId,
        customerId: action.payload.customerId,
        interactionId: action.payload.interactionId,
        stage: "chat_queued",
        startedAt: action.payload.startedAt,
        phoneAcceptedAt: null,
        caseOpenedAt: null,
        caseId: null,
        lastUpdatedAt: action.payload.startedAt
      };

      state.recordsById[action.payload.handoffId] = nextRecord;
      state.recordIds = [...state.recordIds, action.payload.handoffId];
      state.activeHandoffId = action.payload.handoffId;
    },
    acceptHandoffOnPhone(
      state,
      action: PayloadAction<{
        readonly handoffId: string;
        readonly acceptedAt: string;
      }>
    ) {
      const current = state.recordsById[action.payload.handoffId];
      if (!current) {
        return;
      }

      state.recordsById[action.payload.handoffId] = {
        ...current,
        stage: "phone_active",
        phoneAcceptedAt: current.phoneAcceptedAt ?? action.payload.acceptedAt,
        lastUpdatedAt: action.payload.acceptedAt
      };
      state.activeHandoffId = action.payload.handoffId;
    },
    escalateHandoffToCase(
      state,
      action: PayloadAction<{
        readonly handoffId: string;
        readonly caseId: string;
        readonly escalatedAt: string;
      }>
    ) {
      const current = state.recordsById[action.payload.handoffId];
      if (!current) {
        return;
      }

      state.recordsById[action.payload.handoffId] = {
        ...current,
        stage: "case_opened",
        caseOpenedAt: action.payload.escalatedAt,
        caseId: action.payload.caseId,
        lastUpdatedAt: action.payload.escalatedAt
      };
      state.activeHandoffId = action.payload.handoffId;
    }
  }
});

export const { beginHandoff, acceptHandoffOnPhone, escalateHandoffToCase } = handoffSlice.actions;
export const handoffReducer = handoffSlice.reducer;
