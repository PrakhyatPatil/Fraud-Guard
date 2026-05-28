/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--bg-primary)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        border: "var(--border-color)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        accentPrimary: "var(--accent-primary)",
        accentSecondary: "var(--accent-secondary)",
        accentBlue: "var(--accent-blue)",
        verdictFraud: "var(--verdict-fraud)",
        verdictFraudBg: "var(--verdict-fraud-bg)",
        verdictSuspicious: "var(--verdict-suspicious)",
        verdictSuspiciousBg: "var(--verdict-suspicious-bg)",
        verdictSafe: "var(--verdict-safe)",
        verdictSafeBg: "var(--verdict-safe-bg)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      animation: {
        "soft-pulse": "soft-pulse 2s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
}
