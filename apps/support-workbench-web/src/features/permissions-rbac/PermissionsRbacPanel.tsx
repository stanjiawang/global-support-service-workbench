import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@app/providers/store";
import { setSelectedRoleId } from "@features/permissions-rbac/permissionsRbacSlice";
import {
  selectAuditControls,
  selectComplianceControls,
  selectPermissionsRbacSummary,
  selectRoles,
  selectSelectedRoleFieldAccess
} from "@features/permissions-rbac/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function PermissionsRbacPanel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector(selectPermissionsRbacSummary);
  const roles = useSelector(selectRoles);
  const selectedFieldAccess = useSelector(selectSelectedRoleFieldAccess);
  const compliance = useSelector(selectComplianceControls);
  const auditControls = useSelector(selectAuditControls);

  return (
    <section className="feature-panel" aria-labelledby="permissions-rbac-heading">
      <h2 id="permissions-rbac-heading">permissions-rbac</h2>
      <p>Role permissions, field-level access controls, and compliance/audit governance visibility.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Permissions RBAC summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Roles", value: String(summary.roleCount) },
          { label: "Field access entries", value: String(summary.fieldAccessCount) },
          { label: "Compliance controls", value: String(summary.complianceCount) },
          { label: "Audit controls", value: String(summary.auditControlCount) },
          { label: "Selected role", value: summary.selectedRoleId },
          { label: "Last fetched", value: summary.fetchedAt ?? "N/A" },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      <h3>Roles</h3>
      <div className="control-grid" role="group" aria-label="Role selection">
        <select
          className="text-input"
          aria-label="Select role"
          value={summary.selectedRoleId === "N/A" ? "" : summary.selectedRoleId}
          onChange={(event) => dispatch(setSelectedRoleId(event.currentTarget.value))}
        >
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        rows={roles}
        getRowKey={(row) => row.roleId}
        emptyMessage="No roles."
        columns={[
          { key: "role", header: "Role", render: (row) => row.roleName },
          { key: "permissions", header: "Permissions", render: (row) => row.permissions.join(", ") }
        ]}
      />

      <h3>Field-Level Access</h3>
      <DataTable
        rows={selectedFieldAccess}
        getRowKey={(row) => `${row.roleId}-${row.fieldId}`}
        emptyMessage="No field access entries for selected role."
        columns={[
          { key: "field", header: "Field", render: (row) => row.fieldName },
          { key: "access", header: "Access", render: (row) => row.access }
        ]}
      />

      <h3>Compliance Controls</h3>
      <DataTable
        rows={compliance}
        getRowKey={(row) => row.controlId}
        emptyMessage="No compliance controls."
        columns={[
          { key: "name", header: "Control", render: (row) => row.name },
          { key: "status", header: "Status", render: (row) => row.status },
          { key: "owner", header: "Owner", render: (row) => row.owner }
        ]}
      />

      <h3>Audit Controls</h3>
      <DataTable
        rows={auditControls}
        getRowKey={(row) => row.auditId}
        emptyMessage="No audit controls."
        columns={[
          { key: "event", header: "Event type", render: (row) => row.eventType },
          { key: "retention", header: "Retention days", render: (row) => String(row.retentionDays) },
          { key: "redaction", header: "PII redaction", render: (row) => (row.piiRedaction ? "enabled" : "disabled") }
        ]}
      />
    </section>
  );
}
