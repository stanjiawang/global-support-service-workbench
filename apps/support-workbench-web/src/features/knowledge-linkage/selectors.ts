import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

const selectSlice = (state: RootState) => state.knowledgeLinkage;

export const selectKnowledgeLinkageSummary = createSelector([selectSlice], (slice) => {
  const deflected = slice.deflections.filter((item) => item.deflected).length;
  return {
    status: slice.status,
    articleCount: slice.articles.length,
    deflectionCount: slice.deflections.length,
    deflectionSuccessRate: slice.deflections.length > 0 ? Math.round((deflected / slice.deflections.length) * 100) : 0,
    feedbackCount: slice.feedback.length,
    selectedArticleId: slice.selectedArticleId || "N/A",
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectKnowledgeArticles = createSelector([selectSlice], (slice) => slice.articles);
export const selectKnowledgeArticleDeflections = createSelector([selectSlice], (slice) =>
  slice.deflections.filter((item) => item.articleId === slice.selectedArticleId)
);
export const selectKnowledgeArticleFeedback = createSelector([selectSlice], (slice) =>
  slice.feedback.filter((item) => item.articleId === slice.selectedArticleId)
);
