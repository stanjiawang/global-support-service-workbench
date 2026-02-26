import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMockPermissionsSnapshot,
  type MockAuditControl,
  type MockComplianceControl,
  type MockFieldAccess,
  type MockRolePermission
} from "@shared/network/mockPermissionsRbac";

interface PermissionsRbacState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  roles: MockRolePermission[];
  fieldAccess: MockFieldAccess[];
  compliance: MockComplianceControl[];
  auditControls: MockAuditControl[];
  selectedRoleId: string;
  fetchedAt: string | null;
}

const initialState: PermissionsRbacState = {
  status: "idle",
  error: null,
  roles: [],
  fieldAccess: [],
  compliance: [],
  auditControls: [],
  selectedRoleId: "",
  fetchedAt: null
};

export const loadPermissionsRbac = createAsyncThunk("permissionsRbac/load", async (_, { signal }) => {
  return fetchMockPermissionsSnapshot(signal);
});

const permissionsRbacSlice = createSlice({
  name: "permissionsRbac",
  initialState,
  reducers: {
    setSelectedRoleId(state, action: PayloadAction<string>) {
      state.selectedRoleId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPermissionsRbac.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadPermissionsRbac.fulfilled, (state, action) => {
        state.status = "ready";
        state.roles = action.payload.roles;
        state.fieldAccess = action.payload.fieldAccess;
        state.compliance = action.payload.compliance;
        state.auditControls = action.payload.auditControls;
        state.selectedRoleId = state.selectedRoleId || action.payload.roles[0]?.roleId || "";
        state.fetchedAt = action.payload.fetchedAt;
      })
      .addCase(loadPermissionsRbac.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load permissions and RBAC.";
      });
  }
});

export const { setSelectedRoleId } = permissionsRbacSlice.actions;
export const permissionsRbacReducer = permissionsRbacSlice.reducer;
