import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockTicketSearchIndex, type TicketStatus } from "@shared/network/mockTicketSearch";

export interface WorkspaceTicketRecord {
  ticketId: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  status: TicketStatus;
  tags: string[];
  assignee: string;
  updatedAt: string;
  createdAt: string;
}

export interface TicketWorkspaceFilters {
  query: string;
  status: "" | TicketStatus;
  assignee: string;
  tags: string[];
}

export interface SavedTicketView {
  id: string;
  name: string;
  filters: TicketWorkspaceFilters;
  sortBy: "updatedAt" | "ticketId" | "status";
  sortDirection: "asc" | "desc";
}

interface TicketWorkspaceState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  ticketsById: Record<string, WorkspaceTicketRecord>;
  ticketIds: string[];
  filters: TicketWorkspaceFilters;
  sortBy: "updatedAt" | "ticketId" | "status";
  sortDirection: "asc" | "desc";
  selectedIds: string[];
  savedViews: SavedTicketView[];
  activeViewId: string | null;
}

const initialFilters: TicketWorkspaceFilters = {
  query: "",
  status: "",
  assignee: "",
  tags: []
};

const initialState: TicketWorkspaceState = {
  status: "idle",
  error: null,
  ticketsById: {},
  ticketIds: [],
  filters: initialFilters,
  sortBy: "updatedAt",
  sortDirection: "desc",
  selectedIds: [],
  savedViews: [],
  activeViewId: null
};

export const loadTicketWorkspaceIndex = createAsyncThunk("ticketWorkspace/loadIndex", async (_, { signal }) => {
  return fetchMockTicketSearchIndex(signal);
});

const ticketWorkspaceSlice = createSlice({
  name: "ticketWorkspace",
  initialState,
  reducers: {
    setTicketWorkspaceFilters(state, action: PayloadAction<Partial<TicketWorkspaceFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.activeViewId = null;
    },
    setTicketWorkspaceSort(
      state,
      action: PayloadAction<{ sortBy: TicketWorkspaceState["sortBy"]; sortDirection: TicketWorkspaceState["sortDirection"] }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
      state.activeViewId = null;
    },
    resetTicketWorkspaceFilters(state) {
      state.filters = initialFilters;
      state.activeViewId = null;
    },
    toggleTicketSelection(state, action: PayloadAction<string>) {
      const ticketId = action.payload;
      const next = new Set(state.selectedIds);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      state.selectedIds = [...next];
    },
    clearTicketSelection(state) {
      state.selectedIds = [];
    },
    selectTicketsByIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    applyBulkStatus(state, action: PayloadAction<TicketStatus>) {
      for (const ticketId of state.selectedIds) {
        const ticket = state.ticketsById[ticketId];
        if (!ticket) {
          continue;
        }
        ticket.status = action.payload;
      }
    },
    applyBulkAssignee(state, action: PayloadAction<string>) {
      const assignee = action.payload.trim();
      if (!assignee) {
        return;
      }
      for (const ticketId of state.selectedIds) {
        const ticket = state.ticketsById[ticketId];
        if (!ticket) {
          continue;
        }
        ticket.assignee = assignee;
      }
    },
    saveCurrentView(state, action: PayloadAction<string>) {
      const name = action.payload.trim();
      if (!name) {
        return;
      }
      const id = `view-${Date.now()}`;
      state.savedViews = [
        ...state.savedViews,
        { id, name, filters: state.filters, sortBy: state.sortBy, sortDirection: state.sortDirection }
      ];
      state.activeViewId = id;
    },
    applySavedView(state, action: PayloadAction<string>) {
      const found = state.savedViews.find((view) => view.id === action.payload);
      if (!found) {
        return;
      }
      state.filters = found.filters;
      state.sortBy = found.sortBy;
      state.sortDirection = found.sortDirection;
      state.activeViewId = found.id;
      state.selectedIds = [];
    },
    deleteSavedView(state, action: PayloadAction<string>) {
      state.savedViews = state.savedViews.filter((view) => view.id !== action.payload);
      if (state.activeViewId === action.payload) {
        state.activeViewId = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTicketWorkspaceIndex.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadTicketWorkspaceIndex.fulfilled, (state, action) => {
        const byId: Record<string, WorkspaceTicketRecord> = {};
        const ids: string[] = [];
        for (const ticket of action.payload) {
          byId[ticket.ticketId] = { ...ticket } as WorkspaceTicketRecord;
          ids.push(ticket.ticketId);
        }
        state.status = "ready";
        state.ticketsById = byId;
        state.ticketIds = ids;
      })
      .addCase(loadTicketWorkspaceIndex.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load ticket workspace data.";
      });
  }
});

export const {
  setTicketWorkspaceFilters,
  setTicketWorkspaceSort,
  resetTicketWorkspaceFilters,
  toggleTicketSelection,
  clearTicketSelection,
  selectTicketsByIds,
  applyBulkStatus,
  applyBulkAssignee,
  saveCurrentView,
  applySavedView,
  deleteSavedView
} = ticketWorkspaceSlice.actions;

export const ticketWorkspaceReducer = ticketWorkspaceSlice.reducer;
