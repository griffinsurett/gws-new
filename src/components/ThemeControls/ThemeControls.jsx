// src/components/ThemeControls.jsx
import React, { useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle.jsx";
import AccentPicker from "./AccentPicker.jsx";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ThemeControls({ className = "" }) {
  const containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useScrollAnimation(containerRef, {
    threshold:   0,
    pauseDelay:  100,
    onForward:   () => setHidden(true),   // scroll down → hide
    onBackward:  () => setHidden(false),  // scroll up   → show
  });

  const classes = [
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "flex gap-[var(--spacing-sm)]",
    hidden ? "-translate-y-[100vh] opacity-0" : "translate-y-0 opacity-100",
    "transition-all duration-300 ease-in-out",
    className,
  ].join(" ");

  return (
    <div ref={containerRef} className={classes}>
      <ThemeToggle />
      <AccentPicker />
    </div>
  );
}
