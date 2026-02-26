import { resolveTransportDecision, type NetworkQualitySignal, type TransportMode } from "@shared/network/transportPolicy";

export type PhoneNetworkProfileId = "good" | "constrained" | "degraded";

export interface PhoneNetworkProfile {
  readonly id: PhoneNetworkProfileId;
  readonly label: string;
  readonly signal: NetworkQualitySignal;
}

export interface TransportResolution {
  readonly selectedTransport: TransportMode;
  readonly fallbackDepth: number;
  readonly pollingIntervalMs: number;
  readonly degradedMode: boolean;
}

export const PHONE_NETWORK_PROFILES: readonly PhoneNetworkProfile[] = [
  {
    id: "good",
    label: "Good network",
    signal: {
      saveData: false,
      roundTripTimeMs: 45,
      downlinkMbps: 25,
      tabVisible: true,
      activeInteraction: true
    }
  },
  {
    id: "constrained",
    label: "Constrained network",
    signal: {
      saveData: true,
      roundTripTimeMs: 220,
      downlinkMbps: 1.8,
      tabVisible: true,
      activeInteraction: true
    }
  },
  {
    id: "degraded",
    label: "Degraded network",
    signal: {
      saveData: true,
      roundTripTimeMs: 640,
      downlinkMbps: 0.4,
      tabVisible: false,
      activeInteraction: false
    }
  }
];

export function getPhoneNetworkProfile(profileId: PhoneNetworkProfileId): PhoneNetworkProfile {
  const profile = PHONE_NETWORK_PROFILES.find((item) => item.id === profileId);
  return profile ?? PHONE_NETWORK_PROFILES[0]!;
}

export function resolveTransport(
  signal: NetworkQualitySignal,
  forcePrimaryFailure: boolean
): TransportResolution {
  return resolveTransportDecision(signal, {
    forcePrimaryFailure
  });
}
