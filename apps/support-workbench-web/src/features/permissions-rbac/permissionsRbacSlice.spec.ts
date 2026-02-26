import { describe, expect, it } from "vitest";
import { loadPermissionsRbac, permissionsRbacReducer, setSelectedRoleId } from "@features/permissions-rbac/permissionsRbacSlice";

describe("permissionsRbacSlice", () => {
  it("loads snapshot and supports selecting role", () => {
    let state = permissionsRbacReducer(undefined, { type: "seed" });
    state = permissionsRbacReducer(state, {
      type: loadPermissionsRbac.fulfilled.type,
      payload: {
        fetchedAt: "2026-02-26T19:50:00Z",
        roles: [{ roleId: "r1", roleName: "Agent", permissions: ["ticket.read"] }],
        fieldAccess: [],
        compliance: [],
        auditControls: []
      }
    });
    state = permissionsRbacReducer(state, setSelectedRoleId("r1"));
    expect(state.status).toBe("ready");
    expect(state.selectedRoleId).toBe("r1");
  });
});
