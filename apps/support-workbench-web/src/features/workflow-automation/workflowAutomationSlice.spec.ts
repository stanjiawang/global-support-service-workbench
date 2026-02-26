import { describe, expect, it } from "vitest";
import {
  loadWorkflowAutomation,
  toggleRule,
  toggleTrigger,
  workflowAutomationReducer
} from "@features/workflow-automation/workflowAutomationSlice";

describe("workflowAutomationSlice", () => {
  it("loads snapshot and toggles trigger/rule", () => {
    let state = workflowAutomationReducer(undefined, { type: "seed" });
    state = workflowAutomationReducer(state, {
      type: loadWorkflowAutomation.fulfilled.type,
      payload: {
        fetchedAt: "2026-02-26T19:38:00Z",
        triggers: [{ triggerId: "t1", name: "SLA", condition: "a", enabled: true }],
        macros: [],
        templates: [],
        rules: [{ ruleId: "r1", type: "auto-assign", description: "x", target: "queue", enabled: true }]
      }
    });
    state = workflowAutomationReducer(state, toggleTrigger("t1"));
    state = workflowAutomationReducer(state, toggleRule("r1"));
    expect(state.triggers[0]?.enabled).toBe(false);
    expect(state.rules[0]?.enabled).toBe(false);
  });
});
