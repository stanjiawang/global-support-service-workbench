import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

const selectSlice = (state: RootState) => state.customerProfileDepth;

export const selectCustomerProfileDepthSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    error: slice.error,
    customerId: slice.profile?.customerId ?? "N/A",
    tier: slice.profile?.tier ?? "N/A",
    contacts: slice.profile?.contacts.length ?? 0,
    assets: slice.profile?.assets.length ?? 0,
    orders: slice.profile?.orders.length ?? 0,
    subscriptions: slice.profile?.subscriptions.length ?? 0,
    interactions: slice.profile?.interactionHistory.length ?? 0
  };
});

export const selectCustomerProfileDepth = createSelector([selectSlice], (slice) => slice.profile);
