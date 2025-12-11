// src/components/AnimatedBorder/AnimatedBorder.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  useEngagedByTriggers,
  type HoverIntentOptions,
  type TriggerInput,
} from "./useEngagedByTriggers";

export type AnimatedBorderVariant =
  | "none"
  | "solid"
  | "progress"
  | "progress-infinite"
  | "progress-b-f";

export type VisibleRootMargin =
  | number
  | string
  | {
      top?: number | string;
      right?: number | string;
      bottom?: number | string;
      left?: number | string;
    };

export interface AnimatedBorderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  variant?: AnimatedBorderVariant;
  triggers?: TriggerInput;
  active?: boolean;
  controller?: number;
  duration?: number;
  fadeOutMs?: number;
  color?: string;
  borderRadius?: string;
  borderWidth?: number | string;
  innerClassName?: string;
  hoverDelay?: number;
  unhoverIntent?: HoverIntentOptions;
  visibleRootMargin?: VisibleRootMargin;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

const clampPercent = (value: number | string | undefined | null): number => {
  const raw =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? parseFloat(value)
      : NaN;
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, raw));
};

export default function AnimatedBorder({
  children,
  variant = "none",
  triggers = "hover",
  active = false,
  controller,
  duration = 2000,
  fadeOutMs = 220,
  color = "var(--color-accent)",
  borderRadius = "rounded-3xl",
  borderWidth = 2,
  className = "",
  innerClassName = "",
  hoverDelay = 0,
  unhoverIntent,
  visibleRootMargin = 75,
  onMouseEnter,
  onMouseLeave,
  linkProps,
  ...rest
}: AnimatedBorderProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  const { engaged, onEnter, onLeave, isAlways } = useEngagedByTriggers({
    ref: hostRef,
    triggers,
    active,
    hoverDelay,
    unhoverIntent,
    visibleRootMargin,
  });

  const forceAlways = useMemo(() => {
    const list = Array.isArray(triggers) ? triggers : [triggers];
    return list
      .map((trigger) => String(trigger || "").toLowerCase())
      .includes("always");
  }, [triggers]);

  const engagedFinal = engaged || isAlways || forceAlways;

  const controllerValue = useMemo(() => {
    if (controller == null) return null;
    return clampPercent(controller);
  }, [controller]);

  const controllerProvided = Number.isFinite(controllerValue ?? NaN);

  const latestPercentRef = useRef(controllerProvided ? controllerValue || 0 : 0);
  const [fadingOut, setFadingOut] = useState(false);
  const [freezeAt, setFreezeAt] = useState<number | null>(null);
  const prevEngagedRef = useRef(engagedFinal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant !== "progress") {
      prevEngagedRef.current = engagedFinal;
      return;
    }

    const prev = prevEngagedRef.current;
    prevEngagedRef.current = engagedFinal;

    if (engagedFinal && !prev) {
      setFadingOut(false);
      setFreezeAt(null);
      return;
    }

    if (!engagedFinal && prev) {
      setFreezeAt(latestPercentRef.current);
      setFadingOut(true);
      const timeout = window.setTimeout(() => {
        setFadingOut(false);
        setFreezeAt(null);
        latestPercentRef.current = 0;
      }, fadeOutMs);
      return () => window.clearTimeout(timeout);
    }
  }, [variant, engagedFinal, fadeOutMs]);

  useEffect(() => {
    if (variant !== "progress") return;
    if (controllerProvided) {
      if (engagedFinal) {
        latestPercentRef.current = controllerValue ?? 0;
      }
      return;
    }
    if (engagedFinal) {
      latestPercentRef.current = 100;
    }
  }, [variant, engagedFinal, controllerProvided, controllerValue]);

  const resolvedPercent = useMemo(() => {
    if (variant === "progress") {
      if (controllerProvided) {
        return controllerValue ?? 0;
      }
      return engagedFinal && mounted ? 100 : 0;
    }
    if (variant === "progress-b-f") {
      return engagedFinal ? 100 : 0;
    }
    return 0;
  }, [variant, controllerProvided, controllerValue, engagedFinal, mounted]);

  const displayPercent =
    variant === "progress" && !engagedFinal && freezeAt != null
      ? freezeAt
      : resolvedPercent;

  const borderWidthValue =
    typeof borderWidth === "number" ? `${borderWidth}px` : borderWidth;

  const overlayStyle: Record<string, string | number> = {
    "--ab-color": color,
    "--ab-border-width": borderWidthValue,
    "--ab-duration": `${duration}ms`,
    "--ab-fade-duration": `${fadeOutMs}ms`,
  };

  if (variant === "progress" || variant === "progress-b-f") {
    overlayStyle["--ab-progress"] = `${(displayPercent || 0) * 3.6}deg`;
  }

  if (variant === "progress") {
    overlayStyle.opacity = engagedFinal || fadingOut ? 1 : 0;
  } else if (variant === "solid") {
    overlayStyle.opacity = engagedFinal ? 1 : 0;
    overlayStyle.padding = engagedFinal ? borderWidthValue : "0px";
  } else if (variant === "progress-infinite") {
    overlayStyle.opacity = engagedFinal ? 1 : 0;
    overlayStyle.animationPlayState = engagedFinal ? "running" : "paused";
  }

  const overlayClassNames = [
    "absolute",
    "inset-0",
    borderRadius,
    "pointer-events-none",
    "z-20",
    "animated-border-overlay",
  ];

  if (variant === "solid") {
    overlayClassNames.push("is-solid", "transition-all", "duration-800", "ease-in-out");
  } else if (variant === "progress") {
    overlayClassNames.push("progress");
  } else if (variant === "progress-b-f") {
    overlayClassNames.push("progress-b-f");
  } else if (variant === "progress-infinite") {
    overlayClassNames.push("progress-infinite");
  }

  const mountOverlay = variant !== "none";

  const handleEnter = (event: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(event);
    onEnter(event);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    onLeave(event);
  };

  return (
    <div
      ref={hostRef}
      className={`relative ${className}`.trim()}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {mountOverlay && (
        <div className={overlayClassNames.join(" ")} style={overlayStyle} />
      )}

      {linkProps?.href ? (
        <a
          {...linkProps}
          className={`relative z-10 overflow-hidden ${borderRadius} ${innerClassName} ${linkProps.className ?? ""}`.trim()}
        >
          {children}
        </a>
      ) : (
        <div
          className={`relative z-10 overflow-hidden ${borderRadius} ${innerClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
