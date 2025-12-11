// src/components/Button/variants/PrimaryButton.tsx
/**
 * Primary Button Variant
 *
 * Solid blue button - the default and most prominent button style.
 * Used for primary actions like form submissions, main CTAs.
 */

import { animationProps } from "@/utils/animationProps";
import { ButtonBase, type ButtonProps } from "../Button";
import { getButtonBaseClasses, renderButtonIcon } from "../utils";

/**
 * Primary button with blue background and white text
 */
export default function PrimaryButton({
  leftIcon,
  rightIcon,
  className = "",
  animated = true,
  buttonWrapperClasses,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseShell = getButtonBaseClasses(props.size);
  const variantClasses = [
    baseShell,
    "primary-button-transition border-2 border-primary primary-gradient gradient-disappear-on-hover text-bg hover:text-heading",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonContent = (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`.trim()}
      leftIcon={renderButtonIcon(leftIcon, props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );

  const wrapperClasses = [
    "inline-flex",
    fullWidth ? "w-full" : "w-full lg:w-auto",
    buttonWrapperClasses,
  ]
    .filter(Boolean)
    .join(" ");

  if (!animated) {
    return <span className={wrapperClasses}>{buttonContent}</span>;
  }

  return (
    <span
      {...animationProps("zoom-in", { once: true })}
      className={wrapperClasses}
    >
      {buttonContent}
    </span>
  );
}
