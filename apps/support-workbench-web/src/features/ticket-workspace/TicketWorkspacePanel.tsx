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
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

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
    <section className="feature-panel" aria-labelledby="ticket-workspace-heading">
      <h2 id="ticket-workspace-heading">ticket-workspace</h2>
      <p>Saved views, advanced filtering, sorting, and bulk actions for ticket operations.</p>

      <h3>Workspace Summary</h3>
      <DetailList
        ariaLabel="Ticket workspace summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Filtered tickets", value: String(tickets.length) },
          { label: "Selected tickets", value: String(summary.selectedCount) },
          { label: "Saved views", value: String(summary.viewCount) },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Advanced Filters</h3>
      <div className="form-grid">
        <label className="field-label" htmlFor="workspace-query">
          Search
        </label>
        <input
          id="workspace-query"
          className="text-input"
          value={filters.query}
          onChange={(event) => updateFilters({ query: event.currentTarget.value })}
          placeholder="ticket id, customer id, email, phone"
        />

        <label className="field-label" htmlFor="workspace-status">
          Status
        </label>
        <select
          id="workspace-status"
          className="text-input"
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
          className="text-input"
          value={filters.assignee}
          onChange={(event) => updateFilters({ assignee: event.currentTarget.value })}
          placeholder="agent-ava"
        />

        <label className="field-label" htmlFor="workspace-tags">
          Tags
        </label>
        <input
          id="workspace-tags"
          className="text-input"
          value={tagsInput}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setTagsInput(next);
            updateFilters({ tags: parseTags(next) });
          }}
          placeholder="billing, vip"
        />
      </div>

      <div className="control-grid" role="group" aria-label="Sorting controls">
        <select
          className="text-input"
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
          className="text-input"
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
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            setPage(1);
            setTagsInput("");
            dispatch(resetTicketWorkspaceFilters());
          }}
        >
          Reset filters
        </button>
      </div>

      <h3>Saved Views</h3>
      <div className="control-grid" role="group" aria-label="Saved view controls">
        <input
          className="text-input"
          aria-label="Saved view name"
          value={viewName}
          onChange={(event) => setViewName(event.currentTarget.value)}
          placeholder="My open escalations"
        />
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(saveCurrentView(viewName));
            setViewName("");
          }}
        >
          Save current view
        </button>
        <span>{summary.activeViewId ? `Active: ${summary.activeViewId}` : "No active saved view"}</span>
      </div>
      <ul className="suggestion-list" aria-label="Saved ticket views">
        {savedViews.map((view) => (
          <li key={view.id} className="suggestion-item">
            <strong>{view.name}</strong>
            <div className="inline-actions">
              <button type="button" className="nav-btn" onClick={() => dispatch(applySavedView(view.id))}>
                Apply
              </button>
              <button type="button" className="nav-btn" onClick={() => dispatch(deleteSavedView(view.id))}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Bulk Actions</h3>
      <div className="control-grid" role="group" aria-label="Bulk action controls">
        <select className="text-input" aria-label="Bulk status" value={bulkStatus} onChange={(event) => setBulkStatus(event.currentTarget.value as typeof bulkStatus)}>
          <option value="">status</option>
          <option value="new">new</option>
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="resolved">resolved</option>
          <option value="closed">closed</option>
        </select>
        <button
          type="button"
          className="nav-btn"
          disabled={!bulkStatus || selectedIds.length === 0}
          onClick={() => {
            if (!bulkStatus) {
              return;
            }
            dispatch(applyBulkStatus(bulkStatus));
          }}
        >
          Apply status
        </button>
        <input
          className="text-input"
          aria-label="Bulk assignee"
          value={bulkAssignee}
          onChange={(event) => setBulkAssignee(event.currentTarget.value)}
          placeholder="agent-liam"
        />
        <button
          type="button"
          className="nav-btn"
          disabled={selectedIds.length === 0}
          onClick={() => dispatch(applyBulkAssignee(bulkAssignee))}
        >
          Apply assignee
        </button>
        <button type="button" className="nav-btn" onClick={() => dispatch(clearTicketSelection())}>
          Clear selection
        </button>
      </div>

      <h3>Tickets</h3>
      <div className="control-grid" role="group" aria-label="Pagination controls">
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
        <button
          type="button"
          className="nav-btn"
          onClick={() => dispatch(selectTicketsByIds(allCurrentPageSelected ? [] : paged.map((row) => row.ticketId)))}
        >
          {allCurrentPageSelected ? "Unselect page" : "Select page"}
        </button>
        <span>
          Page {currentPage} / {pageCount}
        </span>
      </div>
      <DataTable
        rows={paged}
        getRowKey={(ticket) => ticket.ticketId}
        emptyMessage="No tickets in current workspace query."
        columns={[
          {
            key: "select",
            header: "Select",
            render: (row) => (
              <input
                type="checkbox"
                aria-label={`Select ${row.ticketId}`}
                checked={selectedIds.includes(row.ticketId)}
                onChange={() => dispatch(toggleTicketSelection(row.ticketId))}
              />
            )
          },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "assignee", header: "Assignee", render: (row) => row.assignee },
          { key: "tags", header: "Tags", render: (row) => row.tags.join(", ") },
          { key: "updated", header: "Updated At", render: (row) => row.updatedAt }
        ]}
      />
    </section>
  );
}
