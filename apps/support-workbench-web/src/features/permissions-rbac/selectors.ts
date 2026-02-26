import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@app/providers/store";

const selectSlice = (state: RootState) => state.permissionsRbac;

export const selectPermissionsRbacSummary = createSelector([selectSlice], (slice) => {
  return {
    status: slice.status,
    roleCount: slice.roles.length,
    fieldAccessCount: slice.fieldAccess.length,
    complianceCount: slice.compliance.length,
    auditControlCount: slice.auditControls.length,
    selectedRoleId: slice.selectedRoleId || "N/A",
    fetchedAt: slice.fetchedAt,
    error: slice.error
  };
});

export const selectRoles = createSelector([selectSlice], (slice) => slice.roles);
export const selectComplianceControls = createSelector([selectSlice], (slice) => slice.compliance);
export const selectAuditControls = createSelector([selectSlice], (slice) => slice.auditControls);
export const selectSelectedRoleFieldAccess = createSelector([selectSlice], (slice) => {
  return slice.fieldAccess.filter((item) => item.roleId === slice.selectedRoleId);
});
