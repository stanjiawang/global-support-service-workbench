/**
 * UX rationale: timeline grouping and channel semantics reduce context-switching cost by preserving
 * a coherent "truth sequence" while making channel source obvious without relying on color alone.
 */
import type { TimelineChannel } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";
import { selectTimelineGroups } from "@features/agent-intelligence-dashboard/selectors";
import { useSelector } from "react-redux";

function channelMeta(channel: TimelineChannel): { label: string; className: string; icon: string; shape: string } {
  if (channel === "chat") return { label: "Chat", className: "ai-channel-chat", icon: "CH", shape: "ai-shape-circle" };
  if (channel === "phone")
    return { label: "Phone", className: "ai-channel-phone", icon: "PH", shape: "ai-shape-square" };
  return { label: "Store Visit", className: "ai-channel-store", icon: "SV", shape: "ai-shape-diamond" };
}

export function InteractionTimeline(): JSX.Element {
  const FOCUS_RING = "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2";
  const groups = useSelector(selectTimelineGroups);

  return (
    <section className="ai-glass-card space-y-4" aria-labelledby="timeline-heading">
      <h3 id="timeline-heading" className="ai-heading tracking-tight antialiased">
        Timeline of Truth
      </h3>
      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.label} aria-label={`${group.label} interactions`}>
            <h4 className="ai-subheading">{group.label}</h4>
            <ol className="ai-timeline-list">
              {group.events.map((event) => {
                const meta = channelMeta(event.channel);
                return (
                  <li key={event.eventId} className="ai-timeline-item">
                    <button
                      type="button"
                      className={`ai-timeline-focus ${FOCUS_RING}`}
                      aria-label={`${meta.label} at ${event.occurredAt}. ${event.summary}`}
                    >
                      <span className={`ai-channel-tag ${meta.className}`}>
                        <span className={`ai-shape ${meta.shape}`} aria-hidden="true" />
                        <span className="ai-channel-icon" aria-hidden="true">
                          {meta.icon}
                        </span>
                        <span>{meta.label}</span>
                      </span>
                      <span className="ai-timeline-meta">{event.occurredAt}</span>
                      <strong>{event.title}</strong>
                      <p className="ai-subtle">{event.summary}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
