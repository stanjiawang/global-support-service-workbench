import type { ReactNode } from "react";

interface FilterBarProps {
  readonly title: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export function FilterBar({ title, actions, children }: FilterBarProps): JSX.Element {
  return (
    <section className="ux-filter-bar ux-liquid-surface" aria-label={title}>
      <div className="ux-filter-header">
        <h3 className="ai-subheading">{title}</h3>
        {actions ? <div className="inline-actions">{actions}</div> : null}
      </div>
      <div className="ux-filter-grid">{children}</div>
    </section>
  );
}
