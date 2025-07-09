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
    sectionClass:
      "flex flex-col items-center min-h-screen justify-end [background-image:var(--heroGradient)] bg-cover bg-fixed bg-center z-10 text-xl",
    contentClass: "relative w-9/10 py-[150px] md:py-0 md:w-auto h-full flex flex-col md:flex-row z-20",
    topContentClass:
      "basis-4/7 flex items-start justify-center md:justify-center flex-col pl-[20px] md:pl-[80px]",
    imageColumnClass: "basis-3/7 flex items-end justify-center md:justify-end",
    buttonsPlacement: "top-content-section",
    headingAreaClass: "space-y-[var(--spacing-md)]",
    descriptionClass: "md:pr-[var(--spacing-xl)] font-thin text-lg md:text-xl",
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
