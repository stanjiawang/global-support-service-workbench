import type { ButtonHTMLAttributes, ReactNode } from "react";
import { UI_TOKENS } from "@shared/ui/tokens";

type ButtonVariant = "primary" | "secondary" | "success" | "warning" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const ZERO_SHIFT_CLASSES = "ux-zero-shift-border ux-zero-shift-focus ux-zero-shift-interactive";

const VARIANT_CLASSES: Readonly<Record<ButtonVariant, string>> = {
  primary: UI_TOKENS.interactive.buttonPrimary,
  secondary: UI_TOKENS.interactive.buttonSecondary,
  success: UI_TOKENS.interactive.buttonSuccess,
  warning: UI_TOKENS.interactive.buttonWarning,
  danger: UI_TOKENS.interactive.buttonDanger
};

export function Button({ children, className, type = "button", variant = "secondary", ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      type={type}
      className={cx(VARIANT_CLASSES[variant], UI_TOKENS.interactive.ring, ZERO_SHIFT_CLASSES, className)}
    >
      {children}
    </button>
  );
}
