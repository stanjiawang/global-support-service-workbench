import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import {
  applyBulkAssignee,
  applyBulkStatus,
  applySavedView,
  clearTicketSelection,
  deleteSavedView,
  resetTicketWorkspaceFilters,
  saveCurrentView,
  selectTicketsByIds,
  setTicketWorkspaceFilters,
  setTicketWorkspaceSort,
  toggleTicketSelection,
  type TicketWorkspaceFilters
} from "@features/ticket-workspace/ticketWorkspaceSlice";
import {
  selectFilteredSortedTickets,
  selectSavedTicketViews,
  selectSelectedTicketIds,
  selectTicketWorkspaceFilters,
  selectTicketWorkspaceSort,
  selectTicketWorkspaceSummary
} from "@features/ticket-workspace/selectors";
import { ActionBar } from "@shared/ui/components/ActionBar";
import { FilterBar } from "@shared/ui/components/FilterBar";
import { StatusBadge, statusFromValue } from "@shared/ui/components/StatusBadge";
import { StatePanel } from "@shared/ui/components/StatePanel";
import { WorkbenchTable } from "@shared/ui/components/WorkbenchTable";
import { DetailList } from "@shared/ui/DetailList";
import { emitUxEvent } from "@shared/telemetry/uxEvents";

const PAGE_SIZE = 30;

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function TicketWorkspacePanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectTicketWorkspaceSummary);
  const filters = useSelector(selectTicketWorkspaceFilters);
  const sort = useSelector(selectTicketWorkspaceSort);
  const selectedIds = useSelector(selectSelectedTicketIds);
  const savedViews = useSelector(selectSavedTicketViews);
  const tickets = useSelector(selectFilteredSortedTickets);
  const [page, setPage] = useState(1);
  const [viewName, setViewName] = useState("");
  const [tagsInput, setTagsInput] = useState(filters.tags.join(", "));
  const [bulkStatus, setBulkStatus] = useState<"" | "new" | "open" | "pending" | "resolved" | "closed">("");
  const [bulkAssignee, setBulkAssignee] = useState("");
  const [activeSegment, setActiveSegment] = useState<"overview" | "filters" | "queue">("overview");

  const pageCount = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tickets.slice(start, start + PAGE_SIZE);
  }, [currentPage, tickets]);

  const updateFilters = (next: Partial<TicketWorkspaceFilters>): void => {
    setPage(1);
    dispatch(setTicketWorkspaceFilters(next));
  };

  const allCurrentPageSelected = paged.length > 0 && paged.every((ticket) => selectedIds.includes(ticket.ticketId));

  return (
    <section className="feature-panel ux-panel" aria-labelledby="ticket-workspace-heading">
      <ActionBar
        title="Ticket Workspace"
        subtitle="Triage-focused queue with saved views, advanced filters, and bulk operations."
        primaryAction={{
          label: "Reset filters",
          onClick: () => {
            setPage(1);
            setTagsInput("");
            dispatch(resetTicketWorkspaceFilters());
          }
        }}
      />

      <StatePanel status={summary.status} error={summary.error} />

      <div className="ux-segmented-control" role="tablist" aria-label="Ticket workspace sections">
        {[
          { key: "overview", label: "Overview" },
          { key: "filters", label: "Filters" },
          { key: "queue", label: "Queue" }
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
          ariaLabel="Ticket workspace summary"
          items={[
            { label: "State", value: summary.status },
            { label: "Filtered tickets", value: String(tickets.length) },
            { label: "Selected tickets", value: String(summary.selectedCount) },
            { label: "Saved views", value: String(summary.viewCount) },
            { label: "Active view", value: summary.activeViewId ?? "none" }
          ]}
        />
      ) : null}

      {activeSegment === "filters" ? (
        <>
          <FilterBar
            title="Advanced Filters"
            actions={
              <>
                <select
                  className="input-field"
                  aria-label="Sort by"
                  value={sort.sortBy}
                  onChange={(event) => {
                    dispatch(
                      setTicketWorkspaceSort({
                        sortBy: event.currentTarget.value as "updatedAt" | "ticketId" | "status",
                        sortDirection: sort.sortDirection
                      })
                    );
                  }}
                >
                  <option value="updatedAt">updatedAt</option>
                  <option value="ticketId">ticketId</option>
                  <option value="status">status</option>
                </select>
                <select
                  className="input-field"
                  aria-label="Sort direction"
                  value={sort.sortDirection}
                  onChange={(event) => {
                    dispatch(
                      setTicketWorkspaceSort({
                        sortBy: sort.sortBy,
                        sortDirection: event.currentTarget.value as "asc" | "desc"
                      })
                    );
                  }}
                >
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </>
            }
          >
        <label className="field-label" htmlFor="workspace-query">
          Search
        </label>
        <input
          id="workspace-query"
          className="input-field"
          value={filters.query}
          onChange={(event) => updateFilters({ query: event.currentTarget.value })}
          placeholder="ticket id, customer id, email, phone"
        />

        <label className="field-label" htmlFor="workspace-status">
          Status
        </label>
        <select
          id="workspace-status"
          className="input-field"
          value={filters.status}
          onChange={(event) =>
            updateFilters({ status: event.currentTarget.value as TicketWorkspaceFilters["status"] })
          }
        >
          <option value="">all</option>
          <option value="new">new</option>
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>

        <label className="field-label" htmlFor="workspace-assignee">
          Assignee
        </label>
        <input
          id="workspace-assignee"
          className="input-field"
          value={filters.assignee}
          onChange={(event) => updateFilters({ assignee: event.currentTarget.value })}
          placeholder="agent-ava"
        />

        <label className="field-label" htmlFor="workspace-tags">
          Tags
        </label>
        <input
          id="workspace-tags"
          className="input-field"
          value={tagsInput}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setTagsInput(next);
            updateFilters({ tags: parseTags(next) });
          }}
          placeholder="billing, vip"
        />
          </FilterBar>

          <section className="ux-chip-row" aria-label="Saved ticket views">
            {savedViews.map((view) => (
              <article key={view.id} className="ux-view-chip">
                <strong>{view.name}</strong>
                <div className="inline-actions">
                  <button type="button" className="btn-secondary btn-compact" onClick={() => dispatch(applySavedView(view.id))}>
                    Apply
                  </button>
                  <button type="button" className="btn-secondary btn-compact" onClick={() => dispatch(deleteSavedView(view.id))}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>

          <div className="control-grid" role="group" aria-label="Saved view controls">
            <input
              className="input-field"
              aria-label="Saved view name"
              value={viewName}
              onChange={(event) => setViewName(event.currentTarget.value)}
              placeholder="My open escalations"
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                dispatch(saveCurrentView(viewName));
                setViewName("");
              }}
            >
              Save current view
            </button>
          </div>
        </>
      ) : null}

      {activeSegment === "queue" ? (
        <>

          {selectedIds.length > 0 ? (
        <section className="ux-bulk-bar" aria-label="Bulk action controls">
          <strong>{selectedIds.length} selected</strong>
          <select
            className="input-field"
            aria-label="Bulk status"
            value={bulkStatus}
            onChange={(event) => setBulkStatus(event.currentTarget.value as typeof bulkStatus)}
          >
            <option value="">status</option>
            <option value="new">new</option>
            <option value="open">open</option>
            <option value="pending">pending</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>
          <button
            type="button"
            className="btn-secondary"
            disabled={!bulkStatus}
            onClick={() => {
              if (!bulkStatus) {
                return;
              }
              dispatch(applyBulkStatus(bulkStatus));
              emitUxEvent(dispatch, { eventName: "ui.primary_action_clicked", feature: "/ticket-workspace" });
            }}
          >
            Apply status
          </button>
          <input
            className="input-field"
            aria-label="Bulk assignee"
            value={bulkAssignee}
            onChange={(event) => setBulkAssignee(event.currentTarget.value)}
            placeholder="agent-liam"
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              dispatch(applyBulkAssignee(bulkAssignee));
              emitUxEvent(dispatch, { eventName: "ui.primary_action_clicked", feature: "/ticket-workspace" });
            }}
          >
            Apply assignee
          </button>
          <button type="button" className="btn-secondary" onClick={() => dispatch(clearTicketSelection())}>
            Clear selection
          </button>
        </section>
          ) : null}

          <div className="ux-table-pagination" role="group" aria-label="Pagination controls">
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
          <div className="panel-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => dispatch(selectTicketsByIds(allCurrentPageSelected ? [] : paged.map((row) => row.ticketId)))}
            >
              {allCurrentPageSelected ? "Unselect page" : "Select page"}
            </button>
          </div>

          <WorkbenchTable
            title="Ticket Queue"
            rows={paged}
            getRowKey={(ticket) => ticket.ticketId}
            emptyMessage="No tickets in current workspace query."
            loading={summary.status === "loading"}
            virtualized={paged.length > 24}
            containerHeightPx={440}
            rowHeightPx={42}
            columns={[
          {
            key: "select",
            header: "Select",
            render: (row) => (
              <input
                type="checkbox"
                aria-label={`Select ${row.ticketId}`}
                checked={selectedIds.includes(row.ticketId)}
                onChange={() => {
                  dispatch(toggleTicketSelection(row.ticketId));
                  emitUxEvent(dispatch, { eventName: "ui.ticket_selected", feature: "/ticket-workspace" });
                }}
              />
            )
          },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={statusFromValue(row.status)} ariaLabel={`Status: ${row.status}`} />
          },
          { key: "assignee", header: "Assignee", render: (row) => row.assignee },
          { key: "tags", header: "Tags", render: (row) => row.tags.join(", ") },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt }
            ]}
          />
        </>
      ) : null}
    </section>
  );
}
