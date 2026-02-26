import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FeatureRoute } from "@app/routing/routes";
import { assignmentRoutingReducer } from "@features/assignment-routing/assignmentRoutingSlice";
import { agentPresenceReducer } from "@features/agent-presence/agentPresenceSlice";
import { caseEditorReducer } from "@features/case-editor/caseEditorSlice";
import { caseHistoryReducer } from "@features/case-history/caseHistorySlice";
import { chatSessionReducer } from "@features/chat-session/chatSessionSlice";
import { communicationLoggingReducer } from "@features/communication-logging/communicationLoggingSlice";
import { customerProfileDepthReducer } from "@features/customer-profile-depth/customerProfileDepthSlice";
import { knowledgeAssistReducer } from "@features/knowledge-assist/knowledgeAssistSlice";
import { permissionsRbacReducer } from "@features/permissions-rbac/permissionsRbacSlice";
import { phoneSessionReducer } from "@features/phone-session/phoneSessionSlice";
import { telemetryReducer } from "@app/providers/telemetrySlice";
import { handoffReducer } from "@app/providers/handoffSlice";
import { ticketDetailReducer } from "@features/ticket-detail/ticketDetailSlice";
import { ticketSearchReducer } from "@features/ticket-search/ticketSearchSlice";
import { ticketWorkspaceReducer } from "@features/ticket-workspace/ticketWorkspaceSlice";
import { workflowAutomationReducer } from "@features/workflow-automation/workflowAutomationSlice";

interface WorkbenchUiState {
  readonly activeRoute: FeatureRoute;
}

const initialState: WorkbenchUiState = {
  activeRoute: "/customer-360"
};

const workbenchUiSlice = createSlice({
  name: "workbenchUi",
  initialState,
  reducers: {
    setActiveRoute(state, action: PayloadAction<FeatureRoute>) {
      state.activeRoute = action.payload;
    }
  }
});

export const { setActiveRoute } = workbenchUiSlice.actions;

export function createWorkbenchStore() {
  return configureStore({
    reducer: {
      workbenchUi: workbenchUiSlice.reducer,
      assignmentRouting: assignmentRoutingReducer,
      customerProfileDepth: customerProfileDepthReducer,
      communicationLogging: communicationLoggingReducer,
      permissionsRbac: permissionsRbacReducer,
      chatSession: chatSessionReducer,
      caseHistory: caseHistoryReducer,
      caseEditor: caseEditorReducer,
      phoneSession: phoneSessionReducer,
      knowledgeAssist: knowledgeAssistReducer,
      agentPresence: agentPresenceReducer,
      telemetry: telemetryReducer,
      handoff: handoffReducer,
      ticketDetail: ticketDetailReducer,
      ticketSearch: ticketSearchReducer,
      ticketWorkspace: ticketWorkspaceReducer,
      workflowAutomation: workflowAutomationReducer
    }
  });
}

export const store = createWorkbenchStore();
export type WorkbenchStore = ReturnType<typeof createWorkbenchStore>;
export type RootState = ReturnType<WorkbenchStore["getState"]>;
export type AppDispatch = WorkbenchStore["dispatch"];
