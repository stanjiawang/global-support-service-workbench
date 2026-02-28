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

function GlobeIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <circle cx="10" cy="10" r="6.5" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M3.8 10h12.4M10 3.5c2 2 2 11 0 13M10 3.5c-2 2-2 11 0 13" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IdCardIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <rect x="3.5" y="5" width="13" height="10" rx="2" fill="none" stroke={stroke} strokeWidth="1.4" />
      <circle cx="8" cy="10" r="1.4" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M6.2 12.3c.5-.6 1.1-.9 1.8-.9s1.3.3 1.8.9M11.8 9h2.8M11.8 11h2.2" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M4 5.5h12v7H8l-3.5 2.5V5.5z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 8.5h6M7 10.5h4" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <circle cx="8.5" cy="8.5" r="3.8" fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d="M11.2 11.2l4 4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M4 10a6 6 0 116 6" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 6v4h4M10 7.5V10l2 1.2" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M5 13.8l.6-2.4 6.7-6.7 1.8 1.8-6.7 6.7L5 13.8z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11.7 4.7l1.8-1.8 1.8 1.8-1.8 1.8" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function LogIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <rect x="4.5" y="3.5" width="11" height="13" rx="1.8" fill="none" stroke={stroke} strokeWidth="1.4" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <path d="M10 3.5l5 1.8v4.4c0 3.2-2 5.5-5 6.8-3-1.3-5-3.6-5-6.8V5.3L10 3.5z" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.3 9.7l1.2 1.2 2.2-2.2" fill="none" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PresenceIcon({ active = false }: IconProps): JSX.Element {
  const stroke = iconColor(active);
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" width={ICON_SIZE} height={ICON_SIZE} style={{ display: "block" }}>
      <circle cx="9" cy="7" r="3" fill="none" stroke={stroke} strokeWidth="1.4" />
      <path d="M3.8 15c1.1-1.8 2.9-2.8 5.2-2.8 1.6 0 3 .5 4.1 1.4" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.8" cy="13.8" r="2.2" fill="none" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

const ROUTE_ICON_KIND: Record<
  FeatureRoute,
  "queue" | "ticket" | "phone" | "user" | "gear" | "chart" | "spark" | "doc" | "link" | "globe" | "id-card" | "message" | "search" | "history" | "pencil" | "log" | "shield" | "presence"
> = {
  "/customer-360": "globe",
  "/chat-session": "message",
  "/phone-session": "phone",
  "/case-history": "history",
  "/case-editor": "pencil",
  "/ticket-search": "search",
  "/ticket-detail": "doc",
  "/ticket-workspace": "ticket",
  "/assignment-routing": "queue",
  "/customer-profile-depth": "id-card",
  "/communication-logging": "log",
  "/workflow-automation": "gear",
  "/permissions-rbac": "shield",
  "/knowledge-linkage": "link",
  "/reporting-dashboards": "chart",
  "/agent-intelligence-dashboard": "spark",
  "/knowledge-assist": "user",
  "/agent-presence": "presence"
};

export function RouteIcon({ route, active = false }: { readonly route: FeatureRoute; readonly active?: boolean }): JSX.Element {
  const kind = ROUTE_ICON_KIND[route];
  if (kind === "globe") return <GlobeIcon active={active} />;
  if (kind === "id-card") return <IdCardIcon active={active} />;
  if (kind === "message") return <MessageIcon active={active} />;
  if (kind === "search") return <SearchIcon active={active} />;
  if (kind === "history") return <HistoryIcon active={active} />;
  if (kind === "pencil") return <PencilIcon active={active} />;
  if (kind === "log") return <LogIcon active={active} />;
  if (kind === "shield") return <ShieldIcon active={active} />;
  if (kind === "presence") return <PresenceIcon active={active} />;
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
