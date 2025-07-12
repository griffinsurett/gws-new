// src/components/ThemeControls.jsx
import React, { useRef, useState } from "react";
import ThemeToggle from "./DarkLightToggle.jsx";
import AccentPicker from "./AccentPicker.jsx";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ThemeControls({ className = "" }) {
  const containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useScrollAnimation(containerRef, {
    threshold: 0,
    pauseDelay: 100,
    onForward: () => setHidden(true),
    onBackward: () => {
      // only show when scrolled fully back to top
      if (window.pageYOffset === 0) {
        setHidden(false);
      }
    },
  });

  return (
    <div
      ref={containerRef}
      className={[
        // 1️⃣ absolute + center in its parent (parent must be `relative`)
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",

        // 2️⃣ flex layout
        "flex items-center gap-[var(--spacing-sm)]",

        // 3️⃣ fade in/out
        hidden
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto",

        // 4️⃣ smooth transition
        "transition-opacity duration-300 ease-in-out",

        // 5️⃣ any overrides
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
