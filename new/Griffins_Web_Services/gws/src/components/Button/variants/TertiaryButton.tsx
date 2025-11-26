// src/components/Button/variants/TertiaryButton.tsx
/**
 * Tertiary Button Variant
 *
 * Solid accent button - the default and most prominent button style.
 * Used for tertiary actions like form submissions, main CTAs.
 */

import { ButtonBase, type ButtonProps } from "../Button";
import { renderButtonIcon } from "../utils";

/**
 * Primary button with blue background and white text
 */
export default function PrimaryButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  // Primary button styling
  const variantClasses =
    "bg-accent text-bg hover:bg-accent-700 focus:ring-accent";

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon, props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
