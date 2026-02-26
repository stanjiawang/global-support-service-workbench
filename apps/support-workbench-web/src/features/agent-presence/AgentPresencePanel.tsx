import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";
import type { AgentStatus } from "@shared/network/mockAgentPresence";
import { loadAgentPresenceSnapshot, setAgentStatus } from "@features/agent-presence/agentPresenceSlice";
import { selectAgentPresenceSummary, selectAgentRoster } from "@features/agent-presence/selectors";

export function AgentPresencePanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectAgentPresenceSummary);
  const roster = useSelector(selectAgentRoster);

  const statusColumns: readonly AgentStatus[] = ["available", "busy", "break", "offline"];

  return (
    <section className="feature-panel" aria-labelledby="agent-presence-heading">
      <h2 id="agent-presence-heading">agent-presence</h2>
      <p>Mock workforce roster with queue impact simulation from status changes.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Agent presence summary"
        items={[
          { label: "Status", value: summary.status },
          { label: "Queue depth", value: String(summary.queueDepth) },
          { label: "Available", value: String(summary.availableCount) },
          { label: "Busy", value: String(summary.busyCount) },
          { label: "Break", value: String(summary.breakCount) },
          { label: "Offline", value: String(summary.offlineCount) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" }
        ]}
      />

      <h3>Roster</h3>
      <DataTable
        rows={roster}
        getRowKey={(agent) => agent.agentId}
        emptyMessage="No agents available."
        columns={[
          { key: "agent", header: "Agent", render: (row) => row.displayName },
          { key: "id", header: "Agent ID", render: (row) => row.agentId },
          { key: "locale", header: "Locale", render: (row) => row.locale },
          { key: "sessions", header: "Sessions", render: (row) => row.activeSessions },
          {
            key: "status",
            header: "Status",
            render: (row) => <span className={`status-pill status-${row.status}`}>{row.status}</span>
          },
          {
            key: "actions",
            header: "Set Status",
            render: (row) => (
              <div className="inline-actions">
                {statusColumns.map((status) => (
                  <button
                    key={`${row.agentId}-${status}`}
                    type="button"
                    className={row.status === status ? "mini-btn mini-btn-active" : "mini-btn"}
                    onClick={() => dispatch(setAgentStatus({ agentId: row.agentId, status }))}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )
          }
        ]}
      />

      <p>
        <button type="button" className="nav-btn" onClick={() => dispatch(loadAgentPresenceSnapshot())}>
          Reload roster snapshot
        </button>
      </p>
    </section>
  );
}
