import { BRAND_LOGO } from "@/libs/brand/logo";
import { palette, type ThemeMode } from "./colors";

/** Maps palette keys to CSS custom property names (semantic + legacy aliases). */
const CSS_VAR_ENTRIES: [string, keyof (typeof palette)["light"]][] = [
  ["--primary", "primary"],
  ["--primary-hover", "primaryHover"],
  ["--primary-active", "primaryActive"],
  ["--success", "success"],
  ["--warning", "warning"],
  ["--danger", "danger"],
  ["--info", "info"],
  ["--bg-page", "bgPage"],
  ["--bg-container", "bgContainer"],
  ["--text", "text"],
  ["--text-secondary", "textSecondary"],
  ["--text-muted", "textMuted"],
  ["--border", "border"],
  ["--border-secondary", "borderSecondary"],
  ["--chart-1", "chart1"],
  ["--chart-2", "chart2"],
  ["--chart-3", "chart3"],
  ["--chart-4", "chart4"],
  // Legacy aliases (existing CSS / Tailwind `text-pharma`, charts, etc.)
  ["--pharma", "primary"],
  ["--leaf", "success"],
  ["--gold", "warning"],
  ["--muted", "textSecondary"],
  ["--bronze", "chart3"],
  ["--background", "bgPage"],
  ["--foreground", "text"],
];

export function applyThemeCssVariables(mode: ThemeMode, el: HTMLElement = document.documentElement) {
  const p = palette[mode];
  for (const [name, key] of CSS_VAR_ENTRIES) {
    el.style.setProperty(name, p[key]);
  }
}

/** Blocking script for layout — applies class + CSS vars before first paint. */
export function buildThemeBootstrapScript(): string {
  const entries = CSS_VAR_ENTRIES.map(([name, key]) => [name, key]);
  const logos = JSON.stringify(BRAND_LOGO);
  return `(function(){try{var palette=${JSON.stringify(palette)};var entries=${JSON.stringify(entries)};var logos=${logos};var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var root=document.documentElement;root.classList.remove("light","dark");root.classList.add(t);var p=palette[t];entries.forEach(function(e){root.style.setProperty(e[0],p[e[1]])});var icon=document.querySelector('link[rel="icon"][data-brand]');if(icon)icon.href=t==="dark"?logos.dark:logos.light}catch(e){}})();`;
}
