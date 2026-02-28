import { useSelector } from "react-redux";
import {
  selectAgentProductivity,
  selectQueueHealth,
  selectReportingSummary,
  selectResolutionTrend
} from "@features/reporting-dashboards/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function ReportingDashboardsPanel(): JSX.Element {
  const summary = useSelector(selectReportingSummary);
  const queueHealth = useSelector(selectQueueHealth);
  const productivity = useSelector(selectAgentProductivity);
  const trend = useSelector(selectResolutionTrend);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="reporting-dashboards-heading">
      <h2 id="reporting-dashboards-heading">reporting-dashboards</h2>
      <p>Operational analytics for queue health, SLA posture, agent productivity, and resolution trends.</p>

      <h3>Executive Summary</h3>
      <DetailList
        ariaLabel="Reporting summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Queues monitored", value: String(summary.queueCount) },
          { label: "Agents tracked", value: String(summary.agentCount) },
          { label: "Trend points", value: String(summary.trendPoints) },
          { label: "SLA compliance %", value: String(summary.slaCompliancePct) },
          { label: "First response p50 (min)", value: String(summary.firstResponseMinutesP50) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Queue Health</h3>
      <DataTable
        rows={queueHealth}
        getRowKey={(row) => row.queueId}
        emptyMessage="No queue health metrics."
        columns={[
          { key: "queue", header: "Queue", render: (row) => row.queueName },
          { key: "backlog", header: "Backlog", render: (row) => String(row.backlog) },
          { key: "wait", header: "Avg wait (sec)", render: (row) => String(row.avgWaitSeconds) },
          { key: "risk", header: "SLA at risk", render: (row) => String(row.slaAtRisk) }
        ]}
      />

      <h3>Agent Productivity</h3>
      <DataTable
        rows={productivity}
        getRowKey={(row) => row.agentId}
        emptyMessage="No productivity metrics."
        paginate
        pageSize={10}
        paginationLabel="Agent productivity"
        columns={[
          { key: "agent", header: "Agent", render: (row) => row.agentId },
          { key: "resolved", header: "Resolved", render: (row) => String(row.resolvedCount) },
          { key: "aht", header: "Avg handle (min)", render: (row) => row.avgHandleMinutes.toFixed(1) },
          { key: "csat", header: "CSAT", render: (row) => row.csat.toFixed(2) }
        ]}
      />

      <h3>Resolution Trend</h3>
      <DataTable
        rows={trend}
        getRowKey={(row) => row.day}
        emptyMessage="No trend points."
        columns={[
          { key: "day", header: "Day", render: (row) => row.day },
          { key: "resolved", header: "Resolved", render: (row) => String(row.resolved) },
          { key: "reopened", header: "Reopened", render: (row) => String(row.reopened) }
        ]}
      />
    </section>
  );
}
