import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { setSelectedThreadId } from "@features/communication-logging/communicationLoggingSlice";
import {
  selectCommunicationSummary,
  selectCommunicationThreads,
  selectSelectedThreadMessages
} from "@features/communication-logging/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function CommunicationLoggingPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectCommunicationSummary);
  const threads = useSelector(selectCommunicationThreads);
  const messages = useSelector(selectSelectedThreadMessages);

  return (
    <section className="feature-panel" aria-labelledby="communication-logging-heading">
      <h2 id="communication-logging-heading">communication-logging</h2>
      <p>Threaded communication logs across email, SMS, and chat channels.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Communication logging summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Threads", value: String(summary.threadCount) },
          { label: "Selected thread", value: summary.selectedThreadId },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Thread List</h3>
      <DataTable
        rows={threads}
        getRowKey={(row) => row.threadId}
        emptyMessage="No threads."
        columns={[
          {
            key: "pick",
            header: "Select",
            render: (row) => (
              <button type="button" className="mini-btn" onClick={() => dispatch(setSelectedThreadId(row.threadId))}>
                Open
              </button>
            )
          },
          { key: "thread", header: "Thread", render: (row) => row.threadId },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "subject", header: "Subject", render: (row) => row.subject },
          { key: "updated", header: "Updated", render: (row) => row.updatedAt }
        ]}
      />

      <h3>Transcript Thread</h3>
      <DataTable
        rows={messages}
        getRowKey={(row) => row.messageId}
        emptyMessage="No transcript messages."
        virtualized={messages.length > 20}
        containerHeightPx={340}
        rowHeightPx={40}
        columns={[
          { key: "time", header: "Timestamp", render: (row) => row.timestamp },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "direction", header: "Direction", render: (row) => row.direction },
          { key: "author", header: "Author", render: (row) => row.author },
          { key: "body", header: "Message", render: (row) => row.body }
        ]}
      />
    </section>
  );
}
