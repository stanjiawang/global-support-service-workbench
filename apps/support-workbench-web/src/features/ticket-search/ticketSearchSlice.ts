import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockTicketSearchIndex, type MockTicketRecord, type TicketStatus } from "@shared/network/mockTicketSearch";

export interface TicketSearchFilters {
  readonly ticketId: string;
  readonly customerId: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly status: "" | TicketStatus;
  readonly tags: string[];
  readonly assignee: string;
  readonly dateFrom: string;
  readonly dateTo: string;
}

interface TicketSearchState {
  readonly status: "idle" | "loading" | "ready" | "failed";
  readonly error: string | null;
  readonly ticketsById: Record<string, MockTicketRecord>;
  readonly ticketIds: readonly string[];
  readonly filters: TicketSearchFilters;
  readonly fetchedAt: string | null;
}

const DEFAULT_FILTERS: TicketSearchFilters = {
  ticketId: "",
  customerId: "",
  customerEmail: "",
  customerPhone: "",
  status: "",
  tags: [],
  assignee: "",
  dateFrom: "",
  dateTo: ""
};

const initialState: TicketSearchState = {
  status: "idle",
  error: null,
  ticketsById: {},
  ticketIds: [],
  filters: DEFAULT_FILTERS,
  fetchedAt: null
};

export const loadTicketSearchIndex = createAsyncThunk("ticketSearch/loadIndex", async (_, { signal }) => {
  return fetchMockTicketSearchIndex(signal);
});

const ticketSearchSlice = createSlice({
  name: "ticketSearch",
  initialState,
  reducers: {
    setTicketSearchFilters(state, action: PayloadAction<Partial<TicketSearchFilters>>) {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetTicketSearchFilters(state) {
      state.filters = DEFAULT_FILTERS;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTicketSearchIndex.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadTicketSearchIndex.fulfilled, (state, action) => {
        const nextById: Record<string, MockTicketRecord> = {};
        const nextIds: string[] = [];

        for (const ticket of action.payload) {
          nextById[ticket.ticketId] = ticket;
          nextIds.push(ticket.ticketId);
        }

        state.status = "ready";
        state.ticketsById = nextById;
        state.ticketIds = nextIds;
        state.fetchedAt = new Date().toISOString();
      })
      .addCase(loadTicketSearchIndex.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load ticket index.";
      });
  }
});

export const { setTicketSearchFilters, resetTicketSearchFilters } = ticketSearchSlice.actions;
export const ticketSearchReducer = ticketSearchSlice.reducer;
