import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { acceptSuggestion, loadKnowledgeAssistSnapshot, rejectSuggestion } from "@features/knowledge-assist/knowledgeAssistSlice";
import { selectKnowledgeAssistSummary, selectKnowledgeSuggestionViews } from "@features/knowledge-assist/selectors";
import { DetailList } from "@shared/ui/DetailList";

export function KnowledgeAssistPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectKnowledgeAssistSummary);
  const suggestions = useSelector(selectKnowledgeSuggestionViews);

  return (
    <section className="feature-panel ux-panel" aria-labelledby="knowledge-assist-heading">
      <h2 id="knowledge-assist-heading">knowledge-assist</h2>
      <p>Mock suggestion workflow with accept/reject feedback loop and status tracking.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Knowledge assist summary"
        items={[
          { label: "Status", value: summary.status },
          { label: "Total suggestions", value: String(summary.totalSuggestions) },
          { label: "Accepted", value: String(summary.acceptedCount) },
          { label: "Rejected", value: String(summary.rejectedCount) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" }
        ]}
      />

      <h3>Suggestions</h3>
      <ul className="suggestion-list">
        {suggestions.map(({ suggestion, decision }) => (
          <li key={suggestion.suggestionId} className="suggestion-item">
            <div>
              <strong>{suggestion.title}</strong>
              <div className="suggestion-meta">
                <span>Category: {suggestion.category}</span>
                <span>Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
                <span>Decision: {decision}</span>
              </div>
            </div>
            <div className="suggestion-actions">
              <button
                type="button"
                className="btn-success"
                onClick={() => dispatch(acceptSuggestion(suggestion.suggestionId))}
              >
                Accept
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => dispatch(rejectSuggestion(suggestion.suggestionId))}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="panel-actions">
        <button type="button" className="btn-secondary" onClick={() => dispatch(loadKnowledgeAssistSnapshot())}>
          Reload suggestions
        </button>
      </div>
    </section>
  );
}
