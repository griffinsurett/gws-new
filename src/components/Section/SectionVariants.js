// src/components/Section/SectionVariants.js
import HeroBg from "@/assets/background.svg";

const primaryItemsClassDefaults =
  "order-2 md:order-last w-full gap-[var(--spacing-2xl)]";
/**
 * SectionVariants defines reusable layout and styling for different section types.
 * Use via <Section variant="<key>" ... /> to apply these defaults.
 */
const sectionDefaults = {
  primary: {
    sectionClass: "section",
    contentClass: "flex flex-wrap",
    itemPlacement: "top-content-section",
    bottomPlacement: "top-content-section",
    topContentClass:
      "flex justify-center md:justify-between items-center w-full flex-wrap between-heading-items",
    headingAreaClass:
      "order-1 md:w-1/2 flex justify-center text-center md:text-left md:items-start flex-col gap-[var(--spacing-md)] md:gap-0",
    bottomContentClass: 
      "md:z-20 load slide-right order-last sm:order-2",
  },

  secondary: {
    // 1️⃣ We don’t need any absolute trickery—just a simple vertical flow.
    //    The <Section> will render heading/description first, then
    //    items (content-section), then buttons (also content-section).
    // pull everything into a centered column (optional—adjust as you like)
    // center your text & constrain width
    sectionClass: "section",
    contentClass: "",
    topContentClass: "w-full flex flex-col m-0 p-0 between-heading-items",
    descriptionClass: "text-center md:text-right large-text load slide-right",
    // heading area needs no special flex—just stacked text
    headingAreaClass:
      "w-full flex flex-col md:flex-row justify-between items-center gap-[var(--spacing-md)] md:gap-0",

    // 2️⃣ items go in the “content-section” (immediately after heading)
    itemPlacement: "top-content-section",

    // 3️⃣ buttons also in content-section, which now places them
    //    after the items, every time.
    buttonsPlacement: "content-section",
    buttonsSectionClass: "mt-[var(--spacing-lg)] flex justify-center load scale-up",
    //  use a grid or flex here—example with grid 1–3 cols:
  },
};

export const SectionVariants = {
  /**
   * Primary Hero variant – full-screen hero with background image, overlay, heading, description, and buttons.
   */
  primaryHero: {
    sectionClass:
      "flex flex-col items-center min-h-screen md:pt-[var(--spacing-4xl)] lg:pt-0 lg:min-h-screen justify-end [background-image:var(--heroGradient)] bg-cover bg-center z-10 text-xl",
    contentClass:
      "relative lg:py-0 w-auto h-full flex flex-col md:flex-row z-20 lg:gap-[var(--spacing-xs)]",
    topContentClass:
      "basis-4/7 min-h-screen space-y-[var(--spacing-xl)] lg:space-y-[var(--spacing-xl)] lg:h-auto w-80/100 mx-auto lg:w-auto flex items-start justify-center lg:justify-center flex-col md:pl-[80px]",
    imageColumnClass:
      "basis-3/7 flex items-end justify-center md:justify-end slide-up",
    bottomContentClass: "w-full flex flex-col-reverse my-[var(--spacing-lg)] md:my-[var(--spacing-xl)] lg:flex-row-reverse items-start lg:items-center justify-end gap-[var(--spacing-xl)] xl:gap-[var(--spacing-2xl)]",
    bottomPlacement: "top-content-section",
    headingAreaClass: "space-y-[var(--spacing-sm)] lg:space-y-[var(--spacing-md)] m-0",
    descriptionClass: "lg:pr-[var(--spacing-xl)] font-thin large-text",
    childPlacement: "bottom-content-section"
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
    // no need for basis-*, just size the height
    itemsClass: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${primaryItemsClassDefaults}`,
    descriptionClass: "hidden",
  },
  secondary: {
    ...sectionDefaults.secondary,
    itemsClass:
      "w-full grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-xl)]",

    // make each card fill its grid‐cell
    itemClass: "h-[30vh] flex flex-col justify-center items-center text-center",
  },
  testimonials: {
    ...sectionDefaults.secondary,
    itemsClass: `${primaryItemsClassDefaults}`,
  },
  faq: {
    sectionClass: "section",
    contentClass: "w-full flex flex-col lg:flex-row justify-center items-start gap-[var(--spacing-lg)]",
    topContentClass: "lg:sticky lg:top w-full lg:w-1/3 flex items-center justify-center m-0",
    itemsClass: "w-auto lg:w-2/3 h-full flex flex-col gap-[var(--spacing-md)]",
    imageColumnClass: "hidden",
    descriptionClass: "font-thin large-text",
  }
};
