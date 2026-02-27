import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/providers/store";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";
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

export function AgentIntelligenceDashboardPanel(): JSX.Element {
  const FOCUS_RING = "focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2";
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
    <section className="feature-panel ai-dashboard-root" aria-labelledby="agent-intelligence-dashboard-heading">
      <header className="ai-header-row">
        <h2 id="agent-intelligence-dashboard-heading" className="tracking-tight antialiased">
          agent-intelligence-dashboard
        </h2>
        <div className="inline-actions">
          <button
            type="button"
            className={`ai-action-btn ${FOCUS_RING}`}
            onClick={() => dispatch(addIncomingQueueTicket())}
          >
            Simulate incoming ticket
          </button>
        </div>
      </header>

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

      <p className="ai-subtle">
        Status: {summary.dashboardStatus} | Queue: {summary.queueCount} | Pending updates: {summary.pendingOperations}
      </p>

      <div className="ai-layout-grid">
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
                    <span className="ai-subtle">{ticket.subject}</span>
                    <span className="ai-subtle">
                      {ticket.customerId} | {ticket.status}
                      {pending ? " (syncing...)" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="space-y-4">
          <CustomerIntelligence pulse={pulse} />
          <InteractionTimeline />
        </div>

        <section className="ai-glass-card space-y-3">
          <h3 className="ai-heading tracking-tight antialiased">Case Actions</h3>
          <p className="ai-subtle">Selected ticket: {selectedTicket?.ticketId ?? "none"}</p>

          <div className="control-grid">
            {(["open", "pending", "resolved", "closed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`ai-action-btn ${FOCUS_RING}`}
                disabled={!selectedTicket}
                onClick={() => {
                  if (!selectedTicket) return;
                  dispatch(updateCaseStatusOptimistic({ ticketId: selectedTicket.ticketId, nextStatus: status }))
                    .unwrap()
                    .catch(() => {
                      emitTelemetry(dispatch, {
                        eventName: "case.status.rollback",
                        feature: "agent-intelligence-dashboard",
                        latencyMs: 0,
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

          <h4 className="ai-subheading">Live Alerts</h4>
          <ul className="suggestion-list" aria-label="Real-time incoming alerts">
            {alerts.map((alert) => (
              <li key={alert.alertId} className="suggestion-item">
                <p>
                  <strong>{alert.severity.toUpperCase()}</strong> {alert.message}
                </p>
                <p className="ai-subtle">{alert.createdAt}</p>
                <button
                  type="button"
                  className={`mini-btn ${FOCUS_RING}`}
                  onClick={() => dispatch(dismissAlert(alert.alertId))}
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
