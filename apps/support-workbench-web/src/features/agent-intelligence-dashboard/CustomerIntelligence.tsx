/**
 * UX rationale: this component compresses triage-critical customer context into one horizontal scan,
 * so agents can prioritize action in under two seconds without hunting across multiple panels.
 */
import type { CustomerPulseModel } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";

interface CustomerIntelligenceProps {
  pulse: CustomerPulseModel | null;
}

function riskLabel(score: number): string {
  if (score >= 80) return "critical risk";
  if (score >= 60) return "elevated risk";
  if (score >= 40) return "moderate risk";
  return "low risk";
}

export function CustomerIntelligence({ pulse }: CustomerIntelligenceProps): JSX.Element {
  if (!pulse) {
    return (
      <section className="ai-glass-card">
        <h3 className="ai-heading">Customer Pulse</h3>
        <p className="ai-subtle">Loading pulse data...</p>
      </section>
    );
  }

  return (
    <section className="ai-glass-card space-y-3" aria-labelledby="customer-pulse-heading">
      <h3 id="customer-pulse-heading" className="ai-heading tracking-tight antialiased">
        Customer Pulse
      </h3>
      <div className="grid gap-2 sm:grid-cols-4">
        <article className="ai-chip-group" aria-label={`Sentiment ${pulse.sentiment}`}>
          <p className="ai-chip-label">Sentiment</p>
          <p className="ai-chip-value">{pulse.sentiment}</p>
        </article>
        <article className="ai-chip-group" aria-label={`Device health ${pulse.deviceHealth}`}>
          <p className="ai-chip-label">Device Health</p>
          <p className="ai-chip-value">{pulse.deviceHealth}</p>
        </article>
        <article className="ai-chip-group" aria-label={`Case urgency ${pulse.urgency}`}>
          <p className="ai-chip-label">Case Urgency</p>
          <p className="ai-chip-value">{pulse.urgency}</p>
        </article>
        <article className="ai-chip-group" aria-label={`Risk score ${pulse.riskScore}`}>
          <p className="ai-chip-label">Risk Score</p>
          <p className="ai-chip-value">
            {pulse.riskScore} <span className="ai-subtle">({riskLabel(pulse.riskScore)})</span>
          </p>
        </article>
      </div>
    </section>
  );
}
