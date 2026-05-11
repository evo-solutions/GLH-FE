/** Palette pharma + herbals — dùng cho Ant Design tokens */
export const palette = {
  light: {
    pharma: "#0d6e8d",
    pharmaDeep: "#085a73",
    leaf: "#1b5e3c",
    gold: "#c9a94f",
    danger: "#c0392b",
    success: "#1e8449",
    info: "#1f6fad",
    warning: "#d68910",
    bgPage: "#eef5f7",
    text: "#0e2a33",
    muted: "#5a7580",
    border: "rgba(13, 110, 141, 0.18)",
  },
  dark: {
    pharma: "#4aafc9",
    pharmaDeep: "#2d8fa8",
    leaf: "#3d9a62",
    gold: "#d4b86a",
    danger: "#e74c3c",
    success: "#52c97a",
    info: "#5dade2",
    warning: "#f5b041",
    bgPage: "#0c1920",
    text: "#e8f4f7",
    muted: "#8aa8b3",
    border: "rgba(74, 175, 201, 0.22)",
  },
} as const;

export type ThemeMode = keyof typeof palette;
