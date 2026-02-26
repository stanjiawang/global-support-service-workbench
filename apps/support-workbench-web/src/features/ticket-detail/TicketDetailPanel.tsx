import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { loadTicketDetail, setSelectedTicketId } from "@features/ticket-detail/ticketDetailSlice";
import { selectActiveTicketDetail, selectTicketDetailSummary, selectTicketDirectory } from "@features/ticket-detail/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function TicketDetailPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectTicketDetailSummary);
  const directory = useSelector(selectTicketDirectory);
  const detail = useSelector(selectActiveTicketDetail);
  const [manualTicketId, setManualTicketId] = useState(summary.selectedTicketId);

  const reloadSelection = (): void => {
    const ticketId = manualTicketId.trim() || summary.selectedTicketId;
    dispatch(setSelectedTicketId(ticketId));
    dispatch(loadTicketDetail(ticketId));
  };

  return (
    <section className="feature-panel" aria-labelledby="ticket-detail-heading">
      <h2 id="ticket-detail-heading">ticket-detail</h2>
      <p>Detailed ticket workspace with timeline, notes, attachments, SLA clocks, and audit trail.</p>

      <h3>Load Ticket</h3>
      <div className="control-grid" role="group" aria-label="Ticket detail controls">
        <select
          className="text-input"
          aria-label="Select ticket"
          value={summary.selectedTicketId}
          onChange={(event) => {
            const nextTicketId = event.currentTarget.value;
            setManualTicketId(nextTicketId);
            dispatch(setSelectedTicketId(nextTicketId));
            dispatch(loadTicketDetail(nextTicketId));
          }}
        >
          {directory.slice(0, 200).map((ticketId) => (
            <option key={ticketId} value={ticketId}>
              {ticketId}
            </option>
          ))}
        </select>
        <input
          className="text-input"
          aria-label="Manual ticket id"
          value={manualTicketId}
          onChange={(event) => setManualTicketId(event.currentTarget.value)}
          placeholder="TKT-1201"
        />
        <button type="button" className="nav-btn" onClick={reloadSelection}>
          Load ticket
        </button>
      </div>

      <h3>Ticket Summary</h3>
      <DetailList
        ariaLabel="Ticket detail summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Selected ticket", value: summary.selectedTicketId },
          { label: "Directory size", value: String(summary.indexedTickets) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      {detail ? (
        <>
          <h3>Ticket Metadata</h3>
          <DetailList
            ariaLabel="Ticket metadata"
            items={[
              { label: "Ticket ID", value: detail.ticketId },
              { label: "Customer ID", value: detail.customerId },
              { label: "Status", value: detail.status },
              { label: "Priority", value: detail.priority },
              { label: "Assignee", value: detail.assignee },
              { label: "Tags", value: detail.tags.join(", ") },
              { label: "Created", value: detail.createdAt },
              { label: "Updated", value: detail.updatedAt }
            ]}
          />

          <h3>SLA Clocks</h3>
          <DataTable
            rows={detail.slaClocks}
            getRowKey={(clock) => clock.clockId}
            emptyMessage="No SLA clocks available."
            columns={[
              { key: "clock", header: "Clock", render: (row) => row.label },
              { key: "target", header: "Target", render: (row) => row.targetAt },
              { key: "remaining", header: "Remaining (min)", render: (row) => String(row.remainingMinutes) },
              { key: "status", header: "Status", render: (row) => row.status }
            ]}
          />

          <h3>Timeline</h3>
          <DataTable
            rows={detail.timeline}
            getRowKey={(entry) => entry.entryId}
            emptyMessage="No timeline entries available."
            virtualized={detail.timeline.length > 12}
            containerHeightPx={320}
            rowHeightPx={40}
            columns={[
              { key: "time", header: "Timestamp", render: (row) => row.timestamp },
              { key: "channel", header: "Channel", render: (row) => row.channel },
              { key: "action", header: "Action", render: (row) => row.action },
              { key: "actor", header: "Actor", render: (row) => row.actor },
              { key: "summary", header: "Summary", render: (row) => row.summary }
            ]}
          />

          <h3>Notes</h3>
          <DataTable
            rows={detail.notes}
            getRowKey={(note) => note.noteId}
            emptyMessage="No notes available."
            columns={[
              { key: "created", header: "Created", render: (row) => row.createdAt },
              { key: "author", header: "Author", render: (row) => row.author },
              { key: "visibility", header: "Visibility", render: (row) => row.visibility },
              { key: "body", header: "Note", render: (row) => row.body }
            ]}
          />

          <h3>Attachments</h3>
          <DataTable
            rows={detail.attachments}
            getRowKey={(attachment) => attachment.attachmentId}
            emptyMessage="No attachments available."
            columns={[
              { key: "file", header: "File", render: (row) => row.fileName },
              { key: "type", header: "Type", render: (row) => row.mimeType },
              { key: "size", header: "Size (KB)", render: (row) => String(row.sizeKb) },
              { key: "uploaded", header: "Uploaded", render: (row) => row.uploadedAt },
              { key: "by", header: "Uploaded By", render: (row) => row.uploadedBy }
            ]}
          />

          <h3>Audit Trail</h3>
          <DataTable
            rows={detail.auditTrail}
            getRowKey={(event) => event.eventId}
            emptyMessage="No audit events available."
            virtualized={detail.auditTrail.length > 12}
            containerHeightPx={320}
            rowHeightPx={40}
            columns={[
              { key: "time", header: "Changed At", render: (row) => row.changedAt },
              { key: "field", header: "Field", render: (row) => row.field },
              { key: "from", header: "From", render: (row) => row.fromValue },
              { key: "to", header: "To", render: (row) => row.toValue },
              { key: "actor", header: "Actor", render: (row) => row.actor },
              { key: "reason", header: "Reason", render: (row) => row.reason }
            ]}
          />
        </>
      ) : (
        <p>Select a ticket to view full detail.</p>
      )}
    </section>
  );
}
