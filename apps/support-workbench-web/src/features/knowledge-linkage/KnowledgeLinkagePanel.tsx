import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { setSelectedKnowledgeArticle } from "@features/knowledge-linkage/knowledgeLinkageSlice";
import {
  selectKnowledgeArticleDeflections,
  selectKnowledgeArticleFeedback,
  selectKnowledgeArticles,
  selectKnowledgeLinkageSummary
} from "@features/knowledge-linkage/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function KnowledgeLinkagePanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectKnowledgeLinkageSummary);
  const articles = useSelector(selectKnowledgeArticles);
  const deflections = useSelector(selectKnowledgeArticleDeflections);
  const feedback = useSelector(selectKnowledgeArticleFeedback);

  return (
    <section className="feature-panel" aria-labelledby="knowledge-linkage-heading">
      <h2 id="knowledge-linkage-heading">knowledge-linkage</h2>
      <p>Knowledge article linkage with deflection outcomes and quality feedback loop.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Knowledge linkage summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Articles", value: String(summary.articleCount) },
          { label: "Deflections", value: String(summary.deflectionCount) },
          { label: "Deflection success %", value: String(summary.deflectionSuccessRate) },
          { label: "Feedback entries", value: String(summary.feedbackCount) },
          { label: "Selected article", value: summary.selectedArticleId },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Linked Articles</h3>
      <DataTable
        rows={articles}
        getRowKey={(row) => row.articleId}
        emptyMessage="No linked articles."
        columns={[
          {
            key: "pick",
            header: "Select",
            render: (row) => (
              <button type="button" className="mini-btn" onClick={() => dispatch(setSelectedKnowledgeArticle(row.articleId))}>
                Open
              </button>
            )
          },
          { key: "article", header: "Article", render: (row) => row.articleId },
          { key: "title", header: "Title", render: (row) => row.title },
          { key: "topic", header: "Topic", render: (row) => row.topic },
          { key: "version", header: "Version", render: (row) => row.version },
          { key: "tickets", header: "Linked tickets", render: (row) => row.linkedTicketIds.join(", ") }
        ]}
      />

      <h3>Deflection Tracking</h3>
      <DataTable
        rows={deflections}
        getRowKey={(row) => row.eventId}
        emptyMessage="No deflection events for selected article."
        columns={[
          { key: "time", header: "Captured", render: (row) => row.capturedAt },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "result", header: "Deflected", render: (row) => (row.deflected ? "yes" : "no") }
        ]}
      />

      <h3>Feedback Loop</h3>
      <DataTable
        rows={feedback}
        getRowKey={(row) => row.feedbackId}
        emptyMessage="No feedback for selected article."
        columns={[
          { key: "time", header: "Submitted", render: (row) => row.submittedAt },
          { key: "ticket", header: "Ticket", render: (row) => row.ticketId },
          { key: "rating", header: "Rating", render: (row) => String(row.rating) },
          { key: "comment", header: "Comment", render: (row) => row.comment }
        ]}
      />
    </section>
  );
}
