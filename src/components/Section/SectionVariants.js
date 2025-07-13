// src/components/Section/SectionVariants.js
import HeroBg from "@/assets/background.svg";

/**
 * SectionVariants defines reusable layout and styling for different section types.
 * Use via <Section variant="<key>" ... /> to apply these defaults.
 */
const sectionDefaults = {
  primary: {
    itemPlacement: "top-content-section",
    buttonsPlacement: "top-content-section",
    buttonsSectionClass:
      "flex items-center justify-center " +
      "md:justify-end md:absolute md:top-0 md:right-0 md:z-20",
    // instead of flex/flex-wrap
  },

  secondary: {
    // 1️⃣ We don’t need any absolute trickery—just a simple vertical flow.
    //    The <Section> will render heading/description first, then
    //    items (content-section), then buttons (also content-section).
    // pull everything into a centered column (optional—adjust as you like)
    // center your text & constrain width
    topContentClass: "w-full",
    // heading area needs no special flex—just stacked text
    headingAreaClass:
      "w-full flex flex-col md:flex-row justify-between items-center",

    // 2️⃣ items go in the “content-section” (immediately after heading)
    itemPlacement: "content-section",

    // 3️⃣ buttons also in content-section, which now places them
    //    after the items, every time.
    buttonsPlacement: "content-section",
    buttonsSectionClass: "mt-[var(--spacing-lg)] flex justify-center",
    //  use a grid or flex here—example with grid 1–3 cols:
  },
};

export const SectionVariants = {
  /**
   * Primary Hero variant – full-screen hero with background image, overlay, heading, description, and buttons.
   */
  primaryHero: {
    sectionClass:
      "flex flex-col items-center min-h-screen justify-end [background-image:var(--heroGradient)] bg-cover bg-center z-10 text-xl",
    contentClass:
      "relative md:py-0 w-auto h-full flex flex-col md:flex-row z-20 md:gap-[var(--spacing-xs)]",
    topContentClass:
      "basis-4/7 min-h-[75vh] md:min-h-screen space-y-[var(--spacing-md)] md:space-y-[var(--spacing-2xl)] md:h-auto w-80/100 mx-auto md:w-auto flex items-start justify-center md:justify-center flex-col md:pl-[80px]",
    imageColumnClass:
      "basis-3/7 flex items-end justify-center md:justify-end slide-up",
    buttonsPlacement: "top-content-section",
    headingAreaClass: "space-y-[var(--spacing-sm)]",
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
  primary: {
    ...sectionDefaults.primary,
    itemsClass:
      "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]",
    // no need for basis-*, just size the height
    itemClass: "h-[30vh] flex flex-col justify-center items-center text-center",
  },
  secondary: {
    ...sectionDefaults.secondary,
  itemsClass:
      "w-full grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-xl)]",

    // make each card fill its grid‐cell
    itemClass: "h-[30vh] flex flex-col justify-center items-center text-center",
  },
};
