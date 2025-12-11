/**
 * Animation Props Utility
 *
 * Generates data attributes for scroll-triggered animations.
 * Works with both Astro and React components.
 *
 * Usage in Astro:
 * ```astro
 * <div {...animationProps("fade-in-up", { once: true, delay: 200 })}>
 *   Content
 * </div>
 * ```
 *
 * Usage in React:
 * ```tsx
 * <div {...animationProps("fade-in-up", { once: true, delay: 200 })}>
 *   Content
 * </div>
 * ```
 *
 * Available animations:
 * - fade-in, fade-in-up, fade-in-down, fade-in-left, fade-in-right, fade-in-scale
 * - scale-in, pop-in, zoom-in
 * - slide-up, slide-down, slide-left, slide-right
 */

// Using inline type instead of importing from React to avoid SSR issues
type CSSProperties = Record<string, string | number>;

export type AnimationType =
  | "fade-in"
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "fade-in-scale"
  | "scale-in"
  | "pop-in"
  | "zoom-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "color-text-fade";

export interface AnimationOptions {
  /** Only animate once (default: true) */
  once?: boolean;
  /** Delay in milliseconds before animation starts */
  delay?: number;
  /** Custom duration in milliseconds */
  duration?: number;
}

interface AnimationDataAttributes {
  "data-animate": AnimationType;
  "data-animate-once"?: string;
  "data-animate-delay"?: string;
  style?: CSSProperties;
}

/**
 * Generate animation data attributes for an element
 */
export function animationProps(
  animation: AnimationType,
  options: AnimationOptions = {}
): AnimationDataAttributes {
  const { once = true, delay, duration } = options;

  const attrs: AnimationDataAttributes = {
    "data-animate": animation,
  };

  if (once) {
    attrs["data-animate-once"] = "true";
  }

  if (delay !== undefined || duration !== undefined) {
    const style: Record<string, string> = {};
    if (delay !== undefined) {
      attrs["data-animate-delay"] = String(delay);
      style["--animation-delay"] = `${delay}ms`;
    }
    if (duration !== undefined) {
      style["--animation-duration"] = `${duration}ms`;
    }
    attrs.style = style as CSSProperties;
  }

  return attrs;
}

/**
 * Generate staggered animation props for a list of items
 */
export function staggeredAnimationProps(
  animation: AnimationType,
  index: number,
  options: AnimationOptions & { staggerDelay?: number } = {}
): AnimationDataAttributes {
  const { staggerDelay = 100, delay = 0, ...rest } = options;
  return animationProps(animation, {
    ...rest,
    delay: delay + index * staggerDelay,
  });
}
