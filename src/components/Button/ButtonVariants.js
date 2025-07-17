// src/components/Button/ButtonVariants.js
import GWSLogo from "@/assets/GWS-animated.png";

export const baseButtonClasses =
  "h6 relative inline-flex items-center group py-[var(--spacing-md)] lg:py-[var(--spacing-lg)] px-[var(--spacing-3xl)] lg:px-[var(--spacing-4xl)] uppercase font-normal rounded-full hover-animation";

const sharedIconDefaults = {
  icon: GWSLogo.src,
  hoverOnly: true,
  animateIcon: true,
  position: "left",
};

const noIcon = {
  icon: null,
  hoverOnly: false,
  animateIcon: false,
};

export const ButtonVariants = {
  primary: {
    variantClasses:
      "text-heading h5 bg-transparent border-effect hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] rounded",
    buttonClasses: baseButtonClasses,
    iconDefaults: { ...noIcon },
  },
  secondary: {
    variantClasses:
      "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary)]",
    buttonClasses: baseButtonClasses,
    iconDefaults: { ...noIcon },
  },
  underline: {
    variantClasses: "underline text-[var(--color-primary)] hover:text-primary",
    buttonClasses: baseButtonClasses,
    iconDefaults: { icon: GWSLogo.src, hoverOnly: false, animateIcon: false },
  },
  link: {
    variantClasses: "flex justify-center items-center hover:text-primary",
    iconDefaults: { ...sharedIconDefaults },
  },
  linkNoIcon: {
    variantClasses: "hover:text-primary",
    iconDefaults: { ...noIcon },
  },
};
