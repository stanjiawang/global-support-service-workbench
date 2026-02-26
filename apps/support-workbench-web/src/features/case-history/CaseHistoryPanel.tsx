import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCaseHistorySummary, selectCaseRecords, selectCaseTimeline } from "@features/case-history/selectors";
import { DataTable } from "@shared/ui/DataTable";
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
    <section className="feature-panel" aria-labelledby="case-history-heading">
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
      <div className="control-grid" role="group" aria-label="Case search and pagination">
        <input
          className="text-input"
          placeholder="Search cases"
          value={queryInput}
          onChange={(event) => {
            setQueryInput(event.currentTarget.value);
            setPage(1);
          }}
          aria-label="Search cases"
        />
        <button
          type="button"
          className="nav-btn"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          disabled={currentPage <= 1}
        >
          Previous page
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          disabled={currentPage >= pageCount}
        >
          Next page
        </button>
        <span>
          Page {currentPage} / {pageCount}
        </span>
      </div>
      <DataTable
        rows={pagedCases}
        getRowKey={(caseRecord) => caseRecord.caseId}
        emptyMessage="No cases found."
        columns={[
          { key: "case", header: "Case", render: (row) => row.caseId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "updated", header: "Updated At", render: (row) => row.updatedAt }
        ]}
      />

      <h3>Timeline Events</h3>
      <DataTable
        rows={timeline}
        getRowKey={(event) => event.eventId}
        emptyMessage="No timeline events found."
        virtualized={timeline.length > 40}
        containerHeightPx={320}
        rowHeightPx={40}
        columns={[
          { key: "event", header: "Event", render: (row) => row.eventId },
          { key: "entity", header: "Entity", render: (row) => row.entityId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "version", header: "Version", render: (row) => row.version },
          { key: "time", header: "Server Time", render: (row) => row.serverTs }
        ]}
      />

      <p>
        <button type="button" className="nav-btn" onClick={onRefresh}>
          Reload case snapshot
        </button>
      </p>
    </section>
  );
}
