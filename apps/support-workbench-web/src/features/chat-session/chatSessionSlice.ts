import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockChatSessionSnapshot } from "@shared/network/mockBackend";
import type { Interaction, TimelineEvent } from "@shared/types/entities";

interface ChatSessionState {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly error: string | null;
  readonly snapshotVersion: number;
  readonly interactionsById: Record<string, Interaction>;
  readonly interactionIds: readonly string[];
  readonly timelineById: Record<string, TimelineEvent>;
  readonly timelineIds: readonly string[];
  readonly processedEventIds: readonly string[];
  readonly entityVersionById: Record<string, number>;
  readonly lastFetchedAt: string | null;
  readonly lastIngestionOutcome: "accepted" | "rejected-idempotent" | "rejected-stale" | null;
  readonly lastIngestionEventId: string | null;
}

const initialState: ChatSessionState = {
  status: "idle",
  error: null,
  snapshotVersion: 0,
  interactionsById: {},
  interactionIds: [],
  timelineById: {},
  timelineIds: [],
  processedEventIds: [],
  entityVersionById: {},
  lastFetchedAt: null,
  lastIngestionOutcome: null,
  lastIngestionEventId: null
};

export const loadChatSessionSnapshot = createAsyncThunk("chatSession/loadSnapshot", async (_, { signal }) => {
  return fetchMockChatSessionSnapshot(signal);
});

const chatSessionSlice = createSlice({
  name: "chatSession",
  initialState,
  reducers: {
    ingestChatTimelineEvent(state, action: PayloadAction<TimelineEvent>) {
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
      .addCase(loadChatSessionSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadChatSessionSnapshot.fulfilled, (state, action) => {
        if (action.payload.version < state.snapshotVersion) {
          return;
        }

        state.status = "succeeded";
        state.snapshotVersion = action.payload.version;
        state.lastFetchedAt = action.payload.fetchedAt;

        const interactionsById: Record<string, Interaction> = {};
        const interactionIds: string[] = [];

        for (const interaction of action.payload.interactions) {
          interactionsById[interaction.interactionId] = interaction;
          interactionIds.push(interaction.interactionId);
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

        state.interactionsById = interactionsById;
        state.interactionIds = interactionIds;
        state.timelineById = timelineById;
        state.timelineIds = timelineIds;
        state.processedEventIds = [...processedEventIds];
        state.entityVersionById = entityVersionById;
      })
      .addCase(loadChatSessionSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load chat session snapshot.";
      });
  }
});

export const { ingestChatTimelineEvent } = chatSessionSlice.actions;
export const chatSessionReducer = chatSessionSlice.reducer;
