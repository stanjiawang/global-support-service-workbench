import type { ReactNode } from "react";
import { DataTable } from "@shared/ui/DataTable";

interface WorkbenchColumn<RowType> {
  readonly header: string;
  readonly key: string;
  readonly render: (row: RowType) => ReactNode;
}

interface WorkbenchTableProps<RowType> {
  readonly title: string;
  readonly rows: readonly RowType[];
  readonly columns: readonly WorkbenchColumn<RowType>[];
  readonly getRowKey: (row: RowType) => string;
  readonly emptyMessage: string;
  readonly loading?: boolean;
  readonly skeletonRowCount?: number;
  readonly reservedMinHeightPx?: number;
  readonly virtualized?: boolean;
  readonly containerHeightPx?: number;
  readonly rowHeightPx?: number;
  readonly overscanCount?: number;
  readonly paginate?: boolean;
  readonly pageSize?: number;
  readonly paginationLabel?: string;
}

export function WorkbenchTable<RowType>({ title, ...table }: WorkbenchTableProps<RowType>): JSX.Element {
  return (
    <section className="ux-table-section ux-liquid-surface" aria-label={title}>
      <h3 className="ai-subheading">{title}</h3>
      <DataTable<RowType> {...table} />
    </section>
  );
}
