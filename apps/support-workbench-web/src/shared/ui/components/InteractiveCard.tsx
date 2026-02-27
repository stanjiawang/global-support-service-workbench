import type { MouseEventHandler, ReactNode } from "react";

interface InteractiveCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly interactive?: boolean;
  readonly onClick?: MouseEventHandler<HTMLButtonElement>;
  readonly ariaLabel?: string;
  readonly disabled?: boolean;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const BASE_CARD_CLASS =
  "feature-panel apple-spring text-left hover:scale-[1.015] active:scale-[0.98] duration-snappy ease-apple-standard";

export function InteractiveCard({
  children,
  className,
  interactive,
  onClick,
  ariaLabel,
  disabled = false
}: InteractiveCardProps): JSX.Element {
  const isInteractive = interactive ?? Boolean(onClick);
  const classes = cx(BASE_CARD_CLASS, className);

  if (isInteractive) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
        {children}
      </button>
    );
  }

  return (
    <div className={cx("feature-panel", className)} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
