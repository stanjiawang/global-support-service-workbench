import { useMemo, useState, type ReactNode } from "react";

interface DataTableColumn<RowType> {
  readonly header: string;
  readonly key: string;
  readonly render: (row: RowType) => ReactNode;
}

interface DataTableProps<RowType> {
  readonly columns: readonly DataTableColumn<RowType>[];
  readonly rows: readonly RowType[];
  readonly getRowKey: (row: RowType) => string;
  readonly emptyMessage: string;
  readonly virtualized?: boolean;
  readonly containerHeightPx?: number;
  readonly rowHeightPx?: number;
  readonly overscanCount?: number;
}

export function DataTable<RowType>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  virtualized = false,
  containerHeightPx = 360,
  rowHeightPx = 42,
  overscanCount = 6
}: DataTableProps<RowType>): JSX.Element {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleCount = Math.ceil(containerHeightPx / rowHeightPx);
  const startIndex = virtualized ? Math.max(0, Math.floor(scrollTop / rowHeightPx) - overscanCount) : 0;
  const endIndex = virtualized
    ? Math.min(rows.length, startIndex + visibleCount + overscanCount * 2)
    : rows.length;
  const visibleRows = virtualized ? rows.slice(startIndex, endIndex) : rows;
  const topSpacerHeight = virtualized ? startIndex * rowHeightPx : 0;
  const bottomSpacerHeight = virtualized ? Math.max(0, (rows.length - endIndex) * rowHeightPx) : 0;
  const tableContainerStyle = virtualized
    ? ({ maxHeight: `${containerHeightPx}px`, overflowY: "auto" } as const)
    : undefined;

  const renderedRows = useMemo(
    () =>
      visibleRows.map((row) => (
        <tr key={getRowKey(row)}>
          {columns.map((column) => (
            <td key={column.key}>{column.render(row)}</td>
          ))}
        </tr>
      )),
    [columns, getRowKey, visibleRows]
  );

  if (rows.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div
      className="table-wrap"
      onScroll={(event) => {
        if (!virtualized) {
          return;
        }
        setScrollTop(event.currentTarget.scrollTop);
      }}
      style={tableContainerStyle}
    >
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {virtualized && topSpacerHeight > 0 ? (
            <tr aria-hidden="true">
              <td colSpan={columns.length} style={{ height: `${topSpacerHeight}px`, padding: 0 }} />
            </tr>
          ) : null}
          {renderedRows}
          {virtualized && bottomSpacerHeight > 0 ? (
            <tr aria-hidden="true">
              <td colSpan={columns.length} style={{ height: `${bottomSpacerHeight}px`, padding: 0 }} />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
