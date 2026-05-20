import type { ThemeMode } from "@/libs/theme/colors";

/** Brand logos — light theme: dương bản, dark theme: âm bản */
export const BRAND_LOGO = {
  light: "/brand/logo-positive.png",
  dark: "/brand/logo-negative.png",
} as const;

export function brandLogoForTheme(theme: ThemeMode): string {
  return theme === "dark" ? BRAND_LOGO.dark : BRAND_LOGO.light;
}

export function applyBrandFavicon(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-brand]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.setAttribute("data-brand", "true");
    document.head.appendChild(link);
  }
  link.href = brandLogoForTheme(theme);
}
