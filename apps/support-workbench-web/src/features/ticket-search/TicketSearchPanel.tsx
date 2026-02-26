import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";
import { resetTicketSearchFilters, setTicketSearchFilters, type TicketSearchFilters } from "@features/ticket-search/ticketSearchSlice";
import {
  selectFilteredTickets,
  selectTicketSearchFilters,
  selectTicketSearchSummary
} from "@features/ticket-search/selectors";

const PAGE_SIZE = 25;

function tagsToList(tagsInput: string): string[] {
  return tagsInput
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function TicketSearchPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectTicketSearchSummary);
  const filters = useSelector(selectTicketSearchFilters);
  const tickets = useSelector(selectFilteredTickets);
  const [tagsInput, setTagsInput] = useState(filters.tags.join(", "));
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tickets.slice(start, start + PAGE_SIZE);
  }, [currentPage, tickets]);

  const applyFilters = (next: Partial<TicketSearchFilters>): void => {
    setPage(1);
    dispatch(setTicketSearchFilters(next));
  };

  return (
    <section className="feature-panel" aria-labelledby="ticket-search-heading">
      <h2 id="ticket-search-heading">ticket-search</h2>
      <p>Global ticket search across id, customer fields, status, tags, assignee, and date range.</p>

      <h3>Search Status</h3>
      <DetailList
        ariaLabel="Ticket search summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Indexed tickets", value: String(summary.totalTickets) },
          { label: "Filtered results", value: String(tickets.length) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Advanced Filters</h3>
      <div className="form-grid">
        <label className="field-label" htmlFor="search-ticket-id">
          Ticket ID
        </label>
        <input
          id="search-ticket-id"
          className="text-input"
          value={filters.ticketId}
          onChange={(event) => applyFilters({ ticketId: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-customer-id">
          Customer ID
        </label>
        <input
          id="search-customer-id"
          className="text-input"
          value={filters.customerId}
          onChange={(event) => applyFilters({ customerId: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-email">
          Customer Email
        </label>
        <input
          id="search-email"
          className="text-input"
          value={filters.customerEmail}
          onChange={(event) => applyFilters({ customerEmail: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-phone">
          Customer Phone
        </label>
        <input
          id="search-phone"
          className="text-input"
          value={filters.customerPhone}
          onChange={(event) => applyFilters({ customerPhone: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-status">
          Status
        </label>
        <select
          id="search-status"
          className="text-input"
          value={filters.status}
          onChange={(event) => applyFilters({ status: event.currentTarget.value as TicketSearchFilters["status"] })}
        >
          <option value="">all</option>
          <option value="new">new</option>
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>

        <label className="field-label" htmlFor="search-tags">
          Tags (comma-separated)
        </label>
        <input
          id="search-tags"
          className="text-input"
          value={tagsInput}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setTagsInput(next);
            applyFilters({ tags: tagsToList(next) });
          }}
        />

        <label className="field-label" htmlFor="search-assignee">
          Assignee
        </label>
        <input
          id="search-assignee"
          className="text-input"
          value={filters.assignee}
          onChange={(event) => applyFilters({ assignee: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-date-from">
          Updated From
        </label>
        <input
          id="search-date-from"
          type="date"
          className="text-input"
          value={filters.dateFrom}
          onChange={(event) => applyFilters({ dateFrom: event.currentTarget.value })}
        />

        <label className="field-label" htmlFor="search-date-to">
          Updated To
        </label>
        <input
          id="search-date-to"
          type="date"
          className="text-input"
          value={filters.dateTo}
          onChange={(event) => applyFilters({ dateTo: event.currentTarget.value })}
        />
      </div>

      <p className="inline-actions">
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            setTagsInput("");
            dispatch(resetTicketSearchFilters());
          }}
        >
          Clear filters
        </button>
      </p>

      <h3>Results</h3>
      <div className="control-grid" role="group" aria-label="Ticket search pagination controls">
        <button
          type="button"
          className="nav-btn"
          disabled={currentPage <= 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
        >
          Previous page
        </button>
        <button
          type="button"
          className="nav-btn"
          disabled={currentPage >= pageCount}
          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
        >
          Next page
        </button>
        <span>
          Page {currentPage} / {pageCount}
        </span>
      </div>
      <DataTable
        rows={paged}
        getRowKey={(ticket) => ticket.ticketId}
        emptyMessage="No tickets found for the selected filters."
        virtualized={paged.length > 40}
        containerHeightPx={380}
        rowHeightPx={40}
        columns={[
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "email", header: "Email", render: (row) => row.customerEmail },
          { key: "phone", header: "Phone", render: (row) => row.customerPhone },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "tags", header: "Tags", render: (row) => row.tags.join(", ") },
          { key: "assignee", header: "Assignee", render: (row) => row.assignee },
          { key: "updated", header: "Updated At", render: (row) => row.updatedAt }
        ]}
      />
    </section>
  );
}
