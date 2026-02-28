import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          primary: "rgb(var(--color-app-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-app-secondary) / <alpha-value>)",
          accent: "rgb(var(--color-app-accent) / <alpha-value>)"
        },
        surface: {
          main: "rgb(var(--color-bg-main) / <alpha-value>)",
          card: "rgb(var(--color-bg-card) / <alpha-value>)",
          overlay: "rgb(var(--color-bg-overlay) / <alpha-value>)"
        },
        action: {
          hover: "rgb(var(--color-action-hover) / <alpha-value>)",
          pressed: "rgb(var(--color-action-pressed) / <alpha-value>)",
          disabled: "rgb(var(--color-action-disabled) / <alpha-value>)"
        },
        status: {
          success: "rgb(var(--color-status-success) / <alpha-value>)",
          warning: "rgb(var(--color-status-warning) / <alpha-value>)",
          error: "rgb(var(--color-status-error) / <alpha-value>)"
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)"
        },
        border: {
          subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
          strong: "rgb(var(--color-border-strong) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["SF Pro Text", "Inter", "ui-sans-serif", "system-ui"]
      },
      fontSize: {
        "heading-1": ["2rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-2": ["1.5rem", { lineHeight: "1.875rem", letterSpacing: "-0.015em", fontWeight: "650" }],
        "heading-3": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-regular": ["0.9375rem", { lineHeight: "1.5rem" }],
        "body-compact": ["0.875rem", { lineHeight: "1.375rem" }],
        caption: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }]
      },
      boxShadow: {
        ambient: "0 1px 2px rgba(15,23,42,0.08)",
        liquid: "0 8px 32px 0 rgba(31,38,135,0.07)"
      },
      backdropBlur: {
        liquid: "20px"
      },
      transitionTimingFunction: {
        "apple-standard": "cubic-bezier(0.2, 0.8, 0.2, 1)"
      },
      transitionDuration: {
        ui: "200ms"
      },
      keyframes: {
        "ticket-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.995)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "sparkle-pulse": {
          "0%, 100%": { opacity: "0.88", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        },
        "ghost-shimmer": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" }
        },
        "liquid-entrance": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.995)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        "ticket-in": "ticket-in 320ms ease-out",
        "sparkle-pulse": "sparkle-pulse 1.5s ease-in-out infinite",
        "ghost-shimmer": "ghost-shimmer 2s linear infinite",
        "liquid-entrance": "liquid-entrance 280ms ease-out",
        "skeleton-pulse": "skeleton-pulse 1.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
