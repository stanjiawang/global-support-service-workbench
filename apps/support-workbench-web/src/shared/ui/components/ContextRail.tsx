interface ContextRailItem {
  readonly label: string;
  readonly value: string;
}

interface ContextRailProps {
  readonly title: string;
  readonly status: string;
  readonly items: readonly ContextRailItem[];
}

export function ContextRail({ title, status, items }: ContextRailProps): JSX.Element {
  return (
    <aside className="ux-context-rail ux-liquid-surface" aria-label={title}>
      <h3 className="ai-subheading">{title}</h3>
      <p className="ai-subtle">Status: {status}</p>
      <dl className="ux-context-grid" aria-label={`${title} summary`}>
        {items.map((item) => (
          <div key={item.label} className="ux-context-item">
            <dt className="ux-context-key">{item.label}</dt>
            <dd className="ux-context-value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
