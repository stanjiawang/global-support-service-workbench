import type { AppDispatch } from "@app/providers/store";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";
import type { FeatureRoute } from "@app/routing/routes";

export type UxEventName =
  | "ui.route_loaded"
  | "ui.primary_action_clicked"
  | "ui.search_executed"
  | "ui.ticket_selected"
  | "ui.status_update_optimistic"
  | "ui.status_update_rollback"
  | "ui.keyboard_navigation_used"
  | "ui.a11y_announcement_emitted";

export function emitUxEvent(
  dispatch: AppDispatch,
  params: {
    readonly eventName: UxEventName;
    readonly feature: FeatureRoute | string;
    readonly latencyMs?: number;
    readonly status?: "ok" | "degraded" | "error";
  }
): void {
  const base = {
    eventName: params.eventName,
    feature: params.feature,
    latencyMs: params.latencyMs ?? 0
  };
  emitTelemetry(
    dispatch,
    params.status
      ? {
          ...base,
          status: params.status
        }
      : base
  );
}
