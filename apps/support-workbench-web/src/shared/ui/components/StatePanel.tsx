interface StatePanelProps {
  readonly status: "idle" | "loading" | "ready" | "failed" | "saving";
  readonly error?: string | null;
  readonly emptyHint?: string;
}

/**
 * Zero-shift note:
 * Loading and message states reserve block height so the surrounding layout remains stable.
 */
export function StatePanel({ status, error, emptyHint }: StatePanelProps): JSX.Element | null {
  if (status === "loading" || status === "saving") {
    return (
      <div className="ux-state ux-state-loading ux-liquid-surface" aria-live="polite">
        <div className="ux-skeleton" style={{ minHeight: "18px" }} />
      </div>
    );
  }

  if (status === "failed") {
    return <p className="ux-state ux-state-error ux-liquid-surface">{error ?? "Something went wrong."}</p>;
  }

  if (status === "idle" && emptyHint) {
    return <p className="ux-state ux-state-idle ux-liquid-surface">{emptyHint}</p>;
  }

  return null;
}
