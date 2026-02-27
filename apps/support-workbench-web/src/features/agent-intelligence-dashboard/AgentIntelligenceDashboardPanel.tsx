import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/providers/store";
import {
  addIncomingQueueTicket,
  clearTicketEntranceFlag,
  dismissAlert,
  generateAiSuggestion,
  generateAiSummary,
  updateCaseStatusOptimistic
} from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";
import {
  selectAgentIntelligenceSummary,
  selectAiSuggestionByTicket,
  selectAlerts,
  selectPendingStatusOps,
  selectQueueTickets,
  selectSummaryGhostByTicket
} from "@features/agent-intelligence-dashboard/selectors";
import { CustomerIntelligence } from "@features/agent-intelligence-dashboard/CustomerIntelligence";
import { InteractionTimeline } from "@features/agent-intelligence-dashboard/InteractionTimeline";
import { AiSuggestionPopover } from "@features/agent-intelligence-dashboard/AiSuggestionPopover";
import { ActionBar } from "@shared/ui/components/ActionBar";
import { StatusBadge, statusFromValue, StatusType } from "@shared/ui/components/StatusBadge";
import { emitUxEvent } from "@shared/telemetry/uxEvents";

export function AgentIntelligenceDashboardPanel(): JSX.Element {
  const FOCUS_RING = "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2";
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectAgentIntelligenceSummary);
  const queueTickets = useSelector(selectQueueTickets);
  const alerts = useSelector(selectAlerts);
  const pendingStatusOps = useSelector(selectPendingStatusOps);
  const aiSuggestionByTicket = useSelector(selectAiSuggestionByTicket);
  const summaryGhostByTicket = useSelector(selectSummaryGhostByTicket);
  const pulse = useSelector((state: RootState) => state.agentIntelligence.customerPulse);
  const timelineEvents = useSelector((state: RootState) => state.agentIntelligence.timelineEvents);

  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [replyDraft, setReplyDraft] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "queue" | "case_actions" | "timeline_alerts">("overview");

  useEffect(() => {
    for (const ticket of queueTickets) {
      if (!ticket.isNew) {
        continue;
      }
      const timeout = window.setTimeout(() => {
        dispatch(clearTicketEntranceFlag(ticket.ticketId));
      }, 800);
      return () => window.clearTimeout(timeout);
    }
  }, [dispatch, queueTickets]);

  useEffect(() => {
    if (alerts.length === 0) {
      return;
    }
    emitUxEvent(dispatch, {
      eventName: "ui.a11y_announcement_emitted",
      feature: "/agent-intelligence-dashboard"
    });
  }, [alerts, dispatch]);

  const activeTicketId = selectedTicketId || queueTickets[0]?.ticketId || "";
  const selectedTicket = useMemo(
    () => queueTickets.find((ticket) => ticket.ticketId === activeTicketId) ?? queueTickets[0] ?? null,
    [activeTicketId, queueTickets]
  );

  const selectedSuggestion = selectedTicket ? aiSuggestionByTicket[selectedTicket.ticketId] ?? null : null;
  const selectedGhostSummary = selectedTicket ? summaryGhostByTicket[selectedTicket.ticketId] ?? "" : "";
  const historyText = timelineEvents
    .filter((item: { ticketId: string }) => item.ticketId === selectedTicket?.ticketId)
    .map((item: { summary: string }) => item.summary)
    .join(" ");

  return (
    <section className="feature-panel ux-panel ai-dashboard-root" aria-labelledby="agent-intelligence-dashboard-heading">
      <ActionBar
        title="Agent Intelligence Dashboard"
        subtitle="Pulse analytics, timeline truth stream, and AI assistance in one triage cockpit."
        primaryAction={{
          label: "Simulate incoming ticket",
          onClick: () => {
            dispatch(addIncomingQueueTicket());
            emitUxEvent(dispatch, { eventName: "ui.primary_action_clicked", feature: "/agent-intelligence-dashboard" });
          }
        }}
      />

      <div aria-live="assertive" className="sr-only">
        {alerts
          .filter((item) => item.severity === "urgent")
          .slice(0, 1)
          .map((item) => item.message)
          .join(" ")}
      </div>
      <div aria-live="polite" className="sr-only">
        {alerts
          .filter((item) => item.severity !== "urgent")
          .slice(0, 1)
          .map((item) => item.message)
          .join(" ")}
      </div>

      <p className="ai-subtle text-sm">
        Status: {summary.dashboardStatus} | Queue: {summary.queueCount} | Pending updates: {summary.pendingOperations}
      </p>

      <div className="ux-segmented-control" role="tablist" aria-label="Agent intelligence sections">
        {[
          { key: "overview", label: "Overview" },
          { key: "queue", label: "Queue" },
          { key: "case_actions", label: "Case Actions" },
          { key: "timeline_alerts", label: "Timeline/Alerts" }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={activeTab === tab.key ? "ux-segment-btn ux-segment-btn-active" : "ux-segment-btn"}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="ai-layout-grid">
          <aside className="ai-glass-card ai-sidebar">
            <h3 className="ai-heading tracking-tight antialiased">Queue Snapshot</h3>
            <p className="ai-subtle text-sm">Active tickets: {summary.queueCount}</p>
            <p className="ai-subtle text-sm">Pending updates: {summary.pendingOperations}</p>
          </aside>
          <div className="space-y-4">
            <CustomerIntelligence pulse={pulse} />
            <InteractionTimeline />
          </div>
          <section className="ai-glass-card space-y-3">
            <h3 className="ai-heading tracking-tight antialiased">Current Selection</h3>
            <p className="ai-subtle text-sm">Selected ticket: {selectedTicket?.ticketId ?? "none"}</p>
            <p className="ai-subtle text-sm">Suggestion ready: {selectedSuggestion ? "yes" : "no"}</p>
          </section>
        </div>
      ) : null}

      {activeTab === "queue" ? (
        <aside className="ai-glass-card ai-sidebar">
          <h3 className="ai-heading tracking-tight antialiased">Queue</h3>
          <ul className="ai-queue-list" aria-label="Incoming support queue">
            {queueTickets.map((ticket) => {
              const pending = pendingStatusOps[ticket.ticketId];
              return (
                <li
                  key={ticket.ticketId}
                  className={ticket.isNew ? "ai-queue-item ai-queue-item-new" : "ai-queue-item"}
                >
                  <button
                    type="button"
                    className={
                      selectedTicket?.ticketId === ticket.ticketId
                        ? `ai-queue-btn ai-queue-btn-active ${FOCUS_RING}`
                        : `ai-queue-btn ${FOCUS_RING}`
                    }
                    onClick={() => setSelectedTicketId(ticket.ticketId)}
                  >
                    <strong>{ticket.ticketId}</strong>
                    <span className="ai-subtle text-sm">{ticket.subject}</span>
                    <span className="ai-subtle text-sm">
                      {ticket.customerId} |{" "}
                      <StatusBadge status={statusFromValue(ticket.status)} ariaLabel={`Status: ${ticket.status}`} />
                      {pending ? " (syncing...)" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}

      {activeTab === "case_actions" ? (
        <section className="ai-glass-card space-y-3">
          <h3 className="ai-heading tracking-tight antialiased">Case Actions</h3>
          <p className="ai-subtle text-sm">Selected ticket: {selectedTicket?.ticketId ?? "none"}</p>

          <div className="control-grid">
            {(["open", "pending", "resolved", "closed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`ai-action-btn ${FOCUS_RING}`}
                disabled={!selectedTicket}
                onClick={() => {
                  if (!selectedTicket) return;
                  emitUxEvent(dispatch, {
                    eventName: "ui.status_update_optimistic",
                    feature: "/agent-intelligence-dashboard"
                  });
                  dispatch(updateCaseStatusOptimistic({ ticketId: selectedTicket.ticketId, nextStatus: status }))
                    .unwrap()
                    .catch(() => {
                      emitUxEvent(dispatch, {
                        eventName: "ui.status_update_rollback",
                        feature: "/agent-intelligence-dashboard",
                        status: "error"
                      });
                    });
                }}
              >
                Set {status}
              </button>
            ))}
          </div>

          <label className="field-label" htmlFor="agent-intelligence-reply">
            Reply box
          </label>
          <textarea
            id="agent-intelligence-reply"
            className="text-area ai-reply-box"
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.currentTarget.value)}
          />

          <div className="inline-actions">
            <button
              type="button"
              className={`ai-action-btn ${FOCUS_RING}`}
              aria-expanded={popoverOpen}
              aria-controls={selectedTicket ? `ai-suggestion-${selectedTicket.ticketId}` : undefined}
              onClick={() => {
                if (!selectedTicket) return;
                setPopoverOpen((value) => !value);
                if (!aiSuggestionByTicket[selectedTicket.ticketId]) {
                  dispatch(generateAiSuggestion({ ticketId: selectedTicket.ticketId, draft: replyDraft }));
                }
              }}
            >
              AI Suggestion
            </button>
            <button
              type="button"
              className={`ai-action-btn ${FOCUS_RING}`}
              disabled={!selectedTicket}
              onClick={() => {
                if (!selectedTicket) return;
                dispatch(
                  generateAiSummary({
                    ticketId: selectedTicket.ticketId,
                    transcript: historyText
                  })
                );
              }}
            >
              Auto-summarize history
            </button>
          </div>

          {selectedTicket && selectedGhostSummary ? (
            <p className="ai-ghost-text" aria-live="polite">
              {selectedGhostSummary}
            </p>
          ) : null}

          <AiSuggestionPopover
            ticketId={selectedTicket?.ticketId ?? "none"}
            suggestion={selectedSuggestion}
            open={popoverOpen}
            onDismiss={() => setPopoverOpen(false)}
            onRegenerate={() => {
              if (!selectedTicket) return;
              dispatch(generateAiSuggestion({ ticketId: selectedTicket.ticketId, draft: replyDraft }));
            }}
            onInsert={() => {
              if (!selectedSuggestion) return;
              setReplyDraft((draft) => `${draft}${draft ? "\n\n" : ""}${selectedSuggestion}`);
              setPopoverOpen(false);
            }}
          />
        </section>
      ) : null}

      {activeTab === "timeline_alerts" ? (
        <div className="ai-layout-grid">
          <div className="space-y-4">
            <InteractionTimeline />
          </div>
          <section className="ai-glass-card space-y-3">
            <h4 className="ai-subheading">Live Alerts</h4>
            <ul className="suggestion-list" aria-label="Real-time incoming alerts">
              {alerts.map((alert) => (
                <li key={alert.alertId} className="suggestion-item">
                  <p>
                    <StatusBadge
                      status={alert.severity === "urgent" ? StatusType.Breached : StatusType.Open}
                      variant={alert.severity === "urgent" ? "solid" : "subtle"}
                      ariaLabel={`Alert severity: ${alert.severity}`}
                    />{" "}
                    {alert.message}
                  </p>
                  <p className="ai-subtle text-sm">{alert.createdAt}</p>
                  <button
                    type="button"
                    className={`btn-secondary btn-compact ${FOCUS_RING}`}
                    onClick={() => dispatch(dismissAlert(alert.alertId))}
                  >
                    Dismiss
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <aside className="ai-glass-card">
            <h3 className="ai-heading tracking-tight antialiased">Timeline context</h3>
            <p className="ai-subtle text-sm">Events loaded: {timelineEvents.length}</p>
            <p className="ai-subtle text-sm">Current ticket: {selectedTicket?.ticketId ?? "none"}</p>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
