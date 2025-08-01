// src/components/Button/ButtonVariants.js
import GWSLogo from "@/assets/GWS-animated.png";
// import "./buttons.css";

export const baseButtonClasses =
  "text-base lg:text-lg relative inline-flex items-center group font-light rounded-full";

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
      "button-sm neon-effect-border-secondary text-primary hover:text-bg",
    buttonClasses: baseButtonClasses,
    iconDefaults: { ...noIcon },
  },
  secondary: {
    variantClasses:
      "button-sm neon-effect-background-primary",
    buttonClasses: baseButtonClasses,
    iconDefaults: { ...noIcon },
  },
  underline: {
    variantClasses: "underline text-(--color-primary) hover:text-primary",
    buttonClasses: baseButtonClasses,
    iconDefaults: { icon: GWSLogo.src, hoverOnly: false },
  },
  link: {
    variantClasses: "hover:text-primary",
    iconDefaults: { ...sharedIconDefaults },
  },
  linkNoIcon: {
    variantClasses: "hover:text-primary",
    iconDefaults: { ...noIcon },
  },
};
