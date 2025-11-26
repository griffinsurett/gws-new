import { useRef, useState } from "react";
import DarkLightToggle from "./DarkLightToggle";
import AccentPicker from "./AccentPicker";

interface ThemeControlsProps {
  className?: string;
}

export default function ThemeControls({ className = "" }: ThemeControlsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hidden] = useState(false);

  return (
    <div
      ref={ref}
      className={[
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "flex items-center gap-1 lg:gap-2",
        "transition-opacity duration-300 ease-in-out",
        hidden
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <DarkLightToggle />
      <AccentPicker />
    </div>
  );
}
