import { useId } from "react";
import { CircleCheckbox } from "./checkboxes/CircleCheckbox";
import { useTheme } from "@/hooks/useTheme";

export default function DarkLightToggle() {
  const { isLight, setTheme } = useTheme();
  const maskId = useId();

  const R = 18;
  const ratio = 0.69;
  const rIn = R * ratio;
  const dx = -R * 0.4;
  const dy = R * -0.2;

  return (
    <div className="flex items-center gap-2">
      <CircleCheckbox
        checked={isLight}
        onChange={(event) => setTheme(event.target.checked ? "light" : "dark")}
        aria-label="Toggle light mode"
        className="faded-bg"
      >
        <div className="light:hidden dark:block">
          <svg
            viewBox="32 32 36 36"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-4 h-4 sm:w-[14px] sm:h-[14px]"
          >
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="#000" />
                <circle cx="50" cy="50" r={18} fill="#fff" />
                <circle cx={50 + dx} cy={50 + dy} r={rIn} fill="#000" />
              </mask>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={18}
              mask={`url(#${maskId})`}
              fill="var(--color-primary)"
            />
          </svg>
        </div>

        <div className="light:block dark:hidden">
          <svg
            viewBox="13 13 74 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-5 h-5 sm:w-[18px] sm:h-[18px]"
          >
            <circle cx="50" cy="50" r="18" fill="var(--color-primary)" />
            <g
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <line x1="50" y1="15" x2="50" y2="25" />
              <line x1="50" y1="75" x2="50" y2="85" />
              <line x1="15" y1="50" x2="25" y2="50" />
              <line x1="75" y1="50" x2="85" y2="50" />
              <line x1="25.86" y1="25.86" x2="32.32" y2="32.32" />
              <line x1="67.68" y1="67.68" x2="74.14" y2="74.14" />
              <line x1="25.86" y1="74.14" x2="32.32" y2="67.68" />
              <line x1="67.68" y1="32.32" x2="74.14" y2="25.86" />
            </g>
          </svg>
        </div>
      </CircleCheckbox>
    </div>
  );
}
