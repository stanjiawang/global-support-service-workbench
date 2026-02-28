import type { FeatureRoute } from "@app/routing/routes";
import { fetchMockFeaturePayload, type MockFeaturePayload } from "@shared/network/mockBackend";
import { useEffect, useState } from "react";

interface FeaturePanelProps {
  readonly route: FeatureRoute;
  readonly onRouteRestore: (route: FeatureRoute) => void;
}

export function FeaturePanel({ route, onRouteRestore }: FeaturePanelProps): JSX.Element {
  const [payload, setPayload] = useState<MockFeaturePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPayload(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const next = await fetchMockFeaturePayload(route);
        if (active) {
          setPayload(next);
        }
      } catch {
        if (active) {
          setError("Failed to load mock backend payload.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadPayload();
    return () => {
      active = false;
    };
  }, [route]);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="feature-heading">
      <h2 id="feature-heading">{payload?.featureName ?? "Loading feature"}</h2>
      <p>Mock backend is active. This is the shared fallback panel for non-slice routes.</p>

      {isLoading ? <p>Loading mock data...</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      {!isLoading && !error && payload ? (
        <>
          <div className="feature-meta">
            <span>Path: {payload.featureRoute}</span>
            <span>Owning pod: {payload.ownershipPod}</span>
          </div>

          <h3>KPIs</h3>
          <ul>
            {payload.kpis.map((kpi) => (
              <li key={kpi.label}>
                {kpi.label}: {kpi.value}
              </li>
            ))}
          </ul>

          <h3>Timeline</h3>
          <ul>
            {payload.timeline.map((item) => (
              <li key={item.id}>
                [{item.channel}] {item.summary} ({item.timestamp})
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="panel-actions">
        <button type="button" className="btn-secondary" onClick={() => onRouteRestore(route)}>
          Refresh local state
        </button>
      </div>
    </section>
  );
}
