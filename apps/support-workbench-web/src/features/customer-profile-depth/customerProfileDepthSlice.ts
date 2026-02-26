import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMockCustomerProfile, type MockCustomerProfile } from "@shared/network/mockCustomerProfile";

interface CustomerProfileDepthState {
  status: "idle" | "loading" | "ready" | "failed";
  error: string | null;
  profile: MockCustomerProfile | null;
}

const initialState: CustomerProfileDepthState = {
  status: "idle",
  error: null,
  profile: null
};

export const loadCustomerProfileDepth = createAsyncThunk("customerProfileDepth/load", async (_, { signal }) => {
  return fetchMockCustomerProfile(signal);
});

const customerProfileDepthSlice = createSlice({
  name: "customerProfileDepth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomerProfileDepth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCustomerProfileDepth.fulfilled, (state, action) => {
        state.status = "ready";
        state.profile = action.payload;
      })
      .addCase(loadCustomerProfileDepth.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error.message ?? "Unable to load customer profile depth.";
      });
  }
});

export const customerProfileDepthReducer = customerProfileDepthSlice.reducer;
