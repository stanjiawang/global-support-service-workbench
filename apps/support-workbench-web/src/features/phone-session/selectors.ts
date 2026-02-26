import type { RootState } from "@app/providers/store";
import { getPhoneNetworkProfile } from "@shared/network/transportSimulator";

export interface PhoneSessionSummary {
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly profileLabel: string;
  readonly forcePrimaryFailure: boolean;
  readonly selectedTransport: string;
  readonly fallbackDepth: number;
  readonly pollingIntervalMs: number;
  readonly degradedMode: boolean;
  readonly queueDepth: number;
  readonly activeCalls: number;
  readonly reconnectAttempts: number;
  readonly fetchedAt: string | null;
}

export function selectPhoneSessionSummary(state: RootState): PhoneSessionSummary {
  const profile = getPhoneNetworkProfile(state.phoneSession.selectedProfileId);

  return {
    status: state.phoneSession.status,
    profileLabel: profile.label,
    forcePrimaryFailure: state.phoneSession.forcePrimaryFailure,
    selectedTransport: state.phoneSession.selectedTransport,
    fallbackDepth: state.phoneSession.fallbackDepth,
    pollingIntervalMs: state.phoneSession.pollingIntervalMs,
    degradedMode: state.phoneSession.degradedMode,
    queueDepth: state.phoneSession.queueDepth,
    activeCalls: state.phoneSession.activeCalls,
    reconnectAttempts: state.phoneSession.reconnectAttempts,
    fetchedAt: state.phoneSession.fetchedAt
  };
}
