/**
 * Scroll Animation Observer
 *
 * Lightweight vanilla JS system for scroll-triggered animations.
 * Works with both Astro components and React components.
 *
 * Usage:
 * - Add `data-animate` attribute to any element
 * - Optionally add `data-animate-once="true"` for one-time animations
 * - Optionally add `data-animate-delay="200"` for staggered animations (ms)
 * - CSS classes handle the actual animation (e.g., .animate-fade-in)
 *
 * The observer adds/removes `data-visible="true"` which CSS uses to trigger animations.
 */

import { createIntersectionObserver } from "@/utils/IntersectionObserver";

interface AnimationObserverOptions {
  defaultThreshold?: number;
  defaultRootMargin?: string;
}

class ScrollAnimationObserver {
  private observedElements = new WeakSet<Element>();
  private disconnectors = new WeakMap<Element, () => void>();
  private defaultThreshold: number;
  private defaultRootMargin: string;

  constructor(options: AnimationObserverOptions = {}) {
    this.defaultThreshold = options.defaultThreshold ?? 0.1;
    this.defaultRootMargin = options.defaultRootMargin ?? "0px 0px -50px 0px";
  }

  init() {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    // Observe initial elements
    this.observeAll();

    // Watch for dynamically added elements (React hydration, etc.)
    this.setupMutationObserver();
  }

  private observeAll() {
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => this.observe(el as HTMLElement));
  }

  private observe(el: HTMLElement) {
    if (this.observedElements.has(el)) {
      return;
    }

    this.observedElements.add(el);

    const once = el.dataset.animateOnce === "true";
    const delay = parseInt(el.dataset.animateDelay || "0", 10);

    const { disconnect } = createIntersectionObserver(el, {
      threshold: this.defaultThreshold,
      rootMargin: this.defaultRootMargin,
      once,
      onEnter: () => {
        if (delay > 0) {
          setTimeout(() => {
            el.dataset.visible = "true";
          }, delay);
        } else {
          el.dataset.visible = "true";
        }
      },
      onExit: () => {
        if (!once) {
          el.dataset.visible = "false";
        }
      },
    });

    this.disconnectors.set(el, disconnect);
  }

  private setupMutationObserver() {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the node itself has data-animate
            if (node.hasAttribute("data-animate")) {
              this.observe(node);
            }
            // Check descendants
            node.querySelectorAll?.("[data-animate]").forEach((el) => {
              this.observe(el as HTMLElement);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Create and export singleton instance
let instance: ScrollAnimationObserver | null = null;

export function initScrollAnimations(options?: AnimationObserverOptions) {
  if (instance) return instance;
  instance = new ScrollAnimationObserver(options);
  instance.init();
  return instance;
}

// Auto-initialize when DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initScrollAnimations());
  } else {
    initScrollAnimations();
  }
}
