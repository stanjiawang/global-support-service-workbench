import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { resetTicketSearchFilters, setTicketSearchFilters, type TicketSearchFilters } from "@features/ticket-search/ticketSearchSlice";
import {
  selectFilteredTickets,
  selectTicketSearchFilters,
  selectTicketSearchSummary
} from "@features/ticket-search/selectors";
import type { MockTicketRecord } from "@shared/network/mockTicketSearch";
import { ActionBar } from "@shared/ui/components/ActionBar";
import { FilterBar } from "@shared/ui/components/FilterBar";
import { InputField } from "@shared/ui/components/InputField";
import { StatusBadge, statusFromValue } from "@shared/ui/components/StatusBadge";
import { StatePanel } from "@shared/ui/components/StatePanel";
import { WorkbenchTable } from "@shared/ui/components/WorkbenchTable";
import { DetailList } from "@shared/ui/DetailList";
import { emitUxEvent } from "@shared/telemetry/uxEvents";

const PAGE_SIZE = 25;
function tagsToList(tagsInput: string): string[] {
  return tagsInput
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function confidenceBand(ticket: MockTicketRecord, query: string): "high" | "medium" | "low" {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return "medium";
  }
  if (ticket.ticketId.toLowerCase() === needle || ticket.customerId.toLowerCase() === needle) {
    return "high";
  }
  if (
    ticket.ticketId.toLowerCase().includes(needle) ||
    ticket.customerEmail.toLowerCase().includes(needle) ||
    ticket.customerPhone.toLowerCase().includes(needle)
  ) {
    return "medium";
  }
  return "low";
}

function isRecent(updatedAt: string): boolean {
  const now = Date.now();
  const updated = new Date(updatedAt).getTime();
  return now - updated <= 1000 * 60 * 60 * 24;
}

export function TicketSearchPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectTicketSearchSummary);
  const filters = useSelector(selectTicketSearchFilters);
  const tickets = useSelector(selectFilteredTickets);
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState({
    ticketId: filters.ticketId,
    customerId: filters.customerId,
    customerEmail: filters.customerEmail,
    customerPhone: filters.customerPhone,
    status: filters.status,
    assignee: filters.assignee,
    tagsInput: filters.tags.join(", "),
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo
  });
  const [activeSegment, setActiveSegment] = useState<"overview" | "filters" | "results">("overview");

  useEffect(() => {
    setDraft({
      ticketId: filters.ticketId,
      customerId: filters.customerId,
      customerEmail: filters.customerEmail,
      customerPhone: filters.customerPhone,
      status: filters.status,
      assignee: filters.assignee,
      tagsInput: filters.tags.join(", "),
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo
    });
  }, [filters]);

  function applyFilters(): void {
    dispatch(
      setTicketSearchFilters({
        ticketId: draft.ticketId,
        customerId: draft.customerId,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        status: draft.status,
        assignee: draft.assignee,
        tags: tagsToList(draft.tagsInput),
        dateFrom: draft.dateFrom,
        dateTo: draft.dateTo
      })
    );
    emitUxEvent(dispatch, {
      eventName: "ui.search_executed",
      feature: "/ticket-search",
      latencyMs: 0
    });
  }

  const pageCount = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tickets.slice(start, start + PAGE_SIZE);
  }, [currentPage, tickets]);

  const grouped = useMemo(() => {
    const high = paged.filter((ticket) => confidenceBand(ticket, filters.ticketId || filters.customerId) === "high");
    const mediumLow = paged.filter((ticket) => confidenceBand(ticket, filters.ticketId || filters.customerId) !== "high");
    return {
      high,
      recent: mediumLow.filter((ticket) => isRecent(ticket.updatedAt)),
      older: mediumLow.filter((ticket) => !isRecent(ticket.updatedAt))
    };
  }, [filters.customerId, filters.ticketId, paged]);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="ticket-search-heading">
      <ActionBar
        title="Ticket Search"
        subtitle="Structured search across ticket id, customer fields, status, tags, assignee, and date range."
        primaryAction={{
          label: "Clear filters",
          onClick: () => {
            setDraft({
              ticketId: "",
              customerId: "",
              customerEmail: "",
              customerPhone: "",
              status: "",
              assignee: "",
              tagsInput: "",
              dateFrom: "",
              dateTo: ""
            });
            setPage(1);
            dispatch(resetTicketSearchFilters());
          }
        }}
      />

      <StatePanel status={summary.status} error={summary.error} />

      <div className="ux-segmented-control" role="tablist" aria-label="Ticket search sections">
        {[
          { key: "overview", label: "Overview" },
          { key: "filters", label: "Filters" },
          { key: "results", label: "Results" }
        ].map((segment) => (
          <button
            key={segment.key}
            type="button"
            role="tab"
            aria-selected={activeSegment === segment.key}
            className={activeSegment === segment.key ? "ux-segment-btn ux-segment-btn-active" : "ux-segment-btn"}
            onClick={() => setActiveSegment(segment.key as typeof activeSegment)}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {activeSegment === "overview" ? (
        <DetailList
          ariaLabel="Ticket search summary"
          items={[
            { label: "State", value: summary.status },
            { label: "Indexed tickets", value: String(summary.totalTickets) },
            { label: "Filtered results", value: String(tickets.length) },
            { label: "Last fetched", value: summary.fetchedAt ?? "N/A" }
          ]}
        />
      ) : null}

      {activeSegment === "filters" ? (
        <FilterBar title="Advanced Filters">
          <form
            className="ticket-search-filter-form"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              applyFilters();
            }}
          >
            <section className="ticket-search-group" aria-label="Identity filters">
              <h4 className="ticket-search-group-title">Identity</h4>
              <div className="ticket-search-group-grid ticket-search-group-grid-two">
                <div className="ticket-search-field">
                  <InputField id="search-ticket-id" label="Ticket ID">
                    <input
                      id="search-ticket-id"
                      className="input-field"
                      value={draft.ticketId}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, ticketId: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-customer-id" label="Customer ID">
                    <input
                      id="search-customer-id"
                      className="input-field"
                      value={draft.customerId}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, customerId: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-email" label="Customer Email">
                    <input
                      id="search-email"
                      className="input-field"
                      value={draft.customerEmail}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, customerEmail: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-phone" label="Customer Phone">
                    <input
                      id="search-phone"
                      className="input-field"
                      value={draft.customerPhone}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, customerPhone: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>
              </div>
            </section>

            <section className="ticket-search-group" aria-label="Classification filters">
              <h4 className="ticket-search-group-title">Classification</h4>
              <div className="ticket-search-group-grid ticket-search-group-grid-two">
                <div className="ticket-search-field">
                  <InputField id="search-status" label="Status">
                    <select
                      id="search-status"
                      className="input-field"
                      value={draft.status}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({
                          ...previous,
                          status: event.currentTarget.value as TicketSearchFilters["status"]
                        }));
                      }}
                    >
                      <option value="">all</option>
                      <option value="new">new</option>
                      <option value="open">open</option>
                      <option value="pending">pending</option>
                      <option value="resolved">resolved</option>
                      <option value="closed">closed</option>
                    </select>
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-tags" label="Tags (comma-separated)">
                    <input
                      id="search-tags"
                      className="input-field"
                      value={draft.tagsInput}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, tagsInput: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>
              </div>
            </section>

            <section className="ticket-search-group" aria-label="Ownership and time filters">
              <h4 className="ticket-search-group-title">Ownership and Time</h4>
              <div className="ticket-search-group-grid ticket-search-group-grid-three">
                <div className="ticket-search-field">
                  <InputField id="search-assignee" label="Assignee">
                    <input
                      id="search-assignee"
                      className="input-field"
                      value={draft.assignee}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, assignee: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-date-from" label="Updated From">
                    <input
                      id="search-date-from"
                      type="date"
                      className="input-field"
                      value={draft.dateFrom}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, dateFrom: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>

                <div className="ticket-search-field">
                  <InputField id="search-date-to" label="Updated To">
                    <input
                      id="search-date-to"
                      type="date"
                      className="input-field"
                      value={draft.dateTo}
                      onChange={(event) => {
                        setPage(1);
                        setDraft((previous) => ({ ...previous, dateTo: event.currentTarget.value }));
                      }}
                    />
                  </InputField>
                </div>
              </div>
            </section>

            <div className="ticket-search-filter-actions">
              <button type="submit" className="btn-primary">
                Search tickets
              </button>
            </div>
          </form>
        </FilterBar>
      ) : null}

      {activeSegment === "results" ? (
        <>
          <div className="ux-table-pagination" role="group" aria-label="Ticket search pagination controls">
            <button
              type="button"
              className="btn-secondary btn-compact"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous page
            </button>
            <span aria-live="polite">
              Page {currentPage} / {pageCount}
            </span>
            <button
              type="button"
              className="btn-secondary btn-compact"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next page
            </button>
          </div>

          <WorkbenchTable
            title="High confidence matches"
            rows={grouped.high}
            getRowKey={(ticket) => ticket.ticketId}
            emptyMessage="No high-confidence matches on this page."
            loading={summary.status === "loading"}
            columns={[
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={statusFromValue(row.status)} ariaLabel={`Status: ${row.status}`} />
          },
          { key: "assignee", header: "Assignee", render: (row) => row.assignee },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt }
            ]}
          />

          <WorkbenchTable
            title="Recent results"
            rows={grouped.recent}
            getRowKey={(ticket) => ticket.ticketId}
            emptyMessage="No recent results in current filter window."
            loading={summary.status === "loading"}
            columns={[
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "email", header: "Email", render: (row) => row.customerEmail },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={statusFromValue(row.status)} ariaLabel={`Status: ${row.status}`} />
          },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt }
            ]}
          />

          <WorkbenchTable
            title="Older results"
            rows={grouped.older}
            getRowKey={(ticket) => ticket.ticketId}
            emptyMessage="No older results in current filter window."
            loading={summary.status === "loading"}
            columns={[
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "phone", header: "Phone", render: (row) => row.customerPhone },
          { key: "tags", header: "Tags", render: (row) => row.tags.join(", ") },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt }
            ]}
          />
        </>
      ) : null}
    </section>
  );
}
