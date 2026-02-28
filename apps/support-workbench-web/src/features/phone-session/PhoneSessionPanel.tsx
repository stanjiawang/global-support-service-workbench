import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/providers/store";
import { acceptCurrentHandoffOnPhone, escalateCurrentHandoffToCase } from "@app/providers/simulationActions";
import {
  loadPhoneSessionSnapshot,
  setPhoneNetworkProfile,
  setPhonePrimaryFailure
} from "@features/phone-session/phoneSessionSlice";
import { selectPhoneSessionSummary } from "@features/phone-session/selectors";
import { PHONE_NETWORK_PROFILES } from "@shared/network/transportSimulator";
import { selectActiveHandoff } from "@shared/state/handoffSelectors";
import { DetailList } from "@shared/ui/DetailList";

export function PhoneSessionPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectPhoneSessionSummary);
  const selectedProfileId = useSelector((state: RootState) => state.phoneSession.selectedProfileId);
  const activeHandoff = useSelector(selectActiveHandoff);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="phone-session-heading">
      <h2 id="phone-session-heading">phone-session</h2>
      <p>Transport simulation with fallback chain and graceful degradation policy.</p>

      <h3>Controls</h3>
      <div className="control-grid" role="group" aria-label="Phone session controls">
        {PHONE_NETWORK_PROFILES.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className={selectedProfileId === profile.id ? "btn-primary" : "btn-secondary"}
            onClick={() => {
              dispatch(setPhoneNetworkProfile(profile.id));
              dispatch(loadPhoneSessionSnapshot());
            }}
          >
            {profile.label}
          </button>
        ))}

        <button
          type="button"
          className={summary.forcePrimaryFailure ? "btn-warning" : "btn-secondary"}
          onClick={() => {
            dispatch(setPhonePrimaryFailure(!summary.forcePrimaryFailure));
            dispatch(loadPhoneSessionSnapshot());
          }}
        >
          {summary.forcePrimaryFailure ? "Primary failure: ON" : "Primary failure: OFF"}
        </button>

        <button type="button" className="btn-secondary" onClick={() => dispatch(loadPhoneSessionSnapshot())}>
          Refresh transport snapshot
        </button>

        <button type="button" className="btn-success" onClick={() => dispatch(acceptCurrentHandoffOnPhone())}>
          Accept active handoff
        </button>

        <button type="button" className="btn-warning" onClick={() => dispatch(escalateCurrentHandoffToCase())}>
          Escalate active handoff to case
        </button>
      </div>

      <h3>Transport Summary</h3>
      <DetailList
        ariaLabel="Phone session transport summary"
        items={[
          { label: "Status", value: summary.status },
          { label: "Network profile", value: summary.profileLabel },
          { label: "Selected transport", value: summary.selectedTransport },
          { label: "Fallback depth", value: String(summary.fallbackDepth) },
          { label: "Polling interval (ms)", value: String(summary.pollingIntervalMs) },
          { label: "Degraded mode", value: summary.degradedMode ? "true" : "false" },
          { label: "Queue depth", value: String(summary.queueDepth) },
          { label: "Active calls", value: String(summary.activeCalls) },
          { label: "Reconnect attempts", value: String(summary.reconnectAttempts) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Active handoff", value: activeHandoff?.handoffId ?? "none" },
          { label: "Handoff stage", value: activeHandoff?.stage ?? "none" }
        ]}
      />
    </section>
  );
}
