"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "auto" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme-mode";

function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 17 || hour < 8;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  return isNightTime() ? "dark" : "light";
}

function getMsUntilNextTransition(): number {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let nextTransition: number;
  if (currentMinutes < 480) {
    nextTransition = 480;
  } else if (currentMinutes < 1020) {
    nextTransition = 1020;
  } else {
    nextTransition = 480 + 1440;
  }

  const diffMs =
    (nextTransition - currentMinutes) * 60_000 -
    now.getSeconds() * 1000 -
    now.getMilliseconds();

  return Math.max(1000, diffMs);
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", resolved);
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme("auto"),
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const m =
      stored === "light" || stored === "dark" || stored === "auto"
        ? stored
        : "auto";
    setModeState(m);
    const r = resolveTheme(m);
    setResolved(r);
    applyTheme(r);
  }, []);

  useEffect(() => {
    if (mode !== "auto") return;

    let timerId: ReturnType<typeof setTimeout>;

    function schedule() {
      timerId = setTimeout(() => {
        const r = resolveTheme("auto");
        setResolved(r);
        applyTheme(r);
        schedule();
      }, getMsUntilNextTransition());
    }

    schedule();
    return () => clearTimeout(timerId);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    const r = resolveTheme(m);
    setResolved(r);
    applyTheme(r);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = resolved === "light" ? "dark" : "light";
    setMode(next);
  }, [resolved, setMode]);

  return (
    <ThemeContext.Provider
      value={{ mode, resolvedTheme: resolved, setMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
}
