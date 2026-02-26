export interface MockRolePermission {
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface MockFieldAccess {
  fieldId: string;
  fieldName: string;
  roleId: string;
  access: "none" | "read" | "write";
}

export interface MockComplianceControl {
  controlId: string;
  name: string;
  status: "pass" | "warning" | "fail";
  owner: string;
}

export interface MockAuditControl {
  auditId: string;
  eventType: string;
  retentionDays: number;
  piiRedaction: boolean;
}

export interface MockPermissionsSnapshot {
  fetchedAt: string;
  roles: MockRolePermission[];
  fieldAccess: MockFieldAccess[];
  compliance: MockComplianceControl[];
  auditControls: MockAuditControl[];
}

export async function fetchMockPermissionsSnapshot(signal?: AbortSignal): Promise<MockPermissionsSnapshot> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 130);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

  return {
    fetchedAt: "2026-02-26T19:50:00Z",
    roles: [
      { roleId: "role-agent", roleName: "Support Agent", permissions: ["ticket.read", "ticket.update", "case.comment"] },
      { roleId: "role-lead", roleName: "Team Lead", permissions: ["ticket.read", "ticket.update", "queue.assign", "report.view"] },
      { roleId: "role-admin", roleName: "System Admin", permissions: ["*"] }
    ],
    fieldAccess: [
      { fieldId: "f-email", fieldName: "customerEmail", roleId: "role-agent", access: "read" },
      { fieldId: "f-phone", fieldName: "customerPhone", roleId: "role-agent", access: "read" },
      { fieldId: "f-notes", fieldName: "internalNotes", roleId: "role-agent", access: "write" },
      { fieldId: "f-pii", fieldName: "governmentId", roleId: "role-agent", access: "none" },
      { fieldId: "f-pii", fieldName: "governmentId", roleId: "role-admin", access: "read" }
    ],
    compliance: [
      { controlId: "cmp-1", name: "PII Redaction Coverage", status: "pass", owner: "Security Engineering" },
      { controlId: "cmp-2", name: "Access Recertification", status: "warning", owner: "IAM Operations" },
      { controlId: "cmp-3", name: "Audit Trail Immutability", status: "pass", owner: "Platform" }
    ],
    auditControls: [
      { auditId: "aud-1", eventType: "permission.changed", retentionDays: 365, piiRedaction: true },
      { auditId: "aud-2", eventType: "field.accessed", retentionDays: 180, piiRedaction: true },
      { auditId: "aud-3", eventType: "role.assigned", retentionDays: 365, piiRedaction: true }
    ]
  };
}
