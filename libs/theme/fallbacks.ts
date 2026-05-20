import { palette, type ThemeMode } from "./colors";

/** Default fallbacks when CSS variables are not yet applied (SSR / first paint). */
export function themeColors(mode: ThemeMode = "light") {
  return palette[mode];
}
