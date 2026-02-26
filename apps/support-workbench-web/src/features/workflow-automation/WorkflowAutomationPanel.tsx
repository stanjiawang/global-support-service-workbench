import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { toggleRule, toggleTrigger } from "@features/workflow-automation/workflowAutomationSlice";
import {
  selectWorkflowAutomationSummary,
  selectWorkflowMacros,
  selectWorkflowRules,
  selectWorkflowTemplates,
  selectWorkflowTriggers
} from "@features/workflow-automation/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function WorkflowAutomationPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectWorkflowAutomationSummary);
  const triggers = useSelector(selectWorkflowTriggers);
  const macros = useSelector(selectWorkflowMacros);
  const templates = useSelector(selectWorkflowTemplates);
  const rules = useSelector(selectWorkflowRules);

  return (
    <section className="feature-panel" aria-labelledby="workflow-automation-heading">
      <h2 id="workflow-automation-heading">workflow-automation</h2>
      <p>Trigger/macro/template automation with auto-assign and escalation policy toggles.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Workflow automation summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Triggers", value: `${summary.enabledTriggers}/${summary.triggerCount}` },
          { label: "Rules", value: `${summary.enabledRules}/${summary.ruleCount}` },
          { label: "Macros", value: String(summary.macroCount) },
          { label: "Templates", value: String(summary.templateCount) },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Triggers</h3>
      <DataTable
        rows={triggers}
        getRowKey={(row) => row.triggerId}
        emptyMessage="No triggers."
        columns={[
          { key: "name", header: "Name", render: (row) => row.name },
          { key: "condition", header: "Condition", render: (row) => row.condition },
          {
            key: "enabled",
            header: "Enabled",
            render: (row) => (
              <button type="button" className="mini-btn" onClick={() => dispatch(toggleTrigger(row.triggerId))}>
                {row.enabled ? "On" : "Off"}
              </button>
            )
          }
        ]}
      />

      <h3>Macros</h3>
      <DataTable
        rows={macros}
        getRowKey={(row) => row.macroId}
        emptyMessage="No macros."
        columns={[
          { key: "name", header: "Macro", render: (row) => row.name },
          { key: "actions", header: "Actions", render: (row) => row.actions.join(" -> ") }
        ]}
      />

      <h3>Templates</h3>
      <DataTable
        rows={templates}
        getRowKey={(row) => row.templateId}
        emptyMessage="No templates."
        columns={[
          { key: "name", header: "Template", render: (row) => row.name },
          { key: "channel", header: "Channel", render: (row) => row.channel },
          { key: "preview", header: "Preview", render: (row) => row.bodyPreview }
        ]}
      />

      <h3>Rules</h3>
      <DataTable
        rows={rules}
        getRowKey={(row) => row.ruleId}
        emptyMessage="No rules."
        columns={[
          { key: "type", header: "Type", render: (row) => row.type },
          { key: "description", header: "Description", render: (row) => row.description },
          { key: "target", header: "Target", render: (row) => row.target },
          {
            key: "enabled",
            header: "Enabled",
            render: (row) => (
              <button type="button" className="mini-btn" onClick={() => dispatch(toggleRule(row.ruleId))}>
                {row.enabled ? "On" : "Off"}
              </button>
            )
          }
        ]}
      />
    </section>
  );
}
