import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { loadTicketDetail, setSelectedTicketId } from "@features/ticket-detail/ticketDetailSlice";
import { selectActiveTicketDetail, selectTicketDetailSummary, selectTicketDirectory } from "@features/ticket-detail/selectors";
import { ActionBar } from "@shared/ui/components/ActionBar";
import { ContextRail } from "@shared/ui/components/ContextRail";
import { StatusBadge, statusFromValue } from "@shared/ui/components/StatusBadge";
import { StatePanel } from "@shared/ui/components/StatePanel";
import { WorkbenchTable } from "@shared/ui/components/WorkbenchTable";
import { DetailList } from "@shared/ui/DetailList";
import { emitUxEvent } from "@shared/telemetry/uxEvents";

type DetailStatus = "new" | "open" | "pending" | "resolved" | "closed";

export function TicketDetailPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectTicketDetailSummary);
  const directory = useSelector(selectTicketDirectory);
  const detail = useSelector(selectActiveTicketDetail);
  const [manualTicketId, setManualTicketId] = useState(summary.selectedTicketId);
  const [optimisticStatus, setOptimisticStatus] = useState<DetailStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [activeSegment, setActiveSegment] = useState<"overview" | "records" | "actions">("overview");

  const reloadSelection = (): void => {
    const ticketId = manualTicketId.trim() || summary.selectedTicketId;
    dispatch(setSelectedTicketId(ticketId));
    dispatch(loadTicketDetail(ticketId));
    emitUxEvent(dispatch, { eventName: "ui.ticket_selected", feature: "/ticket-detail" });
  };

  const effectiveStatus = optimisticStatus ?? detail?.status ?? "unknown";

  const actionStatus = useMemo(() => {
    if (!detail) {
      return "No ticket selected";
    }
    if (statusMessage) {
      return statusMessage;
    }
    return `Current status: ${effectiveStatus}`;
  }, [detail, effectiveStatus, statusMessage]);

  const applyOptimisticStatus = (nextStatus: DetailStatus): void => {
    if (!detail) {
      return;
    }
    const previousStatus = detail.status;
    setOptimisticStatus(nextStatus);
    setStatusMessage(`Updating status to ${nextStatus}...`);
    emitUxEvent(dispatch, {
      eventName: "ui.status_update_optimistic",
      feature: "/ticket-detail"
    });

    window.setTimeout(() => {
      const shouldRollback = nextStatus === "closed";
      if (shouldRollback) {
        setOptimisticStatus(previousStatus);
        setStatusMessage(`Status update rollback to ${previousStatus} (policy check failed).`);
        emitUxEvent(dispatch, {
          eventName: "ui.status_update_rollback",
          feature: "/ticket-detail",
          status: "error"
        });
        return;
      }
      setStatusMessage(`Status updated to ${nextStatus}.`);
      setOptimisticStatus(nextStatus);
    }, 360);
  };

  return (
    <section className="feature-panel ux-panel" aria-labelledby="ticket-detail-heading">
      <ActionBar
        title="Ticket Detail"
        subtitle="Full ticket timeline, notes, attachments, SLA clocks, and audit context."
        primaryAction={{ label: "Load ticket", onClick: reloadSelection }}
      />

      <StatePanel status={summary.status} error={summary.error} emptyHint="Select a ticket to view detail." />

      <div className="ux-segmented-control" role="tablist" aria-label="Ticket detail sections">
        {[
          { key: "overview", label: "Overview" },
          { key: "records", label: "Records" },
          { key: "actions", label: "Actions" }
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

      {activeSegment === "overview" || activeSegment === "records" ? (
        <div className="ux-detail-layout">
        <div className="ux-detail-main">
          <section className="ux-detail-toolbar" aria-label="Ticket detail controls">
            <select
              className="input-field"
              aria-label="Select ticket"
              value={summary.selectedTicketId}
              onChange={(event) => {
                const nextTicketId = event.currentTarget.value;
                setManualTicketId(nextTicketId);
                dispatch(setSelectedTicketId(nextTicketId));
                dispatch(loadTicketDetail(nextTicketId));
                emitUxEvent(dispatch, { eventName: "ui.ticket_selected", feature: "/ticket-detail" });
              }}
            >
              {directory.slice(0, 200).map((ticketId) => (
                <option key={ticketId} value={ticketId}>
                  {ticketId}
                </option>
              ))}
            </select>
            <input
              className="input-field"
              aria-label="Manual ticket id"
              value={manualTicketId}
              onChange={(event) => setManualTicketId(event.currentTarget.value)}
              placeholder="TKT-1201"
            />
            <button type="button" className="btn-secondary" onClick={reloadSelection}>
              Load ticket
            </button>
          </section>

          {activeSegment === "overview" ? (
            <DetailList
            ariaLabel="Ticket detail summary"
            items={[
              { label: "State", value: summary.status },
              { label: "Selected ticket", value: summary.selectedTicketId },
              { label: "Directory size", value: String(summary.indexedTickets) },
              { label: "Last fetched", value: summary.fetchedAt ?? "N/A" }
            ]}
            />
          ) : null}

          {detail ? (
            <>
              {activeSegment === "overview" ? (
                <DetailList
                ariaLabel="Ticket metadata"
                items={[
                  { label: "Ticket ID", value: detail.ticketId },
                  { label: "Customer ID", value: detail.customerId },
                  { label: "Status", value: effectiveStatus },
                  { label: "Priority", value: detail.priority },
                  { label: "Assignee", value: detail.assignee },
                  { label: "Tags", value: detail.tags.join(", ") },
                  { label: "Created", value: detail.createdAt },
                  { label: "Updated", value: detail.updatedAt }
                ]}
                />
              ) : null}

              {activeSegment === "records" ? (
                <>
                  <WorkbenchTable
                title="Timeline"
                rows={detail.timeline}
                getRowKey={(entry) => entry.entryId}
                emptyMessage="No timeline entries available."
                loading={summary.status === "loading"}
                paginate
                pageSize={12}
                paginationLabel="Ticket timeline"
                columns={[
                  { key: "time", header: "Timestamp", render: (row) => row.timestamp },
                  { key: "channel", header: "Channel", render: (row) => row.channel },
                  { key: "action", header: "Action", render: (row) => row.action },
                  { key: "actor", header: "Actor", render: (row) => row.actor },
                  { key: "summary", header: "Summary", render: (row) => row.summary }
                ]}
                  />

                  <WorkbenchTable
                title="Notes"
                rows={detail.notes}
                getRowKey={(note) => note.noteId}
                emptyMessage="No notes available."
                loading={summary.status === "loading"}
                columns={[
                  { key: "created", header: "Created", render: (row) => row.createdAt },
                  { key: "author", header: "Author", render: (row) => row.author },
                  { key: "visibility", header: "Visibility", render: (row) => row.visibility },
                  { key: "body", header: "Note", render: (row) => row.body }
                ]}
                  />

                  <WorkbenchTable
                title="Attachments"
                rows={detail.attachments}
                getRowKey={(attachment) => attachment.attachmentId}
                emptyMessage="No attachments available."
                loading={summary.status === "loading"}
                columns={[
                  { key: "file", header: "File", render: (row) => row.fileName },
                  { key: "type", header: "Type", render: (row) => row.mimeType },
                  { key: "size", header: "Size (KB)", render: (row) => String(row.sizeKb) },
                  { key: "uploaded", header: "Uploaded", render: (row) => row.uploadedAt },
                  { key: "by", header: "Uploaded By", render: (row) => row.uploadedBy }
                ]}
                  />

                  <WorkbenchTable
                title="Audit Trail"
                rows={detail.auditTrail}
                getRowKey={(event) => event.eventId}
                emptyMessage="No audit events available."
                loading={summary.status === "loading"}
                paginate
                pageSize={12}
                paginationLabel="Ticket audit trail"
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
              ) : null}
            </>
          ) : (
            <p>Select a ticket to view full detail.</p>
          )}
        </div>

        <ContextRail
          title="Case Execution Rail"
          status={summary.status}
          items={[
            { label: "Selected ticket", value: summary.selectedTicketId },
            { label: "Status action", value: actionStatus },
            { label: "SLA clocks", value: String(detail?.slaClocks.length ?? 0) },
            { label: "Audit entries", value: String(detail?.auditTrail.length ?? 0) }
          ]}
        />
        </div>
      ) : null}

      {detail && activeSegment === "actions" ? (
        <section className="ux-bulk-bar" aria-label="Status actions">
          <strong>Sticky status actions</strong>
          {(["open", "pending", "resolved", "closed"] as const).map((status) => (
            <button key={status} type="button" className="btn-secondary" onClick={() => applyOptimisticStatus(status)}>
              Set {status}
            </button>
          ))}
        </section>
      ) : null}

      {detail && activeSegment === "actions" ? (
        <WorkbenchTable
          title="SLA Clocks"
          rows={detail.slaClocks}
          getRowKey={(clock) => clock.clockId}
          emptyMessage="No SLA clocks available."
          loading={summary.status === "loading"}
          columns={[
                  { key: "clock", header: "Clock", render: (row) => row.label },
                  { key: "target", header: "Target", render: (row) => row.targetAt },
                  { key: "remaining", header: "Remaining (min)", render: (row) => String(row.remainingMinutes) },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => <StatusBadge status={statusFromValue(row.status)} ariaLabel={`Status: ${row.status}`} />
                  }
                ]}
              />
      ) : null}
    </section>
  );
}
