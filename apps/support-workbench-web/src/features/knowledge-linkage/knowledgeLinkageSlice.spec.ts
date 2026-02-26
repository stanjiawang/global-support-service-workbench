import { describe, expect, it } from "vitest";
import { knowledgeLinkageReducer, loadKnowledgeLinkage, setSelectedKnowledgeArticle } from "@features/knowledge-linkage/knowledgeLinkageSlice";

describe("knowledgeLinkageSlice", () => {
  it("loads snapshot and tracks selected article", () => {
    let state = knowledgeLinkageReducer(undefined, { type: "seed" });
    state = knowledgeLinkageReducer(state, {
      type: loadKnowledgeLinkage.fulfilled.type,
      payload: {
        fetchedAt: "2026-02-26T20:02:00Z",
        articles: [{ articleId: "kb-1", title: "a", topic: "billing", version: "v1", linkedTicketIds: ["TKT-1201"] }],
        deflections: [],
        feedback: []
      }
    });
    state = knowledgeLinkageReducer(state, setSelectedKnowledgeArticle("kb-1"));
    expect(state.status).toBe("ready");
    expect(state.selectedArticleId).toBe("kb-1");
  });
});
