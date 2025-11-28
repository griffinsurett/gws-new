import type { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";

interface HamburgerButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  isOpen: boolean;
  onChange:
    | ((isOpen: boolean) => void)
    | Dispatch<SetStateAction<boolean>>;
  className?: string;
  hamburgerTransform?: boolean;
  ariaLabel?: string;
}

export default function HamburgerButton({
  isOpen,
  onChange,
  className = "",
  ariaLabel = "Toggle menu",
  hamburgerTransform = true,
  ...props
}: HamburgerButtonProps) {
  const shouldTransform = hamburgerTransform && isOpen;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      onClick={() => onChange(!isOpen)}
      className={`group relative h-4.5 lg:h-5 w-6 cursor-pointer flex flex-col justify-between items-start text-current ${className}`.trim()}
      {...props}
    >
      <span
        className={`block h-px w-full bg-current transition-all duration-300 ${
          shouldTransform ? "absolute top-1/2 -translate-y-1/2 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-px bg-current transition-all duration-300 ${
          shouldTransform ? "opacity-0 w-full" : "opacity-100 w-4 group-hover:w-full"
        }`}
      />
      <span
        className={`block h-px w-full bg-current transition-all duration-300 ${
          shouldTransform ? "absolute top-1/2 -translate-y-1/2 -rotate-45" : ""
        }`}
      />
    </button>
  );
}
