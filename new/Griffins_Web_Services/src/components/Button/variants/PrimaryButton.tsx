// src/components/Button/variants/PrimaryButton.tsx
/**
 * Primary Button Variant
 *
 * Solid blue button - the default and most prominent button style.
 * Used for primary actions like form submissions, main CTAs.
 */

import { useAnimatedElement } from "@/hooks/animations/useViewAnimation";
import { ButtonBase, type ButtonProps } from "../Button";
import { getButtonBaseClasses, renderButtonIcon } from "../utils";

/**
 * Primary button with blue background and white text
 */
export default function PrimaryButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const anim = useAnimatedElement<HTMLSpanElement>({
    duration: 100,
    delay: 0,
    threshold: 0,
    rootMargin: "0px 0px -15% 0px",
  });

  const baseShell = getButtonBaseClasses(props.size);
  const variantClasses = [
    baseShell,
    "primary-button-transition",
    "border-2 border-primary",
    "text-bg hover:text-heading",
    "bg-gradient-to-r from-primary to-primary-700",
    "hover:bg-transparent hover:from-transparent hover:to-transparent",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={anim.ref}
      className="inline-flex w-full lg:w-auto animated-element zoom-in"
      {...anim.props}
    >
      <ButtonBase
        {...props}
        className={`${variantClasses} ${className}`.trim()}
        leftIcon={renderButtonIcon(leftIcon, props.size)}
        rightIcon={renderButtonIcon(rightIcon, props.size)}
        unstyled
      />
    </span>
  );
}
