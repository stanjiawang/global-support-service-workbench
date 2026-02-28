import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/providers/store";
import { setActiveRoute } from "@app/providers/store";
import { emitTelemetry } from "@shared/telemetry/emitTelemetry";
import { emitUxEvent } from "@shared/telemetry/uxEvents";
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
import { ContextRail } from "@shared/ui/components/ContextRail";
import { UI_TOKENS } from "@shared/ui/tokens";
import { RouteIcon } from "@shared/ui/icons";

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

const ROUTE_MODULE_PRELOADERS: Readonly<Record<FeatureRoute, () => Promise<unknown>>> = {
  "/customer-360": () => import("@features/customer-360/Customer360Panel"),
  "/chat-session": () => import("@features/chat-session/ChatSessionPanel"),
  "/phone-session": () => import("@features/phone-session/PhoneSessionPanel"),
  "/case-history": () => import("@features/case-history/CaseHistoryPanel"),
  "/case-editor": () => import("@features/case-editor/CaseEditorPanel"),
  "/ticket-search": () => import("@features/ticket-search/TicketSearchPanel"),
  "/ticket-detail": () => import("@features/ticket-detail/TicketDetailPanel"),
  "/ticket-workspace": () => import("@features/ticket-workspace/TicketWorkspacePanel"),
  "/assignment-routing": () => import("@features/assignment-routing/AssignmentRoutingPanel"),
  "/customer-profile-depth": () => import("@features/customer-profile-depth/CustomerProfileDepthPanel"),
  "/communication-logging": () => import("@features/communication-logging/CommunicationLoggingPanel"),
  "/workflow-automation": () => import("@features/workflow-automation/WorkflowAutomationPanel"),
  "/permissions-rbac": () => import("@features/permissions-rbac/PermissionsRbacPanel"),
  "/knowledge-linkage": () => import("@features/knowledge-linkage/KnowledgeLinkagePanel"),
  "/reporting-dashboards": () => import("@features/reporting-dashboards/ReportingDashboardsPanel"),
  "/agent-intelligence-dashboard": () => import("@features/agent-intelligence-dashboard/AgentIntelligenceDashboardPanel"),
  "/knowledge-assist": () => import("@features/knowledge-assist/KnowledgeAssistPanel"),
  "/agent-presence": () => import("@features/agent-presence/AgentPresencePanel")
};

function titleFromRoute(route: FeatureRoute): string {
  return ROUTE_DESCRIPTORS.find((descriptor) => descriptor.path === route)?.feature ?? "unknown";
}

const UI_REVAMP_V1 = import.meta.env.VITE_UI_REVAMP_V1 !== "false";

export function AppShellView(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const activeRoute = useSelector((state: RootState) => state.workbenchUi.activeRoute);
  const isCaseDraftDirty = useSelector((state: RootState) => state.caseEditor.isDirty);
  const pendingRequestsRef = useRef<Array<{ abort: () => void }>>([]);
  const preloadedRoutesRef = useRef<Set<FeatureRoute>>(new Set());
  const previousRouteRef = useRef<FeatureRoute | null>(null);
  const [pendingRoute, setPendingRoute] = useState<FeatureRoute | null>(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const effectivePendingRoute = isCaseDraftDirty ? pendingRoute : null;

  useEffect(() => {
    if (previousRouteRef.current !== activeRoute) {
      emitUxEvent(dispatch, {
        eventName: "ui.route_loaded",
        feature: activeRoute,
        latencyMs: 0
      });
      previousRouteRef.current = activeRoute;
    }
  }, [activeRoute, dispatch]);

  const prefetchRouteModule = useCallback((route: FeatureRoute): void => {
    if (preloadedRoutesRef.current.has(route)) {
      return;
    }
    preloadedRoutesRef.current.add(route);
    void ROUTE_MODULE_PRELOADERS[route]?.();
  }, []);

  useEffect(() => {
    const active = ROUTE_DESCRIPTORS.find((descriptor) => descriptor.path === activeRoute);
    if (!active) {
      return;
    }

    for (const descriptor of ROUTE_DESCRIPTORS) {
      if (descriptor.path === activeRoute) {
        continue;
      }
      if (descriptor.prefetchPriority === "high" || (descriptor.group === active.group && descriptor.prefetchPriority !== "low")) {
        prefetchRouteModule(descriptor.path);
      }
    }
  }, [activeRoute, prefetchRouteModule]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Tab") {
        emitUxEvent(dispatch, {
          eventName: "ui.keyboard_navigation_used",
          feature: activeRoute
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

  const routeButtons = useMemo(() => {
    const grouped = new Map<string, typeof ROUTE_DESCRIPTORS>();
    for (const descriptor of ROUTE_DESCRIPTORS) {
      const current = grouped.get(descriptor.group) ?? [];
      grouped.set(descriptor.group, [...current, descriptor]);
    }

    return Array.from(grouped.entries()).map(([groupName, descriptors]) => (
      <section key={groupName} className="ux-nav-group" aria-label={groupName}>
        <h2 className="ux-nav-group-title">{groupName}</h2>
        {descriptors.map((descriptor) => (
          <button
            key={descriptor.path}
            type="button"
            className={descriptor.path === activeRoute ? "btn-primary" : "btn-secondary"}
            onClick={() => {
              const blocked = activeRoute === "/case-editor" && isCaseDraftDirty && descriptor.path !== activeRoute;
              if (blocked) {
                setPendingRoute(descriptor.path);
                return;
              }

              dispatch(setActiveRoute(descriptor.path));
              window.location.hash = descriptor.path;
              emitUxEvent(dispatch, {
                eventName: "ui.primary_action_clicked",
                feature: descriptor.path
              });
            }}
            onMouseEnter={() => prefetchRouteModule(descriptor.path)}
            onFocus={() => prefetchRouteModule(descriptor.path)}
            aria-current={descriptor.path === activeRoute ? "page" : undefined}
            aria-label={descriptor.feature}
          >
            <span className="ux-nav-item-row ux-inline-icon-text">
              <span className="ux-nav-icon-wrap icon-slot">
                <RouteIcon route={descriptor.path} active={descriptor.path === activeRoute} />
              </span>
              <span className="ux-nav-label-wrap">
                <span>{descriptor.feature}</span>
                {UI_REVAMP_V1 ? <small className="ux-nav-intent">{descriptor.intent}</small> : null}
              </span>
            </span>
          </button>
        ))}
      </section>
    ));
  }, [activeRoute, dispatch, isCaseDraftDirty, prefetchRouteModule]);

  const activeDescriptor = ROUTE_DESCRIPTORS.find((descriptor) => descriptor.path === activeRoute);

  return (
    <div className={UI_REVAMP_V1 ? UI_TOKENS.shell.root : "shell-root"}>
      <header className={UI_REVAMP_V1 ? UI_TOKENS.shell.header : "shell-header"}>
        <div className="ux-header-top">
          <div>
            <h1 className="tracking-tight antialiased">Global Support & Service Workbench</h1>
            <p className="ai-subtle">Route: {titleFromRoute(activeRoute)}</p>
          </div>
          <div className="inline-actions">
            <button
              type="button"
              className={`btn-primary ${UI_TOKENS.interactive.ring}`}
              onClick={() => {
                dispatch(setActiveRoute("/ticket-search"));
                window.location.hash = "/ticket-search";
                emitUxEvent(dispatch, {
                  eventName: "ui.primary_action_clicked",
                  feature: "/ticket-search"
                });
              }}
            >
              Quick action: Search ticket
            </button>
            <button
              type="button"
              className={`btn-secondary ${UI_TOKENS.interactive.ring}`}
              onClick={() => {
                dispatch(setActiveRoute("/ticket-detail"));
                window.location.hash = "/ticket-detail";
                emitUxEvent(dispatch, {
                  eventName: "ui.primary_action_clicked",
                  feature: "/ticket-detail"
                });
              }}
            >
              Jump to case
            </button>
          </div>
        </div>
        {UI_REVAMP_V1 ? (
          <ContextRail
            title="Current Work Context"
            status="ready"
            items={[
              { label: "Active route", value: activeDescriptor?.path ?? activeRoute },
              { label: "Workflow group", value: activeDescriptor?.group ?? "unknown" },
              { label: "Primary action", value: activeDescriptor?.primaryAction.label ?? "none" },
              { label: "Prefetch priority", value: activeDescriptor?.prefetchPriority ?? "low" }
            ]}
          />
        ) : null}
      </header>
      <div className={isNavCollapsed ? "shell-body shell-body-nav-collapsed" : "shell-body"}>
        <nav
          aria-label="Feature navigation"
          className={
            UI_REVAMP_V1
              ? `${UI_TOKENS.shell.nav} ${isNavCollapsed ? "shell-nav-collapsed" : ""}`
              : `shell-nav ${isNavCollapsed ? "shell-nav-collapsed" : ""}`
          }
        >
          <button
            type="button"
            className="btn-secondary shell-nav-collapse-toggle"
            aria-label={isNavCollapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setIsNavCollapsed((value) => !value)}
          >
            {isNavCollapsed ? "»" : "«"} <span className="shell-nav-collapse-label">Navigation</span>
          </button>
          {routeButtons}
        </nav>
        <main className={UI_REVAMP_V1 ? UI_TOKENS.shell.content : "shell-main"} aria-live="polite">
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
      <footer className={UI_REVAMP_V1 ? "shell-footer shell-footer-revamp" : "shell-footer"}>
        {effectivePendingRoute ? (
          <div className="shell-footer-alert">
            <span>You have unsaved case editor changes.</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setPendingRoute(null);
              }}
            >
              Stay on editor
            </button>
            <button
              type="button"
              className="btn-secondary"
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
          </div>
        ) : null}
        <button
          type="button"
          className="btn-secondary"
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
