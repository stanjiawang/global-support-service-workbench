import { StatusBadge, statusFromValue } from "@shared/ui/components/StatusBadge";

interface DetailItem {
  readonly label: string;
  readonly value: string;
}

interface DetailListProps {
  readonly items: readonly DetailItem[];
  readonly ariaLabel?: string;
}

export function DetailList({ items, ariaLabel }: DetailListProps): JSX.Element {
  return (
    <dl className="detail-list" aria-label={ariaLabel}>
      {items.map((item) => (
        <div key={item.label} className="detail-row">
          <dt className="detail-key">{item.label}</dt>
          <dd className="detail-value">
            {item.label.toLowerCase().includes("status") || item.label.toLowerCase().includes("state") ? (
              <StatusBadge status={statusFromValue(item.value)} ariaLabel={`Status: ${item.value}`} />
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
