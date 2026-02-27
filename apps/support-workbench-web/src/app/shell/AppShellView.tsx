import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/providers/store";
import { setActiveRoute } from "@app/providers/store";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";
import { loadRoutingSnapshot } from "@features/assignment-routing/assignmentRoutingSlice";
import { loadAgentIntelligenceDashboard } from "@features/agent-intelligence-dashboard/agentIntelligenceSlice";
import { loadAgentPresenceSnapshot } from "@features/agent-presence/agentPresenceSlice";
import { discardDraftChanges, loadCaseDraft } from "@features/case-editor/caseEditorSlice";
import { loadCaseHistorySnapshot } from "@features/case-history/caseHistorySlice";
import { loadChatSessionSnapshot } from "@features/chat-session/chatSessionSlice";
import { loadCommunicationSnapshot } from "@features/communication-logging/communicationLoggingSlice";
import { loadCustomerProfileDepth } from "@features/customer-profile-depth/customerProfileDepthSlice";
import { loadKnowledgeAssistSnapshot } from "@features/knowledge-assist/knowledgeAssistSlice";
import { loadKnowledgeLinkage } from "@features/knowledge-linkage/knowledgeLinkageSlice";
import { loadPermissionsRbac } from "@features/permissions-rbac/permissionsRbacSlice";
import { loadPhoneSessionSnapshot } from "@features/phone-session/phoneSessionSlice";
import { loadReportingDashboards } from "@features/reporting-dashboards/reportingDashboardsSlice";
import { loadTicketDetail, loadTicketDirectory } from "@features/ticket-detail/ticketDetailSlice";
import { loadTicketSearchIndex } from "@features/ticket-search/ticketSearchSlice";
import { loadTicketWorkspaceIndex } from "@features/ticket-workspace/ticketWorkspaceSlice";
import { loadWorkflowAutomation } from "@features/workflow-automation/workflowAutomationSlice";
import { ROUTE_DESCRIPTORS, type FeatureRoute } from "@app/routing/routes";
import { routeFromHash } from "@app/routing/routeState";
import "./app-shell.css";

const Customer360Panel = lazy(() =>
  import("@features/customer-360/Customer360Panel").then((module) => ({ default: module.Customer360Panel }))
);
const AgentIntelligenceDashboardPanel = lazy(() =>
  import("@features/agent-intelligence-dashboard/AgentIntelligenceDashboardPanel").then((module) => ({
    default: module.AgentIntelligenceDashboardPanel
  }))
);
const CustomerProfileDepthPanel = lazy(() =>
  import("@features/customer-profile-depth/CustomerProfileDepthPanel").then((module) => ({
    default: module.CustomerProfileDepthPanel
  }))
);
const CommunicationLoggingPanel = lazy(() =>
  import("@features/communication-logging/CommunicationLoggingPanel").then((module) => ({
    default: module.CommunicationLoggingPanel
  }))
);
const WorkflowAutomationPanel = lazy(() =>
  import("@features/workflow-automation/WorkflowAutomationPanel").then((module) => ({
    default: module.WorkflowAutomationPanel
  }))
);
const PermissionsRbacPanel = lazy(() =>
  import("@features/permissions-rbac/PermissionsRbacPanel").then((module) => ({
    default: module.PermissionsRbacPanel
  }))
);
const KnowledgeLinkagePanel = lazy(() =>
  import("@features/knowledge-linkage/KnowledgeLinkagePanel").then((module) => ({
    default: module.KnowledgeLinkagePanel
  }))
);
const ReportingDashboardsPanel = lazy(() =>
  import("@features/reporting-dashboards/ReportingDashboardsPanel").then((module) => ({
    default: module.ReportingDashboardsPanel
  }))
);
const AssignmentRoutingPanel = lazy(() =>
  import("@features/assignment-routing/AssignmentRoutingPanel").then((module) => ({ default: module.AssignmentRoutingPanel }))
);
const ChatSessionPanel = lazy(() =>
  import("@features/chat-session/ChatSessionPanel").then((module) => ({ default: module.ChatSessionPanel }))
);
const CaseHistoryPanel = lazy(() =>
  import("@features/case-history/CaseHistoryPanel").then((module) => ({ default: module.CaseHistoryPanel }))
);
const CaseEditorPanel = lazy(() =>
  import("@features/case-editor/CaseEditorPanel").then((module) => ({ default: module.CaseEditorPanel }))
);
const PhoneSessionPanel = lazy(() =>
  import("@features/phone-session/PhoneSessionPanel").then((module) => ({ default: module.PhoneSessionPanel }))
);
const KnowledgeAssistPanel = lazy(() =>
  import("@features/knowledge-assist/KnowledgeAssistPanel").then((module) => ({ default: module.KnowledgeAssistPanel }))
);
const TicketSearchPanel = lazy(() =>
  import("@features/ticket-search/TicketSearchPanel").then((module) => ({ default: module.TicketSearchPanel }))
);
const TicketDetailPanel = lazy(() =>
  import("@features/ticket-detail/TicketDetailPanel").then((module) => ({ default: module.TicketDetailPanel }))
);
const TicketWorkspacePanel = lazy(() =>
  import("@features/ticket-workspace/TicketWorkspacePanel").then((module) => ({ default: module.TicketWorkspacePanel }))
);
const AgentPresencePanel = lazy(() =>
  import("@features/agent-presence/AgentPresencePanel").then((module) => ({ default: module.AgentPresencePanel }))
);
const FeaturePanel = lazy(() =>
  import("@features/agent-presence/FeaturePanel").then((module) => ({ default: module.FeaturePanel }))
);

function titleFromRoute(route: FeatureRoute): string {
  return ROUTE_DESCRIPTORS.find((descriptor) => descriptor.path === route)?.feature ?? "unknown";
}

export function AppShellView(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const activeRoute = useSelector((state: RootState) => state.workbenchUi.activeRoute);
  const isCaseDraftDirty = useSelector((state: RootState) => state.caseEditor.isDirty);
  const pendingRequestsRef = useRef<Array<{ abort: () => void }>>([]);
  const previousRouteRef = useRef<FeatureRoute | null>(null);
  const [pendingRoute, setPendingRoute] = useState<FeatureRoute | null>(null);
  const effectivePendingRoute = isCaseDraftDirty ? pendingRoute : null;

  useEffect(() => {
    if (previousRouteRef.current !== activeRoute) {
      emitTelemetry(dispatch, {
        eventName: "route.changed",
        feature: activeRoute,
        latencyMs: 0
      });
      previousRouteRef.current = activeRoute;
    }
  }, [activeRoute, dispatch]);

  useEffect(() => {
    const startedAt = performance.now();

    for (const request of pendingRequestsRef.current) {
      request.abort();
    }
    pendingRequestsRef.current = [];

    const emitLoaded = (): void => {
      emitTelemetry(dispatch, {
        eventName: "feature.snapshot.requested",
        feature: activeRoute,
        latencyMs: Math.round(performance.now() - startedAt)
      });
    };

    if (activeRoute === "/chat-session") {
      pendingRequestsRef.current = [dispatch(loadChatSessionSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/agent-intelligence-dashboard") {
      pendingRequestsRef.current = [dispatch(loadAgentIntelligenceDashboard())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/assignment-routing") {
      pendingRequestsRef.current = [dispatch(loadRoutingSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/customer-profile-depth") {
      pendingRequestsRef.current = [dispatch(loadCustomerProfileDepth())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/communication-logging") {
      pendingRequestsRef.current = [dispatch(loadCommunicationSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/workflow-automation") {
      pendingRequestsRef.current = [dispatch(loadWorkflowAutomation())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/permissions-rbac") {
      pendingRequestsRef.current = [dispatch(loadPermissionsRbac())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/knowledge-linkage") {
      pendingRequestsRef.current = [dispatch(loadKnowledgeLinkage())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/reporting-dashboards") {
      pendingRequestsRef.current = [dispatch(loadReportingDashboards())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/case-history") {
      pendingRequestsRef.current = [dispatch(loadCaseHistorySnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/case-editor") {
      pendingRequestsRef.current = [dispatch(loadCaseDraft())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/phone-session") {
      pendingRequestsRef.current = [dispatch(loadPhoneSessionSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/knowledge-assist") {
      pendingRequestsRef.current = [dispatch(loadKnowledgeAssistSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/ticket-search") {
      pendingRequestsRef.current = [dispatch(loadTicketSearchIndex())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/ticket-detail") {
      pendingRequestsRef.current = [dispatch(loadTicketDirectory()), dispatch(loadTicketDetail("TKT-1201"))];
      emitLoaded();
      return;
    }

    if (activeRoute === "/ticket-workspace") {
      pendingRequestsRef.current = [dispatch(loadTicketWorkspaceIndex())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/agent-presence") {
      pendingRequestsRef.current = [dispatch(loadAgentPresenceSnapshot())];
      emitLoaded();
      return;
    }

    if (activeRoute === "/customer-360") {
      pendingRequestsRef.current = [dispatch(loadChatSessionSnapshot()), dispatch(loadCaseHistorySnapshot())];
      emitLoaded();
      return;
    }
  }, [activeRoute, dispatch]);

  const routeButtons = useMemo(
    () =>
      ROUTE_DESCRIPTORS.map((descriptor) => (
        <button
          key={descriptor.path}
          type="button"
          className={descriptor.path === activeRoute ? "nav-btn nav-btn-active" : "nav-btn"}
          onClick={() => {
            const blocked = activeRoute === "/case-editor" && isCaseDraftDirty && descriptor.path !== activeRoute;
            if (blocked) {
              setPendingRoute(descriptor.path);
              return;
            }

            dispatch(setActiveRoute(descriptor.path));
            window.location.hash = descriptor.path;
          }}
          aria-current={descriptor.path === activeRoute ? "page" : undefined}
        >
          {descriptor.feature}
        </button>
      )),
    [activeRoute, dispatch, isCaseDraftDirty]
  );

  return (
    <div className="shell-root">
      <header className="shell-header">
        <h1>Global Support & Service Workbench</h1>
        <p>Route: {titleFromRoute(activeRoute)}</p>
      </header>
      <div className="shell-body">
        <nav aria-label="Feature navigation" className="shell-nav">
          {routeButtons}
        </nav>
        <main className="shell-main" aria-live="polite">
          <Suspense fallback={<p>Loading feature module...</p>}>
            {activeRoute === "/customer-360" ? (
              <Customer360Panel
                onRefreshAll={() => {
                  const startedAt = performance.now();
                  dispatch(loadChatSessionSnapshot());
                  dispatch(loadCaseHistorySnapshot());
                  emitTelemetry(dispatch, {
                    eventName: "customer360.refresh_all",
                    feature: "customer-360",
                    latencyMs: Math.round(performance.now() - startedAt)
                  });
                }}
              />
            ) : null}

            {activeRoute === "/chat-session" ? (
              <ChatSessionPanel onRefresh={() => dispatch(loadChatSessionSnapshot())} />
            ) : null}

            {activeRoute === "/agent-intelligence-dashboard" ? <AgentIntelligenceDashboardPanel /> : null}

            {activeRoute === "/assignment-routing" ? <AssignmentRoutingPanel /> : null}

            {activeRoute === "/customer-profile-depth" ? <CustomerProfileDepthPanel /> : null}

            {activeRoute === "/communication-logging" ? <CommunicationLoggingPanel /> : null}

            {activeRoute === "/workflow-automation" ? <WorkflowAutomationPanel /> : null}

            {activeRoute === "/permissions-rbac" ? <PermissionsRbacPanel /> : null}

            {activeRoute === "/knowledge-linkage" ? <KnowledgeLinkagePanel /> : null}

            {activeRoute === "/reporting-dashboards" ? <ReportingDashboardsPanel /> : null}

            {activeRoute === "/case-history" ? (
              <CaseHistoryPanel onRefresh={() => dispatch(loadCaseHistorySnapshot())} />
            ) : null}

            {activeRoute === "/case-editor" ? <CaseEditorPanel /> : null}

            {activeRoute === "/phone-session" ? <PhoneSessionPanel /> : null}

            {activeRoute === "/knowledge-assist" ? <KnowledgeAssistPanel /> : null}

            {activeRoute === "/ticket-search" ? <TicketSearchPanel /> : null}

            {activeRoute === "/ticket-detail" ? <TicketDetailPanel /> : null}

            {activeRoute === "/ticket-workspace" ? <TicketWorkspacePanel /> : null}

            {activeRoute === "/agent-presence" ? <AgentPresencePanel /> : null}

            {activeRoute !== "/customer-360" &&
            activeRoute !== "/chat-session" &&
            activeRoute !== "/agent-intelligence-dashboard" &&
            activeRoute !== "/assignment-routing" &&
            activeRoute !== "/customer-profile-depth" &&
            activeRoute !== "/communication-logging" &&
            activeRoute !== "/workflow-automation" &&
            activeRoute !== "/permissions-rbac" &&
            activeRoute !== "/knowledge-linkage" &&
            activeRoute !== "/reporting-dashboards" &&
            activeRoute !== "/case-history" &&
            activeRoute !== "/case-editor" &&
            activeRoute !== "/phone-session" &&
            activeRoute !== "/knowledge-assist" &&
            activeRoute !== "/ticket-search" &&
            activeRoute !== "/ticket-detail" &&
            activeRoute !== "/ticket-workspace" &&
            activeRoute !== "/agent-presence" ? (
              <FeaturePanel
                route={activeRoute}
                onRouteRestore={(route) => {
                  const blocked = activeRoute === "/case-editor" && isCaseDraftDirty && route !== activeRoute;
                  if (blocked) {
                    setPendingRoute(route);
                    return;
                  }

                  dispatch(setActiveRoute(route));
                }}
              />
            ) : null}
          </Suspense>
        </main>
      </div>
      <footer className="shell-footer">
        {effectivePendingRoute ? (
          <p>
            You have unsaved case editor changes.{" "}
            <button
              type="button"
              className="nav-btn"
              onClick={() => {
                setPendingRoute(null);
              }}
            >
              Stay on editor
            </button>{" "}
            <button
              type="button"
              className="nav-btn"
              onClick={() => {
                if (!effectivePendingRoute) {
                  return;
                }

                dispatch(discardDraftChanges());
                dispatch(setActiveRoute(effectivePendingRoute));
                window.location.hash = effectivePendingRoute;
                setPendingRoute(null);
              }}
            >
              Discard and continue
            </button>
          </p>
        ) : null}
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            const hashRoute = routeFromHash(window.location.hash);
            const blocked = activeRoute === "/case-editor" && isCaseDraftDirty && hashRoute !== activeRoute;
            if (blocked) {
              setPendingRoute(hashRoute);
              return;
            }

            dispatch(setActiveRoute(hashRoute));
            emitTelemetry(dispatch, {
              eventName: "route.synced_from_hash",
              feature: hashRoute,
              latencyMs: 0
            });
          }}
        >
          Sync from URL hash
        </button>
      </footer>
    </div>
  );
}
