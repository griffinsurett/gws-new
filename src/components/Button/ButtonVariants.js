// src/components/Button/ButtonVariants.js
import GWSLogo from "@/assets/GWS-animated.png";

export const baseButtonClasses =
  "text-lg relative inline-flex items-center group py-[var(--spacing-md)] lg:py-[var(--spacing-lg)] px-[var(--spacing-2xl)] lg:px-[var(--spacing-3xl)] uppercase font-light rounded-full hover-animation";

const sharedIconDefaults = {
  icon: GWSLogo.src,
  hoverOnly: true,
  position: "left",
   className:
     "transform transition-transform duration-300 ease-in-out " +
     "group-hover:rotate-[-360deg] group-hover:-translate-x-1",
};

const noIcon = {
  icon: null,
  hoverOnly: false,
};

export const ButtonVariants = {
  primary: {
    variantClasses:
      "text-heading button-small bg-transparent border-effect hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] rounded",
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
    iconDefaults: { icon: GWSLogo.src, hoverOnly: false },
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
