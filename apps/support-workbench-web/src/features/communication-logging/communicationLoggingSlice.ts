import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockCommunicationSnapshot,
  type MockTranscriptMessage,
  type MockTranscriptThread
} from "@shared/network/mockCommunicationLogging";

interface CommunicationLoggingState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  threadsById: Record<string, MockTranscriptThread>;
  threadIds: string[];
  messagesById: Record<string, MockTranscriptMessage>;
  messageIdsByThread: Record<string, string[]>;
  selectedThreadId: string;
  fetchedAt: string | null;
}

const initialState: CommunicationLoggingState = {
  status: "idle",
  error: null,
  threadsById: {},
  threadIds: [],
  messagesById: {},
  messageIdsByThread: {},
  selectedThreadId: "",
  fetchedAt: null
};

export const loadCommunicationSnapshot = createAsyncThunk("communicationLogging/load", async (_, { signal }) => {
  return fetchMockCommunicationSnapshot(signal);
});

const communicationLoggingSlice = createSlice({
  name: "communicationLogging",
  initialState,
  reducers: {
    setSelectedThreadId(state, action: PayloadAction<string>) {
      state.selectedThreadId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCommunicationSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCommunicationSnapshot.fulfilled, (state, action) => {
        const threadsById: Record<string, MockTranscriptThread> = {};
        const threadIds: string[] = [];
        for (const thread of action.payload.threads) {
          threadsById[thread.threadId] = thread;
          threadIds.push(thread.threadId);
        }

        const messagesById: Record<string, MockTranscriptMessage> = {};
        const messageIdsByThread: Record<string, string[]> = {};
        for (const message of action.payload.messages) {
          messagesById[message.messageId] = message;
          messageIdsByThread[message.threadId] = [...(messageIdsByThread[message.threadId] ?? []), message.messageId];
        }

        state.status = "ready";
        state.threadsById = threadsById;
        state.threadIds = threadIds;
        state.messagesById = messagesById;
        state.messageIdsByThread = messageIdsByThread;
        state.selectedThreadId = state.selectedThreadId || threadIds[0] || "";
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadCommunicationSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load communication logs.";
      });
  }
});

export const { setSelectedThreadId } = communicationLoggingSlice.actions;
export const communicationLoggingReducer = communicationLoggingSlice.reducer;
