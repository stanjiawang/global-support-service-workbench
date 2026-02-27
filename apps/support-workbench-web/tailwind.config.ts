import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.10)"
        },
        surface: {
          0: "#0f172a",
          1: "#111827"
        },
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1"
        },
        channel: {
          chat: "#0ea5e9",
          phone: "#f59e0b",
          store: "#10b981"
        }
      },
      fontFamily: {
        sans: ["SF Pro Text", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15,23,42,0.18)"
      },
      backdropBlur: {
        glass: "14px"
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
        }
      },
      animation: {
        "ticket-in": "ticket-in 320ms ease-out",
        "sparkle-pulse": "sparkle-pulse 1.5s ease-in-out infinite",
        "ghost-shimmer": "ghost-shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
