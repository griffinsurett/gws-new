// src/components/ThemeControls.jsx
import React, { useRef, useState } from "react";
import ThemeToggle from "./DarkLightToggle.jsx";
import AccentPicker from "./AccentPicker.jsx";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ThemeControls({ className = "" }) {
  const containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  // scroll-down → hide, scroll-up → show
  useScrollAnimation(containerRef, {
    threshold: 0,
    pauseDelay: 100,
    onForward: () => setHidden(true),
    onBackward: () => setHidden(false),
  });

  return (
    <div
      ref={containerRef}
      className={[
        // 1) fixed center
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-[var(--spacing-sm)] justify-center",
        // 2) dynamic Y + fade
        hidden
          ? "-translate-y-[100vh] opacity-0"
          : "-translate-y-1/2 opacity-100",
        // 3) nice transition
        "transition-all duration-300 ease-in-out",
        // 4) allow extra overrides
        className,
      ].join(" ")}
    >
      <ThemeToggle />
      <AccentPicker />
    </div>
  );
}
