import { useEffect } from "react";
import useLocalStorageState from "@/hooks/useLocalStorageState";

// Cache for theme colors to avoid repeated getComputedStyle calls
const themeColorCache: Record<string, string> = {};

export function UseMode() {
  const [theme, setTheme] = useLocalStorageState<"light" | "dark">(
    "theme",
    () => "dark",
    {
      raw: true,
      deserialize: (value) => (value === "light" ? "light" : "dark"),
    }
  );

  const isLight = theme === "light";
  const setIsLight = (value: boolean) => setTheme(value ? "light" : "dark");

  useEffect(() => {
    const root = document.documentElement;
    const nextTheme = isLight ? "light" : "dark";

    // Batch DOM writes first (no reflow)
    root.setAttribute("data-theme", nextTheme);
    root.style.colorScheme = nextTheme;

    // Triple-defer: idle → rAF → read
    // This ensures styles have settled before we read computed values
    const updateMeta = () => {
      requestAnimationFrame(() => {
        // Check cache first to avoid expensive getComputedStyle
        let bgColor = themeColorCache[nextTheme];

        if (!bgColor) {
          bgColor = getComputedStyle(root).getPropertyValue("--color-bg").trim();
          if (bgColor) themeColorCache[nextTheme] = bgColor;
        }

        if (bgColor) {
          const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
          if (meta) meta.content = bgColor;
        }
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(updateMeta, { timeout: 2000 });
    } else {
      setTimeout(updateMeta, 50);
    }
  }, [isLight]);

  return [isLight, setIsLight] as const;
}
