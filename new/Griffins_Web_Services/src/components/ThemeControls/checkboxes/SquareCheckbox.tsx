import type { InputHTMLAttributes } from "react";

interface SquareCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  color: string;
}

export function SquareCheckbox({
  color,
  checked,
  onChange,
  ...props
}: SquareCheckboxProps) {
  return (
    <label className="inline-block cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span
        className="w-7 h-7 sm:w-8 sm:h-8 block rounded-sm border-2 border-transparent peer-checked:border-primary-light peer-checked:shadow-lg transition-colors"
        style={{ backgroundColor: color }}
      />
    </label>
  );
}
