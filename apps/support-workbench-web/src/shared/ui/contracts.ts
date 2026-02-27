export type PageIntent = "triage" | "investigation" | "resolution" | "governance" | "operations";

export type DensityMode = "comfortable" | "compact";

export type ContextStatus = "ready" | "refreshing" | "degraded" | "error";

export type SpacingTier = "xs" | "sm" | "md" | "lg" | "xl";

export type SurfaceVariant = "solid" | "glass" | "muted";
export type LiquidSurfaceVariant = "liquid_card" | "liquid_glass" | "liquid_rail";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ControlDensity = "compact";
export type IconTextAlignment = "liquid_default";
export type InteractionStabilityMode = "zero_shift";
export type FieldValidationSlot = "reserved";
export type LoadingPlaceholderMode = "skeleton_reserved";
export type SegmentKey = string;

export interface SegmentConfig {
  readonly key: SegmentKey;
  readonly label: string;
}

export type StatusBadgeVariant =
  | "new"
  | "open"
  | "pending"
  | "resolved"
  | "closed"
  | "healthy"
  | "at-risk"
  | "breached";

export interface PrimaryAction {
  readonly label: string;
  readonly actionId: string;
}

export interface RouteUxContract {
  readonly title: string;
  readonly intent: PageIntent;
  readonly contextDependency: "ticket" | "customer" | "queue" | "none";
  readonly density: DensityMode;
}
