// src/components/ThemeControls.jsx
import React, { useEffect, useState } from "react";
import ThemeToggle from "./DarkLightToggle.jsx";
import AccentPicker from "./AccentPicker.jsx";

export default function ThemeControls({ className = "" }) {
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
    </div>
  );
}
