export const tokens = {
  colors: {
    bg: "var(--bg)",
    card: "var(--card)",
    cardInner: "var(--card-inner)",
    text: "var(--text)",
    textSecondary: "var(--text-secondary)",
    accent: "var(--accent)",
    accentMid: "var(--accent-mid)",
    accentDim: "var(--accent-dim)",
    accentDark: "var(--accent-dark)",
    muted: "var(--muted)",
    border: "var(--border)",
    surface: "var(--surface)",
    gridLine: "var(--grid-line)",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  shadow: {
    card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
    bar: "0 8px 20px rgba(34,197,94,0.18)",
    barSelected: "0 10px 30px rgba(34,197,94,0.35)",
  },
} as const;
