import type { FeatureRoute } from "@app/routing/routes";

interface IconProps {
  readonly active?: boolean;
}

const ICON_SIZE = 14;

function iconColor(active: boolean): string {
  void active;
  return "currentColor";
}

function QueueIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M4 5h12M4 10h12M4 15h8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TicketIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M4 6h12v8H4z" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M8 6v8" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M6 4l3 3-2 2c1 2 2 3 4 4l2-2 3 3-2 2c-1 1-3 1-5 0-3-1-6-4-7-7-1-2-1-4 0-5z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <circle cx="10" cy="7" r="3" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M4 16c1.2-2 3.2-3 6-3s4.8 1 6 3" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <circle cx="10" cy="10" r="2.2" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.2 5.2l1.4 1.4M13.4 13.4l1.4 1.4M14.8 5.2l-1.4 1.4M6.6 13.4l-1.4 1.4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M4 15V9M9 15V6M14 15V11" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 15h14" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

function SparkIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M10 3l1.8 4.2L16 9l-4.2 1.8L10 15l-1.8-4.2L4 9l4.2-1.8z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M6 3h6l3 3v11H6z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 3v4h3" fill="none" stroke={stroke} strokeWidth="1.4" />
      <path d="M8 11h5M8 14h5" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

function LinkIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M8 12l4-4M6.5 14a2.5 2.5 0 010-3.5l1.8-1.8a2.5 2.5 0 013.5 0M13.5 6a2.5 2.5 0 010 3.5l-1.8 1.8a2.5 2.5 0 01-3.5 0" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const ROUTE_ICON_KIND: Record<FeatureRoute, "queue" | "ticket" | "phone" | "user" | "gear" | "chart" | "spark" | "doc" | "link"> = {
  "/customer-360": "user",
  "/chat-session": "queue",
  "/phone-session": "phone",
  "/case-history": "doc",
  "/case-editor": "doc",
  "/ticket-search": "queue",
  "/ticket-detail": "ticket",
  "/ticket-workspace": "ticket",
  "/assignment-routing": "gear",
  "/customer-profile-depth": "user",
  "/communication-logging": "doc",
  "/workflow-automation": "gear",
  "/permissions-rbac": "gear",
  "/knowledge-linkage": "link",
  "/reporting-dashboards": "chart",
  "/agent-intelligence-dashboard": "spark",
  "/knowledge-assist": "spark",
  "/agent-presence": "user"
};

export function RouteIcon({ route, active = false }: { readonly route: FeatureRoute; readonly active?: boolean }): JSX.Element {
  const kind = ROUTE_ICON_KIND[route];
  if (kind === "queue") return <QueueIcon active={active} />;
  if (kind === "ticket") return <TicketIcon active={active} />;
  if (kind === "phone") return <PhoneIcon active={active} />;
  if (kind === "user") return <UserIcon active={active} />;
  if (kind === "gear") return <GearIcon active={active} />;
  if (kind === "chart") return <ChartIcon active={active} />;
  if (kind === "link") return <LinkIcon active={active} />;
  if (kind === "doc") return <DocIcon active={active} />;
  return <SparkIcon active={active} />;
}
