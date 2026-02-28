import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCaseHistorySummary, selectCaseRecords, selectCaseTimeline } from "@features/case-history/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { StatusBadge, statusFromValue } from "@shared/ui/components/StatusBadge";
import { DetailList } from "@shared/ui/DetailList";
import { useDebouncedValue } from "@shared/utils/useDebouncedValue";

interface CaseHistoryPanelProps {
  readonly onRefresh: () => void;
}

export function CaseHistoryPanel({ onRefresh }: CaseHistoryPanelProps): JSX.Element {
  const summary = useSelector(selectCaseHistorySummary);
  const cases = useSelector(selectCaseRecords);
  const timeline = useSelector(selectCaseTimeline);
  const [queryInput, setQueryInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const query = useDebouncedValue(queryInput.trim().toLowerCase(), 220);

  const filteredCases = useMemo(() => {
    if (!query) {
      return cases;
    }

    return cases.filter((row) => {
      return (
        row.caseId.toLowerCase().includes(query) ||
        row.customerId.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query)
      );
    });
  }, [cases, query]);

  const pageCount = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [currentPage, filteredCases]);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="case-history-heading">
      <h2 id="case-history-heading">case-history</h2>
      <p>Redux slice-backed case ledger with version and idempotency safeguards.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Case history summary"
        items={[
          { label: "Status", value: summary.status },
          { label: "Total cases", value: String(summary.caseCount) },
          { label: "Open or pending cases", value: String(summary.openCaseCount) },
          { label: "Last fetched", value: summary.lastFetchedAt ?? "N/A" }
        ]}
      />

      <h3>Cases</h3>
      <div className="panel-actions">
        <input
          className="input-field ux-pagination-search"
          placeholder="Search cases"
          value={queryInput}
          onChange={(event) => {
            setQueryInput(event.currentTarget.value);
            setPage(1);
          }}
          aria-label="Search cases"
        />
      </div>
      <div className="ux-table-pagination" role="group" aria-label="Case search pagination controls">
        <button
          type="button"
          className="btn-secondary btn-compact"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
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
          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          disabled={currentPage >= pageCount}
        >
          Next page
        </button>
      </div>
      <DataTable
        rows={pagedCases}
        getRowKey={(caseRecord) => caseRecord.caseId}
        emptyMessage="No cases found."
        columns={[
          { key: "case", header: "Case", render: (row) => row.caseId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={statusFromValue(row.status)} ariaLabel={`Status: ${row.status}`} />
          },
          { key: "updated", header: "Updated At", render: (row) => row.updatedAt }
        ]}
      />

      <h3>Timeline Events</h3>
      <DataTable
        rows={timeline}
        getRowKey={(event) => event.eventId}
        emptyMessage="No timeline events found."
        paginate
        pageSize={20}
        paginationLabel="Case timeline events"
        columns={[
          { key: "event", header: "Event", render: (row) => row.eventId },
          { key: "entity", header: "Entity", render: (row) => row.entityId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "version", header: "Version", render: (row) => row.version },
          { key: "time", header: "Server Time", render: (row) => row.serverTs }
        ]}
      />

      <div className="panel-actions">
        <button type="button" className="btn-secondary" onClick={onRefresh}>
          Reload case snapshot
        </button>
      </div>
    </section>
  );
}
