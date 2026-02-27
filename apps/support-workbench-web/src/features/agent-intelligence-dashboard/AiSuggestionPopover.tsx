import { useEffect, useRef } from "react";

interface AiSuggestionPopoverProps {
  ticketId: string;
  suggestion: string | null;
  open: boolean;
  onInsert: () => void;
  onRegenerate: () => void;
  onDismiss: () => void;
}

export function AiSuggestionPopover({
  ticketId,
  suggestion,
  open,
  onInsert,
  onRegenerate,
  onDismiss
}: AiSuggestionPopoverProps): JSX.Element | null {
  const FOCUS_RING = "focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2";
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>("button");
    firstFocusable?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      id={`ai-suggestion-${ticketId}`}
      ref={containerRef}
      role="dialog"
      aria-label="AI suggestion"
      className="ai-suggestion-popover"
    >
      <header className="ai-suggestion-header">
        <span className="ai-sparkle" aria-hidden="true">
          SP
        </span>
        <strong>AI Suggestion</strong>
      </header>
      <p className="ai-subtle">{suggestion ?? "Generating suggestion..."}</p>
      <div className="inline-actions">
        <button
          type="button"
          className={`ai-action-btn ${FOCUS_RING}`}
          onClick={onInsert}
          disabled={suggestion === null || suggestion.length === 0}
        >
          Insert suggestion
        </button>
        <button type="button" className={`ai-action-btn ${FOCUS_RING}`} onClick={onRegenerate}>
          Regenerate
        </button>
        <button type="button" className={`ai-action-btn ${FOCUS_RING}`} onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
