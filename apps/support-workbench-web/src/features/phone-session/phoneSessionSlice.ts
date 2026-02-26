import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMockPhoneTransportSnapshot } from "@shared/network/mockBackend";
import { DEFAULT_TRANSPORT_POLICY, type TransportMode } from "@shared/network/transportPolicy";
import {
  getPhoneNetworkProfile,
  resolveTransport,
  type PhoneNetworkProfileId
} from "@shared/network/transportSimulator";

interface PhoneSessionState {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly error: string | null;
  readonly selectedProfileId: PhoneNetworkProfileId;
  readonly forcePrimaryFailure: boolean;
  readonly selectedTransport: TransportMode;
  readonly fallbackDepth: number;
  readonly pollingIntervalMs: number;
  readonly degradedMode: boolean;
  readonly queueDepth: number;
  readonly activeCalls: number;
  readonly reconnectAttempts: number;
  readonly fetchedAt: string | null;
}

const initialState: PhoneSessionState = {
  status: "idle",
  error: null,
  selectedProfileId: "good",
  forcePrimaryFailure: false,
  selectedTransport: DEFAULT_TRANSPORT_POLICY.primary,
  fallbackDepth: 0,
  pollingIntervalMs: 2000,
  degradedMode: false,
  queueDepth: 0,
  activeCalls: 0,
  reconnectAttempts: 0,
  fetchedAt: null
};

export const loadPhoneSessionSnapshot = createAsyncThunk(
  "phoneSession/loadSnapshot",
  async (_, { getState, signal }) => {
    const state = getState() as { phoneSession: PhoneSessionState };
    const profile = getPhoneNetworkProfile(state.phoneSession.selectedProfileId);
    const snapshot = await fetchMockPhoneTransportSnapshot(signal);
    const resolution = resolveTransport(
      profile.signal,
      state.phoneSession.forcePrimaryFailure
    );

    return {
      profile,
      snapshot,
      resolution
    };
  }
);

const phoneSessionSlice = createSlice({
  name: "phoneSession",
  initialState,
  reducers: {
    setPhoneNetworkProfile(state, action: PayloadAction<PhoneNetworkProfileId>) {
      state.selectedProfileId = action.payload;
    },
    setPhonePrimaryFailure(state, action: PayloadAction<boolean>) {
      state.forcePrimaryFailure = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPhoneSessionSnapshot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadPhoneSessionSnapshot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTransport = action.payload.resolution.selectedTransport;
        state.fallbackDepth = action.payload.resolution.fallbackDepth;
        state.pollingIntervalMs = action.payload.resolution.pollingIntervalMs;
        state.degradedMode = action.payload.resolution.degradedMode;
        state.queueDepth = action.payload.snapshot.queueDepth;
        state.activeCalls = action.payload.snapshot.activeCalls;
        state.reconnectAttempts = action.payload.snapshot.reconnectAttempts;
        state.fetchedAt = action.payload.snapshot.fetchedAt;
      })
      .addCase(loadPhoneSessionSnapshot.rejected, (state, action) => {
        if (action.error.name === "AbortError") {
          state.status = "idle";
          return;
        }

        state.status = "failed";
        state.error = action.error.message ?? "Unable to load phone transport snapshot.";
      });
  }
});

export const { setPhoneNetworkProfile, setPhonePrimaryFailure } = phoneSessionSlice.actions;
export const phoneSessionReducer = phoneSessionSlice.reducer;
