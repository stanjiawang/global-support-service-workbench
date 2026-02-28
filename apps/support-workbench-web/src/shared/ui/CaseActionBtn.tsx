import type { ButtonHTMLAttributes, ReactNode } from "react";

type CaseActionIntent = "primary" | "success" | "warning" | "danger" | "secondary";

const INTENT_CLASS: Readonly<Record<CaseActionIntent, string>> = {
  primary: "btn-primary",
  success: "btn-success",
  warning: "btn-warning",
  danger: "btn-danger",
  secondary: "btn-secondary"
};

interface CaseActionBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly intent?: CaseActionIntent;
  readonly icon?: ReactNode;
}

function cx(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function CaseActionBtn({
  intent = "secondary",
  icon,
  className,
  children,
  type = "button",
  ...props
}: CaseActionBtnProps): JSX.Element {
  return (
    <button {...props} type={type} className={cx(INTENT_CLASS[intent], className)}>
      {icon ? (
        <span className="icon-slot" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
