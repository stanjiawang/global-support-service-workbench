import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockCaseHistorySnapshot } from "@shared/network/mockBackend";
import type { CaseRecord, TimelineEvent } from "@shared/types/entities";

interface CaseHistoryState {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly error: string | null;
  readonly snapshotVersion: number;
  readonly casesById: Record<string, CaseRecord>;
  readonly caseIds: readonly string[];
  readonly timelineById: Record<string, TimelineEvent>;
  readonly timelineIds: readonly string[];
  readonly processedEventIds: readonly string[];
  readonly entityVersionById: Record<string, number>;
  readonly lastFetchedAt: string | null;
  readonly lastIngestionOutcome: "accepted" | "rejected-idempotent" | "rejected-stale" | null;
  readonly lastIngestionEventId: string | null;
}

const initialState: CaseHistoryState = {
  status: "idle",
  error: null,
  snapshotVersion: 0,
  casesById: {},
  caseIds: [],
  timelineById: {},
  timelineIds: [],
  processedEventIds: [],
  entityVersionById: {},
  lastFetchedAt: null,
  lastIngestionOutcome: null,
  lastIngestionEventId: null
};

export const loadCaseHistorySnapshot = createAsyncThunk("caseHistory/loadSnapshot", async (_, { signal }) => {
  return fetchMockCaseHistorySnapshot(signal);
});

const caseHistorySlice = createSlice({
  name: "caseHistory",
  initialState,
  reducers: {
    ingestCaseTimelineEvent(state, action: PayloadAction<TimelineEvent>) {
      const event = action.payload;
      const processedEventIds = new Set(state.processedEventIds);

      if (processedEventIds.has(event.eventId)) {
        state.lastIngestionOutcome = "rejected-idempotent";
        state.lastIngestionEventId = event.eventId;
        return;
      }

      const currentVersion = state.entityVersionById[event.entityId] ?? 0;
      if (event.version <= currentVersion) {
        state.lastIngestionOutcome = "rejected-stale";
        state.lastIngestionEventId = event.eventId;
        return;
      }

      processedEventIds.add(event.eventId);
      state.timelineById[event.eventId] = event;
      state.timelineIds = [...state.timelineIds, event.eventId];
      state.processedEventIds = [...processedEventIds];
      state.entityVersionById[event.entityId] = event.version;
      state.lastIngestionOutcome = "accepted";
      state.lastIngestionEventId = event.eventId;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCaseHistorySnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCaseHistorySnapshot.fulfilled, (state, action) => {
        if (action.payload.version < state.snapshotVersion) {
          return;
        }

        state.status = "succeeded";
        state.snapshotVersion = action.payload.version;
        state.lastFetchedAt = action.payload.fetchedAt;

        const nextCasesById: Record<string, CaseRecord> = {};
        const nextCaseIds: string[] = [];

        for (const caseRecord of action.payload.cases) {
          nextCasesById[caseRecord.caseId] = caseRecord;
          nextCaseIds.push(caseRecord.caseId);
        }

        const timelineById: Record<string, TimelineEvent> = { ...state.timelineById };
        const timelineIds = [...state.timelineIds];
        const processedEventIds = new Set(state.processedEventIds);
        const entityVersionById = { ...state.entityVersionById };

        for (const event of action.payload.timelineEvents) {
          const currentVersion = entityVersionById[event.entityId] ?? 0;

          if (processedEventIds.has(event.eventId) || event.version <= currentVersion) {
            continue;
          }

          processedEventIds.add(event.eventId);
          timelineById[event.eventId] = event;
          timelineIds.push(event.eventId);
          entityVersionById[event.entityId] = event.version;
        }

        state.casesById = nextCasesById;
        state.caseIds = nextCaseIds;
        state.timelineById = timelineById;
        state.timelineIds = timelineIds;
        state.processedEventIds = [...processedEventIds];
        state.entityVersionById = entityVersionById;
      })
      .addCase(loadCaseHistorySnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load case history snapshot.";
      });
  }
});

export const { ingestCaseTimelineEvent } = caseHistorySlice.actions;
export const caseHistoryReducer = caseHistorySlice.reducer;
