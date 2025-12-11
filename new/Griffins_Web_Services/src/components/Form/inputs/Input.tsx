// src/components/Form/inputs/Input.tsx
/**
 * Hybrid Input Component with Animated Border styling from the legacy project.
 * Preserves the API we built for the new project while matching the old visuals.
 */

import {
  useCallback,
  useId,
  useState,
  type FocusEvent,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
} from "react";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;

  // Control visibility
  showLabel?: boolean;
  labelHidden?: boolean;

  // Accessibility helpers
  describedBy?: string;

  // Animated border tweaks
  borderDuration?: number;
  borderWidth?: number;
  borderRadius?: string;
}

export default function Input({
  name,
  label,
  required = false,
  containerClassName = "space-y-2",
  labelClassName = "block text-sm text-text/80",
  inputClassName = "",
  showLabel = true,
  labelHidden = false,
  describedBy,
  borderDuration = 900,
  borderWidth = 2,
  borderRadius = "rounded-xl",
  id: idProp,
  onFocus,
  onBlur,
  ...inputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const reactId = useId();
  const id = idProp ?? `${name}-${reactId}`;

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
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
        <input
          id={id}
          name={name}
          required={required}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={`form-field ${inputClassName}`.trim()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...inputProps}
        />
      </AnimatedBorder>
    </div>
  );
}
