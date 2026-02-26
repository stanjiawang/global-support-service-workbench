import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockTicketDetail, fetchMockTicketDirectory, type MockTicketDetailRecord } from "@shared/network/mockTicketDetail";

interface TicketDetailState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  selectedTicketId: string;
  availableTicketIds: string[];
  detailsById: Record<string, MockTicketDetailRecord>;
  fetchedAt: string | null;
}

const initialState: TicketDetailState = {
  status: "idle",
  error: null,
  selectedTicketId: "TKT-1201",
  availableTicketIds: [],
  detailsById: {},
  fetchedAt: null
};

export const loadTicketDirectory = createAsyncThunk("ticketDetail/loadDirectory", async (_, { signal }) => {
  return fetchMockTicketDirectory(signal);
});

export const loadTicketDetail = createAsyncThunk("ticketDetail/loadDetail", async (ticketId: string, { signal }) => {
  return fetchMockTicketDetail(ticketId, signal);
});

const ticketDetailSlice = createSlice({
  name: "ticketDetail",
  initialState,
  reducers: {
    setSelectedTicketId(state, action: PayloadAction<string>) {
      state.selectedTicketId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTicketDirectory.fulfilled, (state, action) => {
        state.availableTicketIds = action.payload;
      })
      .addCase(loadTicketDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadTicketDetail.fulfilled, (state, action) => {
        const detail = action.payload;
        state.status = "ready";
        state.selectedTicketId = detail.ticketId;
        state.detailsById[detail.ticketId] = detail;
        state.fetchedAt = new Date().toISOString();
      })
      .addCase(loadTicketDetail.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load ticket detail.";
      });
  }
});

export const { setSelectedTicketId } = ticketDetailSlice.actions;
export const ticketDetailReducer = ticketDetailSlice.reducer;
