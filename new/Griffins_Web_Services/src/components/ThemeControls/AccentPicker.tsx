import { useEffect, useRef, useState } from "react";
import { useAccentColor } from "@/hooks/useAccentColor";
import { CircleCheckbox } from "./checkboxes/CircleCheckbox";
import { SquareCheckbox } from "./checkboxes/SquareCheckbox";

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const { accent, setAccent, accents } = useAccentColor();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <CircleCheckbox
        checked={open}
        onChange={() => setOpen((value) => !value)}
        aria-label="Pick accent color"
        className="faded-bg"
      >
        <svg className="w-[22px] h-[22px] lg:w-[22px] lg:h-[22px]" viewBox="0 0 100 100">
          <path
            d="M50 10C50 10 25 35 25 55C25 70.464 37.536 83 50 83C62.464 83 75 70.464 75 55C75 35 50 10 50 10Z"
            fill="var(--color-accent)"
          />
        </svg>
      </CircleCheckbox>

      {open && (
        <div
          className="absolute top-full mt-1 lg:mt-2 right-0 sm:left-0 sm:right-auto faded-bg rounded-xl p-2 lg:p-3 flex space-x-2 lg:space-x-3 overflow-x-auto hide-scrollbar shadow-lg z-50 w-max max-w-[calc(100vw-2.5rem)] sm:max-w-none"
        >
          {accents.map((color) => (
            <SquareCheckbox
              key={color}
              color={color}
              checked={accent === color}
              onChange={() => {
                setAccent(color);
                setOpen(false);
              }}
              aria-label={`Select accent color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
