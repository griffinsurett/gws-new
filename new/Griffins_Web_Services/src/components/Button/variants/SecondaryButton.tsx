// src/components/Button/variants/SecondaryButton.tsx
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";
import { ButtonBase, type ButtonProps } from "../Button";
import { getButtonBaseClasses, renderButtonIcon } from "../utils";

const BORDER_RADIUS_CLASS = "rounded-full";
const DEFAULT_WRAPPER_CLASSES =
  "inline-flex primary-button-transition w-full lg:w-auto";

export default function SecondaryButton({
  leftIcon,
  rightIcon,
  className = "",
  buttonWrapperClasses,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const innerButtonClasses = [
    getButtonBaseClasses(props.size),
    "bg-transparent text-heading shadow-none",
    BORDER_RADIUS_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AnimatedBorder
      variant="solid"
      triggers="always"
      color="var(--color-accent)"
      borderWidth={2}
      borderRadius={BORDER_RADIUS_CLASS}
      className={
        [
          fullWidth ? "inline-flex w-full" : DEFAULT_WRAPPER_CLASSES,
          buttonWrapperClasses,
          "primary-button-transition justify-center items-center",
        ]
          .filter(Boolean)
          .join(" ")
      }
      innerClassName="p-0 shadow-none border-transparent justify-center items-center bg-transparent"
    >
      <ButtonBase
        {...props}
        className={innerButtonClasses}
        leftIcon={renderButtonIcon(leftIcon, props.size)}
        rightIcon={renderButtonIcon(rightIcon, props.size)}
      />
    </AnimatedBorder>
  );
}
