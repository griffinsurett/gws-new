// src/components/Button/variants/SecondaryButton.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { ButtonBase, type ButtonProps } from "../Button";
import { getButtonBaseClasses, renderButtonIcon } from "../utils";

const BORDER_RADIUS_CLASS = "rounded-full";

export default function SecondaryButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEngaged(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const overlayStyle: CSSProperties & Record<string, string> = {
    "--ab-color": "var(--color-accent)",
    "--ab-border-width": "2px",
    "--ab-duration": "300ms",
    "--ab-progress": engaged ? "360deg" : "0deg",
  };

  const outerWrapperClasses = [
    "relative inline-block",
    "primary-button-transition",
    "w-full lg:w-auto",
  ].join(" ");

  const innerButtonClasses = [
    getButtonBaseClasses(props.size),
    "relative z-10 shadow-none",
    "bg-transparent text-heading",
    "hover:bg-accent/10 dark:hover:bg-primary-light/10 transition-colors",
    BORDER_RADIUS_CLASS,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={outerWrapperClasses}>
      <span
        aria-hidden="true"
        className={[
          "absolute inset-0",
          BORDER_RADIUS_CLASS,
          "pointer-events-none z-20",
          "animated-border-overlay progress",
        ].join(" ")}
        style={overlayStyle}
      />

      <span className={`relative z-10 block overflow-hidden ${BORDER_RADIUS_CLASS}`}>
        <ButtonBase
          {...props}
          className={innerButtonClasses}
          leftIcon={renderButtonIcon(leftIcon, props.size)}
          rightIcon={renderButtonIcon(rightIcon, props.size)}
          unstyled
        />
      </span>
    </span>
  );
}
