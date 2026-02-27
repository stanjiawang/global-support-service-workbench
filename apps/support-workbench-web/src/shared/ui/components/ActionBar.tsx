import type { ReactNode } from "react";
import { Button } from "@shared/ui/components/Button";
import { UI_TOKENS } from "@shared/ui/tokens";

/**
 * Zero-shift note:
 * Action buttons use pre-allocated borders and transform-only interaction cues, so hover/focus/active
 * states do not change element box metrics and avoid layout reflow.
 */
interface ActionButton {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

interface ActionBarProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly primaryAction?: ActionButton;
  readonly secondaryActions?: readonly ActionButton[];
  readonly extras?: ReactNode;
  readonly sticky?: boolean;
}

export function ActionBar({
  title,
  subtitle,
  primaryAction,
  secondaryActions = [],
  extras,
  sticky = false
}: ActionBarProps): JSX.Element {
  return (
    <header className={sticky ? "ux-action-bar ux-action-bar-sticky" : "ux-action-bar"}>
      <div>
        <h2 className={UI_TOKENS.typography.title}>{title}</h2>
        {subtitle ? <p className={UI_TOKENS.typography.subtitle}>{subtitle}</p> : null}
      </div>
      <div className="ux-action-group">
        {extras}
        {secondaryActions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            disabled={action.disabled}
            variant="secondary"
          >
            {action.label}
          </Button>
        ))}
        {primaryAction ? (
          <Button onClick={primaryAction.onClick} disabled={primaryAction.disabled} variant="primary">
            {primaryAction.label}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
