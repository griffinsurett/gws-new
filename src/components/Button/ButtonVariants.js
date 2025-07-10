// src/components/Button/ButtonVariants.js
import GWSLogo from "@/assets/GWS-animated.png";

export const baseButtonClasses =
  "relative inline-flex items-center group py-[var(--spacing-md)] px-[var(--spacing-2xl)] md:px-[var(--spacing-4xl)] uppercase font-medium rounded-full hover-animation";

const sharedIconDefaults = {
  icon: GWSLogo.src,
  hoverOnly: true,
  animateIcon: true,
};

const noIcon = {
  icon: null,
  hoverOnly: false,
  animateIcon: false,
};

export const ButtonVariants = {
  primary: {
    variantClasses:
      "text-[var(--color-bg) bg-transparent border-effect hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] rounded",
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
    variantClasses: "text-text hover:text-primary",
    iconDefaults: { ...sharedIconDefaults },
  },
  linkNoIcon: {
    variantClasses: "text-text hover:text-primary",
    iconDefaults: { ...noIcon },
  },
};
