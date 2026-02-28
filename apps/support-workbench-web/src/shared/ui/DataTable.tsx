import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  readonly autoPaginate?: boolean;
}

/**
 * Zero-shift note:
 * Loading renders skeleton rows inside a pre-sized container so table geometry is reserved
 * before data arrives, preventing reflow between loading and loaded states.
 */
export function DataTable<RowType>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  loading = false,
  skeletonRowCount = 6,
  reservedMinHeightPx = 240,
  virtualized = false,
  containerHeightPx = 360,
  rowHeightPx = 42,
  overscanCount = 6,
  paginate = false,
  pageSize = 25,
  paginationLabel = "Table rows",
  autoPaginate = true
}: DataTableProps<RowType>): JSX.Element {
  const [scrollTop, setScrollTop] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const shouldPaginate = (paginate || autoPaginate) && !virtualized && rows.length > pageSize;
  const pageCount = shouldPaginate ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const pageRows = shouldPaginate ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) : rows;
  const visibleCount = Math.ceil(containerHeightPx / rowHeightPx);
  const startIndex = virtualized ? Math.max(0, Math.floor(scrollTop / rowHeightPx) - overscanCount) : 0;
  const endIndex = virtualized
    ? Math.min(pageRows.length, startIndex + visibleCount + overscanCount * 2)
    : pageRows.length;
  const visibleRows = virtualized ? pageRows.slice(startIndex, endIndex) : pageRows;
  const topSpacerHeight = virtualized ? startIndex * rowHeightPx : 0;
  const bottomSpacerHeight = virtualized ? Math.max(0, (pageRows.length - endIndex) * rowHeightPx) : 0;
  const tableContainerStyle = virtualized
    ? ({ maxHeight: `${containerHeightPx}px`, overflowY: "auto" } as const)
    : ({ minHeight: `${reservedMinHeightPx}px` } as const);
  const showPagination = shouldPaginate;

  useEffect(() => {
    setCurrentPage((value) => Math.min(Math.max(1, value), pageCount));
  }, [pageCount]);

  useEffect(() => {
    setScrollTop(0);
  }, [currentPage, virtualized]);

  const renderedRows = useMemo(
    () =>
      visibleRows.map((row) => (
        <tr key={getRowKey(row)} className="ux-liquid-list-item">
          {columns.map((column) => (
            <td key={column.key}>{column.render(row)}</td>
          ))}
        </tr>
      )),
    [columns, getRowKey, visibleRows]
  );

  if (loading) {
    return (
      <div className="table-wrap" style={tableContainerStyle}>
        <table className="data-table" aria-hidden="true">
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
            {Array.from({ length: skeletonRowCount }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="ux-skeleton-row">
                {columns.map((column) => (
                  <td key={`${column.key}-${index}`}>
                    <div className="ux-skeleton ux-skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rows.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <>
      {showPagination ? (
        <div className="ux-table-pagination" role="group" aria-label={`${paginationLabel} pagination`}>
          <button
            type="button"
            className="btn-secondary btn-compact"
            onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
            disabled={currentPage <= 1}
          >
            Previous page
          </button>
          <span aria-live="polite">
            Page {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            className="btn-secondary btn-compact"
            onClick={() => setCurrentPage((value) => Math.min(pageCount, value + 1))}
            disabled={currentPage >= pageCount}
          >
            Next page
          </button>
        </div>
      ) : null}
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
    </>
  );
}
