// src/components/Button/variants/PrimaryButton.tsx
/**
 * Primary Button Variant
 *
 * Solid blue button - the default and most prominent button style.
 * Used for primary actions like form submissions, main CTAs.
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
    "text-bg hover:bg-primary-700 focus:ring-primary bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-colors";

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon, props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
