export enum StatusType {
  New = "new",
  Open = "open",
  Pending = "pending",
  Resolved = "resolved",
  Closed = "closed",
  Ready = "ready",
  Loading = "loading",
  Refreshing = "refreshing",
  Saving = "saving",
  Idle = "idle",
  Failed = "failed",
  Error = "error",
  Degraded = "degraded",
  Healthy = "healthy",
  AtRisk = "at-risk",
  Breached = "breached",
  Available = "available",
  Busy = "busy",
  Break = "break",
  Offline = "offline",
  Info = "info",
  Unknown = "unknown"
}

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";
export type StatusBadgeVariant = "subtle" | "solid";
export type StatusBadgeSize = "compact";

const STATUS_META: Record<StatusType, { label: string; tone: StatusTone; critical?: boolean }> = {
  [StatusType.New]: { label: "New", tone: "info" },
  [StatusType.Open]: { label: "Open", tone: "success" },
  [StatusType.Pending]: { label: "Pending", tone: "warning" },
  [StatusType.Resolved]: { label: "Resolved", tone: "success" },
  [StatusType.Closed]: { label: "Closed", tone: "neutral" },
  [StatusType.Ready]: { label: "Ready", tone: "success" },
  [StatusType.Loading]: { label: "Loading", tone: "info" },
  [StatusType.Refreshing]: { label: "Refreshing", tone: "info" },
  [StatusType.Saving]: { label: "Saving", tone: "warning" },
  [StatusType.Idle]: { label: "Idle", tone: "info" },
  [StatusType.Failed]: { label: "Failed", tone: "error", critical: true },
  [StatusType.Error]: { label: "Error", tone: "error", critical: true },
  [StatusType.Degraded]: { label: "Degraded", tone: "warning" },
  [StatusType.Healthy]: { label: "Healthy", tone: "success" },
  [StatusType.AtRisk]: { label: "At Risk", tone: "warning" },
  [StatusType.Breached]: { label: "Breached", tone: "error", critical: true },
  [StatusType.Available]: { label: "Available", tone: "success" },
  [StatusType.Busy]: { label: "Busy", tone: "error" },
  [StatusType.Break]: { label: "Break", tone: "warning" },
  [StatusType.Offline]: { label: "Offline", tone: "neutral" },
  [StatusType.Info]: { label: "Info", tone: "info" },
  [StatusType.Unknown]: { label: "Unknown", tone: "neutral" }
};

const STRING_TO_STATUS: Record<string, StatusType> = {
  new: StatusType.New,
  open: StatusType.Open,
  pending: StatusType.Pending,
  resolved: StatusType.Resolved,
  closed: StatusType.Closed,
  active: StatusType.Open,
  ready: StatusType.Ready,
  succeeded: StatusType.Ready,
  loading: StatusType.Loading,
  refreshing: StatusType.Refreshing,
  saving: StatusType.Saving,
  idle: StatusType.Idle,
  failed: StatusType.Failed,
  fail: StatusType.Failed,
  error: StatusType.Error,
  degraded: StatusType.Degraded,
  warning: StatusType.AtRisk,
  warn: StatusType.AtRisk,
  healthy: StatusType.Healthy,
  ok: StatusType.Healthy,
  pass: StatusType.Healthy,
  success: StatusType.Healthy,
  "at-risk": StatusType.AtRisk,
  at_risk: StatusType.AtRisk,
  breached: StatusType.Breached,
  expired: StatusType.Closed,
  suspended: StatusType.AtRisk,
  trial: StatusType.Pending,
  available: StatusType.Available,
  busy: StatusType.Busy,
  break: StatusType.Break,
  offline: StatusType.Offline,
  info: StatusType.Info
};

export function statusFromValue(value: string): StatusType {
  return STRING_TO_STATUS[value.trim().toLowerCase()] ?? StatusType.Unknown;
}

function toneClass(tone: StatusTone, variant: StatusBadgeVariant): string {
  if (variant === "solid") return "status-solid";
  if (tone === "success") return "status-success-subtle";
  if (tone === "warning") return "status-warning-subtle";
  if (tone === "error") return "status-error-subtle";
  if (tone === "info") return "status-info-subtle";
  return "status-neutral-subtle";
}

/**
 * Visual Consistency Guide:
 * Fixed minimum width (100px) with centered content removes ragged edges in dense lists.
 * This improves rapid vertical scanning because status columns align to a stable visual rhythm.
 */
export function StatusBadge({
  status,
  variant,
  ariaLabel,
  className
}: {
  readonly status: StatusType;
  readonly variant?: StatusBadgeVariant;
  readonly ariaLabel?: string;
  readonly className?: string;
}): JSX.Element {
  const meta = STATUS_META[status] ?? STATUS_META[StatusType.Unknown];
  const resolvedVariant: StatusBadgeVariant = variant ?? (meta.critical ? "solid" : "subtle");
  const classes = [
    "badge-base",
    toneClass(meta.tone, resolvedVariant),
    className ?? ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span role="status" aria-label={ariaLabel ?? `Status: ${meta.label}`} className={classes}>
      {meta.label}
    </span>
  );
}
