import type { InputHTMLAttributes, ReactNode } from "react";

interface CircleCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
  children?: ReactNode;
}

export function CircleCheckbox({
  checked,
  className = "circle-box",
  children,
  ...props
}: CircleCheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        {...props}
      />

      <span
        className={`${className} w-9 h-9 rounded-full transition-all flex items-center justify-center relative`}
      >
        {children}
      </span>
    </label>
  );
}
