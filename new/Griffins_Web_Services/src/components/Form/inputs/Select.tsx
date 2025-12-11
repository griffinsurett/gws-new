// src/components/Form/inputs/Select.tsx
/**
 * Hybrid Select Component with Animated Border styling.
 */

import {
  useCallback,
  useId,
  useState,
  type FocusEvent,
  type SelectHTMLAttributes,
} from "react";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;

  // Control
  showLabel?: boolean;
  labelHidden?: boolean;
  describedBy?: string;

  borderDuration?: number;
  borderWidth?: number;
  borderRadius?: string;
}

export default function Select({
  name,
  label,
  required = false,
  options,
  placeholder = "Select an option",
  containerClassName = "space-y-2",
  labelClassName = "block text-sm text-text/80",
  selectClassName = "",
  showLabel = true,
  labelHidden = false,
  describedBy,
  borderDuration = 900,
  borderWidth = 2,
  borderRadius = "rounded-xl",
  id: idProp,
  onFocus,
  onBlur,
  ...selectProps
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const reactId = useId();
  const id = idProp ?? `${name}-${reactId}`;

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      setFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  const labelClasses = [
    labelClassName,
    !showLabel || labelHidden ? "sr-only" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <AnimatedBorder
        variant="solid"
        triggers="controlled"
        active={focused}
        duration={borderDuration}
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        color="var(--color-accent)"
        innerClassName={`!bg-transparent !border-transparent p-0 ${borderRadius}`}
      >
        <div className="relative">
          <select
            id={id}
            name={name}
            required={required}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={`form-field appearance-none pr-10 ${selectClassName}`.trim()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...selectProps}
          >
            {placeholder && (
              <option value="" className="form-option" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="form-option"
              >
                {option.label}
              </option>
            ))}
          </select>

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </AnimatedBorder>
    </div>
  );
}
