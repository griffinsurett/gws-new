import React, { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useVisibility } from "./useVisibility";

type Direction = "forward" | "reverse";

type RootMargin = string | number;

export interface AnimatedElementOptions<T extends HTMLElement> {
  ref?: MutableRefObject<T | null>;
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  rootMargin?: RootMargin;
  once?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onReverse?: () => void;
}

interface AnimatedElementProps {
  style: React.CSSProperties;
  "data-visible": "true" | "false";
  "data-animation-direction": Direction;
}

export interface AnimatedElementHook<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  inView: boolean;
  progress: number;
  progressDecimal: number;
  direction: Direction;
  isAnimating: boolean;
  hasAnimated: boolean;
  props: AnimatedElementProps;
  style: React.CSSProperties;
}

function normalizeRootMargin(rootMargin?: RootMargin): string {
  if (typeof rootMargin === "number") return `0px 0px ${rootMargin}px 0px`;
  const trimmed = String(rootMargin ?? "").trim();
  if (/^-?\d+px$/.test(trimmed)) return `0px 0px ${trimmed} 0px`;
  return trimmed || "0px";
}

export function useAnimatedElement<T extends HTMLElement = HTMLElement>({
  ref,
  duration = 600,
  delay = 0,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  threshold = 0.2,
  rootMargin = "0px 0px -50px 0px",
  once = false,
  onStart,
  onComplete,
  onReverse,
}: AnimatedElementOptions<T> = {}): AnimatedElementHook<T> {
  const elementRef = ref ?? (useRef<T | null>(null) as MutableRefObject<T | null>);

  const inView = useVisibility(elementRef, {
    threshold,
    rootMargin: normalizeRootMargin(rootMargin),
    once,
  });
  const shouldShow = typeof window === "undefined" ? true : inView;

  const [direction, setDirection] = useState<Direction>("forward");
  const prevInViewRef = useRef(false);

  useEffect(() => {
    const prev = prevInViewRef.current;
    const entered = inView && !prev;
    const exited = !inView && prev;

    if (entered) {
      setDirection("forward");
      onStart?.();
      onComplete?.();
    }

    if (exited) {
      setDirection("reverse");
      onReverse?.();
    }

    prevInViewRef.current = inView;
  }, [inView, onComplete, onReverse, onStart]);

  const progress = shouldShow ? 100 : 0;
  const progressDecimal = shouldShow ? 1 : 0;

  const style = useMemo<React.CSSProperties>(
    () => ({
      "--animation-duration": `${duration}ms`,
      "--animation-delay": `${delay}ms`,
      "--animation-easing": easing,
      "--animation-progress": `${progress}%`,
      "--animation-progress-decimal": progressDecimal,
      "--animation-direction": direction,
    }),
    [delay, direction, duration, easing, progress, progressDecimal]
  );

  const props = useMemo<AnimatedElementProps>(
    () => ({
      style,
      "data-visible": shouldShow ? "true" : "false",
      "data-animation-direction": direction,
    }),
    [direction, shouldShow, style]
  );

  return {
    ref: elementRef,
    inView: shouldShow,
    progress,
    progressDecimal,
    direction,
    isAnimating: shouldShow,
    hasAnimated: shouldShow,
    props,
    style,
  };
}
