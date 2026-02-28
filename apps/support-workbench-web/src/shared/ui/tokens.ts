export interface UiTokenSet {
  readonly colors: {
    readonly bg: string;
    readonly surface: string;
    readonly glass: string;
    readonly textPrimary: string;
    readonly textSecondary: string;
    readonly accent: string;
    readonly accentSuccess: string;
  };
  readonly spacing: {
    readonly xs: string;
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly xl: string;
  };
  readonly radius: {
    readonly card: string;
    readonly input: string;
    readonly badge: string;
  };
  readonly shell: {
    readonly root: string;
    readonly header: string;
    readonly nav: string;
    readonly content: string;
  };
  readonly typography: {
    readonly title: string;
    readonly subtitle: string;
    readonly section: string;
    readonly muted: string;
  };
  readonly interactive: {
    readonly button: string;
    readonly buttonPrimary: string;
    readonly buttonSecondary: string;
    readonly buttonSuccess: string;
    readonly buttonWarning: string;
    readonly buttonDanger: string;
    readonly buttonPrimaryLiquid: string;
    readonly buttonSecondaryLiquid: string;
    readonly inputLiquid: string;
    readonly segmentControl: string;
    readonly iconTextAlign: string;
    readonly zeroShiftBorder: string;
    readonly controlHeight: string;
    readonly ring: string;
  };
  readonly surfaces: {
    readonly card: string;
    readonly glass: string;
    readonly rail: string;
    readonly surfaceLiquid: string;
    readonly skeleton: string;
  };
  readonly layout: {
    readonly iconSlot: string;
    readonly fieldErrorSlot: string;
  };
}

export const UI_TOKENS: UiTokenSet = {
  colors: {
    bg: "slate-50",
    surface: "white",
    glass: "bg-white/70",
    textPrimary: "slate-900",
    textSecondary: "slate-700",
    accent: "blue-600",
    accentSuccess: "emerald-600"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  radius: {
    card: "12px",
    input: "8px",
    badge: "9999px"
  },
  shell: {
    root: "shell-root shell-revamp",
    header: "shell-header shell-header-revamp",
    nav: "shell-nav shell-nav-revamp",
    content: "shell-main shell-main-revamp"
  },
  typography: {
    title: "text-xl font-bold text-slate-900 tracking-tight antialiased leading-relaxed",
    subtitle: "text-[14px] text-slate-500 leading-relaxed",
    section: "text-xl font-bold text-slate-900 tracking-tight antialiased leading-relaxed",
    muted: "text-xs text-slate-500 leading-relaxed"
  },
  interactive: {
    button: "btn-secondary apple-spring",
    buttonPrimary: "btn-primary apple-spring",
    buttonSecondary: "btn-secondary apple-spring",
    buttonSuccess: "btn-success apple-spring",
    buttonWarning: "btn-warning apple-spring",
    buttonDanger: "btn-danger apple-spring",
    buttonPrimaryLiquid: "btn-primary apple-spring",
    buttonSecondaryLiquid: "btn-secondary apple-spring",
    inputLiquid: "input-field",
    segmentControl: "ux-segmented-control",
    iconTextAlign: "ux-inline-icon-text",
    zeroShiftBorder: "ux-zero-shift-border",
    controlHeight: "32px",
    ring: "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
  },
  surfaces: {
    card: "card-liquid feature-panel ux-panel",
    glass: "card-liquid ai-glass-card",
    rail: "ux-context-rail",
    surfaceLiquid: "card-liquid ux-liquid-surface",
    skeleton: "ux-skeleton"
  },
  layout: {
    iconSlot: "ux-icon-slot",
    fieldErrorSlot: "ux-field-error-slot"
  }
};
