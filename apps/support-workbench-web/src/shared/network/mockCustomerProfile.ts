export interface MockCustomerContact {
  contactId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface MockCustomerOrg {
  orgId: string;
  orgName: string;
  segment: "enterprise" | "mid-market" | "consumer";
  region: string;
  accountOwner: string;
}

export interface MockCustomerAsset {
  assetId: string;
  type: "device" | "service" | "subscription";
  name: string;
  status: "active" | "expired" | "trial" | "suspended";
  renewedAt: string;
}

export interface MockCustomerOrder {
  orderId: string;
  amountUsd: number;
  status: "fulfilled" | "pending" | "refunded";
  orderedAt: string;
}

export interface MockCustomerInteraction {
  interactionId: string;
  channel: "chat" | "phone" | "email" | "case";
  summary: string;
  occurredAt: string;
}

export interface MockCustomerProfile {
  customerId: string;
  locale: string;
  tier: "standard" | "premium" | "vip";
  contacts: MockCustomerContact[];
  org: MockCustomerOrg;
  assets: MockCustomerAsset[];
  orders: MockCustomerOrder[];
  subscriptions: MockCustomerAsset[];
  interactionHistory: MockCustomerInteraction[];
  fetchedAt: string;
}

const PROFILE: MockCustomerProfile = {
  customerId: "cust-101",
  locale: "en-US",
  tier: "vip",
  contacts: [
    { contactId: "contact-1", name: "Alex Reed", role: "Primary", email: "alex@example.com", phone: "+1-408-555-1101" },
    { contactId: "contact-2", name: "Jordan Kim", role: "Billing", email: "jordan@example.com", phone: "+1-408-555-1102" },
    { contactId: "contact-3", name: "Taylor Fox", role: "Admin", email: "taylor@example.com", phone: "+1-408-555-1103" }
  ],
  org: {
    orgId: "org-44",
    orgName: "Atlas Retail Group",
    segment: "enterprise",
    region: "US-West",
    accountOwner: "agent-ava"
  },
  assets: Array.from({ length: 8 }, (_, idx) => ({
    assetId: `asset-${idx + 1}`,
    type: idx % 2 === 0 ? "device" : "service",
    name: idx % 2 === 0 ? `MacBook Fleet ${idx + 1}` : `AppleCare Plan ${idx + 1}`,
    status: idx % 3 === 0 ? "trial" : "active",
    renewedAt: `2026-02-${String(6 + idx).padStart(2, "0")}T10:00:00Z`
  })),
  orders: Array.from({ length: 12 }, (_, idx) => ({
    orderId: `order-${3000 + idx}`,
    amountUsd: 199 + idx * 42,
    status: idx % 5 === 0 ? "refunded" : idx % 2 === 0 ? "fulfilled" : "pending",
    orderedAt: `2026-01-${String(10 + idx).padStart(2, "0")}T12:00:00Z`
  })),
  subscriptions: Array.from({ length: 4 }, (_, idx) => ({
    assetId: `sub-${idx + 1}`,
    type: "subscription",
    name: `Support Subscription ${idx + 1}`,
    status: idx % 3 === 0 ? "trial" : "active",
    renewedAt: `2026-03-${String(4 + idx).padStart(2, "0")}T09:00:00Z`
  })),
  interactionHistory: Array.from({ length: 24 }, (_, idx) => ({
    interactionId: `hist-${500 + idx}`,
    channel: (["chat", "phone", "email", "case"] as const)[idx % 4] ?? "case",
    summary: `Interaction summary ${idx + 1}`,
    occurredAt: `2026-02-${String(1 + (idx % 20)).padStart(2, "0")}T${String(8 + (idx % 10)).padStart(2, "0")}:15:00Z`
  })),
  fetchedAt: "2026-02-26T19:18:00Z"
};

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);
    if (!signal) {
      return;
    }
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

export async function fetchMockCustomerProfile(signal?: AbortSignal): Promise<MockCustomerProfile> {
  await delay(150, signal);
  return PROFILE;
}
