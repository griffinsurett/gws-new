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
      "flex items-center h-screen lg:h-auto justify-center [background-image:var(--heroGradient)] bg-cover bg-fixed bg-center z-10 text-xl",
    contentClass: "relative h-full md:h-auto flex flex-col items-end md:items-center justify-end md:justify-center md:flex-row z-20 text-left",
    buttonsSectionClass: "mt-[var(--spacing-xl)] flex flex-wrap gap-[var(--spacing-md)] justify-start",
    topContentClass: "flex items-start justify-center mt-[-30px] lg:mt-[80px] md:w-1/2 flex-col pl-[20px] md:pl-[80px] flex-shrink",
    imageColumnClass: "flex justify-end items-end w-1/2",
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
