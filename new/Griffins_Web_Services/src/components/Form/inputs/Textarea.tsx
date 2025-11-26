// src/components/Form/inputs/Textarea.tsx
/**
 * Hybrid Textarea Component
 * Pure TSX component - uses HTML5 validation
 */

import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;

  // Control
  showLabel?: boolean;
}

export default function Textarea({
  name,
  label,
  required = false,
  containerClassName = "mb-4",
  labelClassName = "block text-sm font-medium text-text mb-1",
  textareaClassName = "w-full px-4 py-2 border border-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical",
  showLabel = true,
  rows = 4,
  ...textareaProps
}: TextareaProps) {
  return (
    <div className={containerClassName}>
      {showLabel && label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        className={textareaClassName}
        required={required}
        {...textareaProps}
      />
    </div>
  );
}
