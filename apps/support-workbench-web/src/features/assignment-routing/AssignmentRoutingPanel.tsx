import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import {
  routeSelectedTicketBySkills,
  setSelectedQueue,
  setSelectedTicketId,
  transferOwnershipToAgent
} from "@features/assignment-routing/assignmentRoutingSlice";
import {
  selectAssignmentRoutingSummary,
  selectQueueTickets,
  selectRoutingAgents,
  selectRoutingQueues,
  selectTransferLog
} from "@features/assignment-routing/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function AssignmentRoutingPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectAssignmentRoutingSummary);
  const queues = useSelector(selectRoutingQueues);
  const queueTickets = useSelector(selectQueueTickets);
  const agents = useSelector(selectRoutingAgents);
  const transferLog = useSelector(selectTransferLog);
  const [manualAgentId, setManualAgentId] = useState("");

  return (
    <section className="feature-panel" aria-labelledby="assignment-routing-heading">
      <h2 id="assignment-routing-heading">assignment-routing</h2>
      <p>Queue operations and ownership transfer with skills-based routing fallback.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Assignment routing summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Queues", value: String(summary.queueCount) },
          { label: "Agents", value: String(summary.agentCount) },
          { label: "Selected queue", value: summary.selectedQueueId || "N/A" },
          { label: "Selected ticket", value: summary.selectedTicketId || "N/A" },
          { label: "Transfers", value: String(summary.transferCount) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Queue Selection</h3>
      <div className="control-grid" role="group" aria-label="Queue controls">
        <select
          className="text-input"
          aria-label="Select queue"
          value={summary.selectedQueueId}
          onChange={(event) => dispatch(setSelectedQueue(event.currentTarget.value))}
        >
          {queues.map((queue) => (
            <option key={queue.queueId} value={queue.queueId}>
              {queue.name}
            </option>
          ))}
        </select>

        <select
          className="text-input"
          aria-label="Select queue ticket"
          value={summary.selectedTicketId}
          onChange={(event) => dispatch(setSelectedTicketId(event.currentTarget.value))}
        >
          {queueTickets.map((ticketId) => (
            <option key={ticketId} value={ticketId}>
              {ticketId}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="nav-btn"
          disabled={!summary.selectedTicketId}
          onClick={() => dispatch(routeSelectedTicketBySkills())}
        >
          Auto route by skills
        </button>
      </div>

      <div className="control-grid" role="group" aria-label="Manual transfer controls">
        <select
          className="text-input"
          aria-label="Manual agent"
          value={manualAgentId}
          onChange={(event) => setManualAgentId(event.currentTarget.value)}
        >
          <option value="">Select agent</option>
          {agents.map((agent) => (
            <option key={agent.agentId} value={agent.agentId}>
              {agent.displayName} ({agent.activeLoad}/{agent.maxCapacity})
            </option>
          ))}
        </select>
        <button
          type="button"
          className="nav-btn"
          disabled={!manualAgentId || !summary.selectedTicketId}
          onClick={() => dispatch(transferOwnershipToAgent({ agentId: manualAgentId, mode: "manual" }))}
        >
          Transfer ownership
        </button>
      </div>

      <h3>Queues</h3>
      <DataTable
        rows={queues}
        getRowKey={(queue) => queue.queueId}
        emptyMessage="No routing queues."
        columns={[
          { key: "queue", header: "Queue", render: (row) => row.name },
          { key: "skills", header: "Required skills", render: (row) => row.requiredSkills.join(", ") },
          { key: "tickets", header: "Tickets", render: (row) => String(row.ticketIds.length) },
          { key: "backlog", header: "Backlog", render: (row) => String(row.backlog) }
        ]}
      />

      <h3>Agents</h3>
      <DataTable
        rows={agents}
        getRowKey={(agent) => agent.agentId}
        emptyMessage="No routing agents."
        columns={[
          { key: "name", header: "Agent", render: (row) => row.displayName },
          { key: "skills", header: "Skills", render: (row) => row.skills.join(", ") },
          { key: "load", header: "Load", render: (row) => `${row.activeLoad}/${row.maxCapacity}` }
        ]}
      />

      <h3>Transfer Log</h3>
      <DataTable
        rows={transferLog}
        getRowKey={(row) => `${row.ticketId}-${row.transferredAt}-${row.mode}`}
        emptyMessage="No transfers yet."
        columns={[
          { key: "time", header: "Time", render: (row) => row.transferredAt },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "queue", header: "Queue", render: (row) => row.fromQueueId },
          { key: "agent", header: "Agent", render: (row) => row.toAgentId },
          { key: "mode", header: "Mode", render: (row) => row.mode }
        ]}
      />
    </section>
  );
}
