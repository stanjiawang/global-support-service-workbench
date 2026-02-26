import { describe, expect, it } from "vitest";
import {
  DEFAULT_TRANSPORT_POLICY,
  FIXED_TRANSPORT_CHAIN,
  GRACEFUL_DEGRADATION_POLICY,
  resolveTransportDecision,
  type NetworkQualitySignal
} from "@shared/network/transportPolicy";

function signal(overrides?: Partial<NetworkQualitySignal>): NetworkQualitySignal {
  return {
    saveData: false,
    roundTripTimeMs: 45,
    downlinkMbps: 25,
    tabVisible: true,
    activeInteraction: true,
    ...overrides
  };
}

describe("transportPolicy", () => {
  it("keeps the fixed fallback chain websocket -> sse -> long-polling", () => {
    expect(FIXED_TRANSPORT_CHAIN).toEqual(["websocket", "sse", "long-polling"]);
    expect(DEFAULT_TRANSPORT_POLICY.fallbackChain).toEqual(FIXED_TRANSPORT_CHAIN);
  });

  it("falls back to sse when primary transport fails", () => {
    const decision = resolveTransportDecision(signal(), {
      forcePrimaryFailure: true
    });

    expect(decision.selectedTransport).toBe("sse");
    expect(decision.fallbackDepth).toBe(1);
    expect(decision.pollingIntervalMs).toBe(3500);
  });

  it("forces long-polling under degraded networks", () => {
    const decision = resolveTransportDecision(
      signal({
        saveData: true,
        roundTripTimeMs: 640,
        downlinkMbps: 0.5
      })
    );

    expect(decision.degradedMode).toBe(true);
    expect(decision.selectedTransport).toBe("long-polling");
    expect(decision.fallbackDepth).toBe(2);
    expect(decision.pollingIntervalMs).toBe(9000);
  });

  it("keeps long-polling as final fallback when websocket and sse are unavailable", () => {
    const decision = resolveTransportDecision(signal(), {
      availability: {
        websocket: false,
        sse: false
      }
    });

    expect(decision.selectedTransport).toBe("long-polling");
    expect(decision.fallbackDepth).toBe(2);
  });

  it("preserves core workflows in graceful degradation mode", () => {
    expect(GRACEFUL_DEGRADATION_POLICY.preserveCoreWorkflows).toEqual([
      "case-read-write",
      "interaction-context",
      "escalation-actions"
    ]);
  });
});
