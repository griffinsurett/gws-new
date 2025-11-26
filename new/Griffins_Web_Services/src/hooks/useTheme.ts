// src/hooks/useTheme.ts
import { useCallback, useEffect, type SetStateAction } from "react";
import useLocalStorage from "./useLocalStorage";
import { getStorageItem } from "@/utils/storage";
import { DEFAULT_THEME } from "@/constants/theme";

export type Theme = "light" | "dark";

/**
 * Theme hook for managing light/dark mode
 *
 * Features:
 * - Sets `data-theme` and `color-scheme` on <html>
 * - Updates <meta name="theme-color"> from computed --color-bg
 * - Persists user choice via localStorage
 * - Follows OS preference when no stored preference exists
 * - Syncs across browser tabs
 */
export function useTheme() {
  // Get initial theme: localStorage > OS preference > 'light' fallback
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return DEFAULT_THEME;

    const stored = getStorageItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return DEFAULT_THEME;
  };

  const [theme, setStoredTheme] = useLocalStorage<Theme>(
    "theme",
    getInitialTheme,
    {
      raw: true,
      validate: (v): v is Theme => v === "light" || v === "dark",
      syncTabs: true,
    }
  );

  const applyThemeAttributes = useCallback((nextTheme: Theme) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", nextTheme);
    root.style.colorScheme = nextTheme;

    try {
      const bgColor = getComputedStyle(root)
        .getPropertyValue("--color-bg")
        .trim();

      if (bgColor) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "theme-color");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", bgColor);
      }
    } catch (error) {
      console.warn("Failed to update theme-color meta tag:", error);
    }
  }, []);

  // Apply theme coming from storage syncs or initial render
  useEffect(() => {
    applyThemeAttributes(theme);
  }, [theme, applyThemeAttributes]);

  const setTheme = useCallback(
    (value: SetStateAction<Theme>) => {
      setStoredTheme((current) => {
        const next =
          typeof value === "function"
            ? (value as (prev: Theme) => Theme)(current)
            : value;

        applyThemeAttributes(next);
        return next;
      });
    },
    [setStoredTheme, applyThemeAttributes]
  );

  // Listen to OS preference changes (only when no explicit user preference)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = getStorageItem("theme");
        // Only auto-switch if user hasn't explicitly set a preference
        if (stored !== "light" && stored !== "dark") {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch {
        // Ignore errors
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [setTheme]);

  // Utility function to toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isLight: theme === "light",
    isDark: theme === "dark",
  };
}
