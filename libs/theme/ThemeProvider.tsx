"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ThemeMode } from "./colors";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const listeners = new Set<() => void>();

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let currentTheme: ThemeMode = "light";

function setDomTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
}

if (typeof window !== "undefined") {
  currentTheme = readTheme();
  setDomTheme(currentTheme);
}

function persist(mode: ThemeMode) {
  currentTheme = mode;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, mode);
    setDomTheme(mode);
  }
  listeners.forEach((l) => l());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentTheme,
    () => "light" as ThemeMode
  );

  const toggleTheme = useCallback(() => {
    persist(theme === "light" ? "dark" : "light");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext requires ThemeProvider");
  return ctx;
}
