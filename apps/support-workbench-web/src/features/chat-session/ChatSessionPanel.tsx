import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { startChatToPhoneHandoff } from "@app/providers/simulationActions";
import { selectChatInteractions, selectChatSessionSummary, selectChatTimeline } from "@features/chat-session/selectors";
import { selectActiveHandoff } from "@shared/state/handoffSelectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";
import { useDebouncedValue } from "@shared/utils/useDebouncedValue";

interface ChatSessionPanelProps {
  readonly onRefresh: () => void;
}

export function ChatSessionPanel({ onRefresh }: ChatSessionPanelProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectChatSessionSummary);
  const interactions = useSelector(selectChatInteractions);
  const timeline = useSelector(selectChatTimeline);
  const activeHandoff = useSelector(selectActiveHandoff);
  const [queryInput, setQueryInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const query = useDebouncedValue(queryInput.trim().toLowerCase(), 220);

  const filteredInteractions = useMemo(() => {
    if (!query) {
      return interactions;
    }

    return interactions.filter((row) => {
      return (
        row.interactionId.toLowerCase().includes(query) ||
        row.customerId.toLowerCase().includes(query) ||
        row.channel.toLowerCase().includes(query)
      );
    });
  }, [interactions, query]);

  const interactionPageCount = Math.max(1, Math.ceil(filteredInteractions.length / pageSize));
  const currentPage = Math.min(page, interactionPageCount);
  const pagedInteractions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInteractions.slice(start, start + pageSize);
  }, [currentPage, filteredInteractions]);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="chat-session-heading">
      <h2 id="chat-session-heading">chat-session</h2>
      <p>Redux slice-backed view with idempotent event ingestion and version guards.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Chat session summary"
        items={[
          { label: "Status", value: summary.status },
          { label: "Interaction count", value: String(summary.interactionCount) },
          { label: "Latest event version", value: String(summary.latestEventVersion) },
          { label: "Last fetched", value: summary.lastFetchedAt ?? "N/A" }
        ]}
      />

      <h3>Interactions</h3>
      <div className="panel-actions">
        <input
          className="input-field ux-pagination-search"
          placeholder="Search interactions"
          value={queryInput}
          onChange={(event) => {
            setQueryInput(event.currentTarget.value);
            setPage(1);
          }}
          aria-label="Search chat interactions"
        />
      </div>
      <div className="ux-table-pagination" role="group" aria-label="Chat interaction pagination controls">
        <button
          type="button"
          className="btn-secondary btn-compact"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          disabled={currentPage <= 1}
        >
          Previous page
        </button>
        <span aria-live="polite">
          Page {currentPage} / {interactionPageCount}
        </span>
        <button
          type="button"
          className="btn-secondary btn-compact"
          onClick={() => setPage((value) => Math.min(interactionPageCount, value + 1))}
          disabled={currentPage >= interactionPageCount}
        >
          Next page
        </button>
      </div>
      <DataTable
        rows={pagedInteractions}
        getRowKey={(interaction) => interaction.interactionId}
        emptyMessage="No interactions found."
        columns={[
          { key: "interaction", header: "Interaction", render: (row) => row.interactionId },
          { key: "customer", header: "Customer", render: (row) => row.customerId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "opened", header: "Opened At", render: (row) => row.openedAt }
        ]}
      />

      <h3>Timeline Events</h3>
      <DataTable
        rows={timeline}
        getRowKey={(event) => event.eventId}
        emptyMessage="No timeline events found."
        paginate
        pageSize={20}
        paginationLabel="Chat timeline events"
        columns={[
          { key: "event", header: "Event", render: (row) => row.eventId },
          { key: "entity", header: "Entity", render: (row) => row.entityId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "version", header: "Version", render: (row) => row.version },
          { key: "time", header: "Server Time", render: (row) => row.serverTs }
        ]}
      />

      <h3>Cross-Channel Handoff</h3>
      <DetailList
        ariaLabel="Chat handoff status"
        items={[
          { label: "Active handoff", value: activeHandoff?.handoffId ?? "none" },
          { label: "Stage", value: activeHandoff?.stage ?? "none" },
          { label: "Customer", value: activeHandoff?.customerId ?? "none" }
        ]}
      />

      <div className="panel-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => dispatch(startChatToPhoneHandoff())}
          disabled={interactions.length === 0}
        >
          Start handoff to phone
        </button>
        <button type="button" className="btn-secondary" onClick={onRefresh}>
          Reload chat snapshot
        </button>
      </div>
    </section>
  );
}
