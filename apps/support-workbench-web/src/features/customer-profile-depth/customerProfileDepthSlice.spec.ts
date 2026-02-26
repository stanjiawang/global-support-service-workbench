import { describe, expect, it } from "vitest";
import { customerProfileDepthReducer, loadCustomerProfileDepth } from "@features/customer-profile-depth/customerProfileDepthSlice";

describe("customerProfileDepthSlice", () => {
  it("stores loaded profile snapshot", () => {
    let state = customerProfileDepthReducer(undefined, { type: "seed" });
    state = customerProfileDepthReducer(state, {
      type: loadCustomerProfileDepth.fulfilled.type,
      payload: {
        customerId: "cust-101",
        locale: "en-US",
        tier: "vip",
        contacts: [],
        org: { orgId: "org-1", orgName: "Acme", segment: "enterprise", region: "US", accountOwner: "agent-ava" },
        assets: [],
        orders: [],
        subscriptions: [],
        interactionHistory: [],
        fetchedAt: "2026-02-26T19:18:00Z"
      }
    });
    expect(state.status).toBe("ready");
    expect(state.profile?.customerId).toBe("cust-101");
  });
});
