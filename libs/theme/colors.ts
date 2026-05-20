/** Golden Lotus Herbals — brand green #005828 */
export const BRAND_GREEN = "#005828";

/** Minimal green enterprise palette — Ant Design tokens */
export const palette = {
  light: {
    // Brand
    primary: BRAND_GREEN,
    primaryHover: "#007a35",
    primaryActive: "#003d1f",

    // Semantic
    success: BRAND_GREEN,
    warning: "#d68910",
    danger: "#c0392b",
    info: "#2a9d55",

    // Neutral UI
    bgPage: "#ffffff",
    bgContainer: "#fafafa",

    text: "#111111",
    textSecondary: "#666666",
    textMuted: "#999999",

    border: "#e5e7eb",
    borderSecondary: "#f0f0f0",

    // Charts / data viz
    chart1: BRAND_GREEN,
    chart2: "#6b7280",
    chart3: "#9ca3af",
    chart4: "#d1d5db",
  },

  dark: {
    // Brand (lighter tints for contrast on dark UI)
    primary: "#52b878",
    primaryHover: "#6ed090",
    primaryActive: "#3d9a60",

    // Semantic
    success: "#52b878",
    warning: "#f5b041",
    danger: "#e74c3c",
    info: "#6bc990",

    // Neutral UI
    bgPage: "#0f0f10",
    bgContainer: "#18181b",

    text: "#ffffff",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",

    border: "#27272a",
    borderSecondary: "#3f3f46",

    // Charts / data viz
    chart1: "#52b878",
    chart2: "#71717a",
    chart3: "#a1a1aa",
    chart4: "#d4d4d8",
  },
} as const;

export type ThemeMode = keyof typeof palette;