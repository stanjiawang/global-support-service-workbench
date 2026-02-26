export type TransportMode = "websocket" | "sse" | "long-polling";
export const FIXED_TRANSPORT_CHAIN: readonly TransportMode[] = ["websocket", "sse", "long-polling"] as const;

export interface NetworkQualitySignal {
  readonly saveData: boolean;
  readonly roundTripTimeMs: number;
  readonly downlinkMbps: number;
  readonly tabVisible: boolean;
  readonly activeInteraction: boolean;
}

export interface TransportPolicy {
  readonly primary: TransportMode;
  readonly fallbackChain: readonly TransportMode[];
  readonly adaptivePollingEnabled: true;
}

export const DEFAULT_TRANSPORT_POLICY: TransportPolicy = {
  primary: "websocket",
  fallbackChain: FIXED_TRANSPORT_CHAIN,
  adaptivePollingEnabled: true
};

export interface GracefulDegradationPolicy {
  readonly reducePayloadDetail: true;
  readonly deferNonCriticalMedia: true;
  readonly throttlePolling: true;
  readonly preserveCoreWorkflows: readonly ["case-read-write", "interaction-context", "escalation-actions"];
}

export const GRACEFUL_DEGRADATION_POLICY: GracefulDegradationPolicy = {
  reducePayloadDetail: true,
  deferNonCriticalMedia: true,
  throttlePolling: true,
  preserveCoreWorkflows: ["case-read-write", "interaction-context", "escalation-actions"]
};

export interface TransportAvailability {
  readonly websocket: boolean;
  readonly sse: boolean;
  readonly longPolling: boolean;
}

export interface TransportDecision {
  readonly selectedTransport: TransportMode;
  readonly fallbackDepth: number;
  readonly pollingIntervalMs: number;
  readonly degradedMode: boolean;
}

const DEFAULT_TRANSPORT_AVAILABILITY: TransportAvailability = {
  websocket: true,
  sse: true,
  longPolling: true
};

function isDegradedNetwork(signal: NetworkQualitySignal): boolean {
  return signal.saveData || signal.downlinkMbps < 1 || signal.roundTripTimeMs > 500;
}

function isTransportAvailable(mode: TransportMode, availability: TransportAvailability): boolean {
  if (mode === "websocket") {
    return availability.websocket;
  }
  if (mode === "sse") {
    return availability.sse;
  }
  return availability.longPolling;
}

export function resolveTransportDecision(
  signal: NetworkQualitySignal,
  options?: {
    readonly forcePrimaryFailure?: boolean;
    readonly availability?: Partial<TransportAvailability>;
  }
): TransportDecision {
  const availability: TransportAvailability = {
    ...DEFAULT_TRANSPORT_AVAILABILITY,
    ...(options?.availability ?? {})
  };
  const degradedMode = isDegradedNetwork(signal);
  const primaryUnavailable = options?.forcePrimaryFailure === true || !availability.websocket;

  let startIndex = primaryUnavailable ? 1 : 0;
  if (degradedMode) {
    startIndex = Math.max(startIndex, 2);
  }

  let selectedTransport: TransportMode = "long-polling";
  let fallbackDepth = 2;
  for (let index = startIndex; index < FIXED_TRANSPORT_CHAIN.length; index += 1) {
    const candidate = FIXED_TRANSPORT_CHAIN[index];
    if (candidate && isTransportAvailable(candidate, availability)) {
      selectedTransport = candidate;
      fallbackDepth = index;
      break;
    }
  }

  let pollingIntervalMs = 2000;
  if (!signal.tabVisible || !signal.activeInteraction) {
    pollingIntervalMs = 5000;
  }
  if (selectedTransport !== "websocket") {
    pollingIntervalMs = Math.max(pollingIntervalMs, 3500);
  }
  if (degradedMode) {
    pollingIntervalMs = 9000;
  }

  return {
    selectedTransport,
    fallbackDepth,
    pollingIntervalMs,
    degradedMode
  };
}
