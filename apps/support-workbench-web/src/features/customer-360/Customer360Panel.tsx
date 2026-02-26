import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import {
  simulateCaseFreshEvent,
  simulateCaseReplayEvent,
  simulateCaseStaleEvent,
  simulateChatFreshEvent,
  simulateChatReplayEvent,
  simulateChatStaleEvent
} from "@app/providers/simulationActions";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";
import { selectRecentTelemetry } from "@shared/state/telemetrySelectors";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";
import { selectUnifiedTimeline, selectWorkbenchAggregateSummary } from "@shared/state/aggregateSelectors";

interface Customer360PanelProps {
  readonly onRefreshAll: () => void;
}

export function Customer360Panel({ onRefreshAll }: Customer360PanelProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectWorkbenchAggregateSummary);
  const timeline = useSelector(selectUnifiedTimeline);
  const telemetry = useSelector(selectRecentTelemetry);

  return (
    <section className="feature-panel" aria-labelledby="customer-360-heading">
      <h2 id="customer-360-heading">customer-360</h2>
      <p>Cross-feature aggregate from chat-session and case-history slices, using shared selectors.</p>

      <h3>Aggregate Summary</h3>
      <DetailList
        ariaLabel="Customer 360 aggregate summary"
        items={[
          { label: "Chat slice status", value: summary.chatStatus },
          { label: "Case slice status", value: summary.caseStatus },
          { label: "Interactions", value: String(summary.interactionCount) },
          { label: "Cases", value: String(summary.caseCount) },
          { label: "Open or pending cases", value: String(summary.openOrPendingCaseCount) },
          { label: "Processed events", value: String(summary.totalProcessedEventCount) },
          { label: "Last chat ingestion", value: summary.chatLastIngestionOutcome },
          { label: "Last case ingestion", value: summary.caseLastIngestionOutcome }
        ]}
      />

      <h3>Event Simulator</h3>
      <div className="control-grid" role="group" aria-label="Event simulator controls">
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateChatFreshEvent());
            emitTelemetry(dispatch, { eventName: "sim.chat.fresh", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Chat fresh event
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateChatReplayEvent());
            emitTelemetry(dispatch, { eventName: "sim.chat.replay", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Chat replay event
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateChatStaleEvent());
            emitTelemetry(dispatch, { eventName: "sim.chat.stale", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Chat stale event
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateCaseFreshEvent());
            emitTelemetry(dispatch, { eventName: "sim.case.fresh", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Case fresh event
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateCaseReplayEvent());
            emitTelemetry(dispatch, { eventName: "sim.case.replay", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Case replay event
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            dispatch(simulateCaseStaleEvent());
            emitTelemetry(dispatch, { eventName: "sim.case.stale", feature: "customer-360", latencyMs: 0 });
          }}
        >
          Case stale event
        </button>
      </div>

      <h3>Unified Timeline</h3>
      <DataTable
        rows={timeline}
        getRowKey={(row) => `${row.source}:${row.event.eventId}`}
        emptyMessage="No unified timeline events available."
        columns={[
          { key: "source", header: "Source", render: (row) => row.source },
          { key: "event", header: "Event", render: (row) => row.event.eventId },
          { key: "entity", header: "Entity", render: (row) => row.event.entityId },
          { key: "channel", header: "Channel", render: (row) => row.event.channel },
          { key: "version", header: "Version", render: (row) => row.event.version },
          { key: "time", header: "Server Time", render: (row) => row.event.serverTs }
        ]}
      />

      <h3>Recent Telemetry</h3>
      <DataTable
        rows={telemetry}
        getRowKey={(row) => `${row.recordedAt}:${row.eventName}:${row.feature}`}
        emptyMessage="No telemetry events recorded yet."
        columns={[
          { key: "time", header: "Recorded At", render: (row) => row.recordedAt },
          { key: "event", header: "Event", render: (row) => row.eventName },
          { key: "feature", header: "Feature", render: (row) => row.feature },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "latency", header: "Latency (ms)", render: (row) => row.latencyMs }
        ]}
      />

      <p>
        <button type="button" className="nav-btn" onClick={onRefreshAll}>
          Refresh aggregate snapshots
        </button>
      </p>
    </section>
  );
}
