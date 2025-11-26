// src/components/Form/inputs/Checkbox.tsx
/**
 * Hybrid Checkbox Component
 * Pure TSX component - uses HTML5 validation
 */

import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  name: string;
  label?: ReactNode;
  children?: ReactNode;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
}

export default function Checkbox({
  name,
  label,
  children,
  required = false,
  containerClassName = "mb-4",
  labelClassName = "flex items-center cursor-pointer",
  checkboxClassName = "w-4 h-4 text-primary border-surface rounded",
  ...checkboxProps
}: CheckboxProps) {
  const labelContent = children ?? label;

  return (
    <div className={containerClassName}>
      <label className={labelClassName}>
        <input
          type="checkbox"
          id={name}
          name={name}
          className={checkboxClassName}
          required={required}
          {...checkboxProps}
        />
        {labelContent && (
          <span className="ml-2 text-text">
            {labelContent}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </label>
    </div>
  );
}
