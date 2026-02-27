import type { ReactNode } from "react";

interface InputFieldProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly children: ReactNode;
}

/**
 * Zero-shift note:
 * The reserved error slot keeps vertical layout stable when validation text appears.
 */
export function InputField({ id, label, error, children }: InputFieldProps): JSX.Element {
  return (
    <div className="ux-input-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      <p className="ux-field-error-slot" aria-live="polite">
        {error ?? ""}
      </p>
    </div>
  );
}
