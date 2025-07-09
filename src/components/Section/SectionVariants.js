// src/components/Section/SectionVariants.js
import HeroBg from "@/assets/background.svg";

/**
 * SectionVariants defines reusable layout and styling for different section types.
 * Use via <Section variant="<key>" ... /> to apply these defaults.
 */
export const SectionVariants = {
  /**
   * Primary Hero variant – full-screen hero with background image, overlay, heading, description, and buttons.
   */
  primaryHero: {
    sectionClass:      "flex flex-col items-center min-h-screen justify-end [background-image:var(--heroGradient)] bg-cover bg-fixed bg-center z-10 text-xl",
  contentClass:      "relative md:py-0 w-auto h-full flex flex-col md:flex-row z-20 md:gap-[var(--spacing-xs)]",
  topContentClass:   "basis-4/7 w-80/100 mx-auto md:w-auto flex items-start justify-center md:justify-center flex-col pt-[100px] md:pl-[80px]",
  imageColumnClass:  "flex items-end justify-center mx-auto max-w-xs md:basis-3/7 md:max-w-none md:justify-end",
  buttonsPlacement:  "top-content-section",
  headingAreaClass:  "space-y-[var(--spacing-md)]",
  descriptionClass:  "md:pr-[var(--spacing-xl)] font-thin text-lg md:text-xl",
  },

  /**
   * Secondary Hero variant – simple centered section with background and title.
   */
  secondaryHero: {
    sectionClass: "flex items-center justify-center",
    contentClass: "mx-auto text-center space-y-[var(--spacing-md)]",
    backgroundMedia: {
      image: {
        src: HeroBg,
        imageClass: "filter brightness-50 bg-cover bg-center xl:bg-fixed",
      },
      overlayClass: "bg-text opacity-50",
    },
  },
};
