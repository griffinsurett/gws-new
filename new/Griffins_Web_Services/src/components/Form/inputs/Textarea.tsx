// src/components/Form/inputs/Textarea.tsx
/**
 * Hybrid Textarea Component with Animated Border styling.
 */

import {
  useCallback,
  useId,
  useState,
  type FocusEvent,
  type TextareaHTMLAttributes,
} from "react";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;

  // Control
  showLabel?: boolean;
  labelHidden?: boolean;
  describedBy?: string;

  borderDuration?: number;
  borderWidth?: number;
  borderRadius?: string;
}

export default function Textarea({
  name,
  label,
  required = false,
  containerClassName = "space-y-2",
  labelClassName = "block text-sm text-text/80",
  textareaClassName = "resize-none",
  showLabel = true,
  labelHidden = false,
  describedBy,
  rows = 5,
  borderDuration = 900,
  borderWidth = 2,
  borderRadius = "rounded-xl",
  id: idProp,
  onFocus,
  onBlur,
  ...textareaProps
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const reactId = useId();
  const id = idProp ?? `${name}-${reactId}`;

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
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
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={`form-field resize-none ${textareaClassName}`.trim()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textareaProps}
        />
      </AnimatedBorder>
    </div>
  );
}
