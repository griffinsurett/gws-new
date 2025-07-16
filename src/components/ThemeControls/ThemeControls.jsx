// src/components/ThemeControls.jsx
import React, { useEffect, useState } from "react";
import ThemeToggle from "./DarkLightToggle.jsx";
import AccentPicker from "./AccentPicker.jsx";

export default function ThemeControls({
  checkboxId = "headerMenu-toggle",    // ← the ID of your <input type="checkbox" />
  className = ""
}) {
  // Track scroll position (your existing “at top” logic)
  const [isAtTop, setIsAtTop] = useState(
    typeof window !== "undefined" ? window.pageYOffset === 0 : true
  );
  useEffect(() => {
    function handleScroll() {
      setIsAtTop(window.pageYOffset === 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track menu open/closed via checkbox
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const box = document.getElementById(checkboxId);
    if (!box) {
      console.warn(`[ThemeControls] No checkbox found with id=${checkboxId}`);
      return;
    }

    const sync = () => {
      console.log(`[ThemeControls:${checkboxId}] menuOpen=${box.checked}`);
      setMenuOpen(box.checked);
    };

    box.addEventListener("change", sync);
    sync(); // initialize on mount

    return () => box.removeEventListener("change", sync);
  }, [checkboxId]);

  return (
    <div
      className={[
        // ① center inside your hero (parent must be relative)
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        // ② horizontal layout
        "flex items-center gap-[var(--spacing-sm)]",
        // ③ fade in/out
        "transition-opacity duration-300 ease-in-out",
        isAtTop
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
        // ④ any extra overrides
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ThemeToggle />
      <AccentPicker />

      {/* live-update the menu’s open state */}
      <span className="ml-4 font-mono">
        menuOpen: {menuOpen.toString()}
      </span>
    </div>
  );
}
