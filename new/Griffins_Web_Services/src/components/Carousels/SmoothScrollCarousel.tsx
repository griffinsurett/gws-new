// src/components/Carousels/SmoothScrollCarousel.tsx
import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useVisibility } from "@/hooks/animations/useVisibility";
import useEngagementAutoplay from "@/hooks/autoplay/useEngagementAutoplay";

export interface SmoothScrollCarouselHandle {
  container: HTMLDivElement | null;
  track: HTMLDivElement | null;
  getCurrentOffset: () => number;
  setOffset: (value: number) => void;
}

interface SmoothScrollCarouselProps {
  items?: any[];
  renderItem?: (
    item: any,
    index: number,
    ctx: { isActive: boolean; onInteraction: (type: string) => void },
  ) => ReactNode;
  children?: ReactNode;
  speed?: number;
  duplicateCount?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  pauseOnEngage?: boolean;
  startDelay?: number;
  gap?: number;
  itemWidth?: number;
  gradientMask?: boolean;
  gradientWidth?: { base: number; md: number };
  threshold?: number;
  onItemInteraction?: (payload: any, index: number, type: string) => void;
  resumeDelay?: number;
  resumeTriggers?: string[];
  containerSelector?: string;
  itemSelector?: string;
  className?: string;
  trackClassName?: string;
}

const SmoothScrollCarousel = forwardRef<
  SmoothScrollCarouselHandle,
  SmoothScrollCarouselProps
>(function SmoothScrollCarousel(
  {
    items = [],
    renderItem = () => null,
    children,
    speed = 30,
    duplicateCount = 3,
    autoplay = true,
    pauseOnHover = true,
    pauseOnEngage = true,
    startDelay = 2500,
    gap = 24,
    itemWidth = 120,
    gradientMask = true,
    gradientWidth = { base: 48, md: 80 },
    threshold = 0.3,
    onItemInteraction,
    resumeDelay = 500,
    resumeTriggers = ["scroll", "click-outside", "hover-away"],
    containerSelector,
    itemSelector,
    className = "",
    trackClassName = "",
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  const scopeId = useMemo(
    () => `smooth-carousel-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    track: trackRef.current,
    getCurrentOffset: () => currentOffset,
    setOffset: setCurrentOffset,
  }));

  const inView = useVisibility(containerRef, { threshold });

  const childrenArray = useMemo(
    () => Children.toArray(children).filter(Boolean),
    [children],
  );
  const usingChildren = childrenArray.length > 0;
  const baseLength = usingChildren ? childrenArray.length : items.length;

  const duplicated = useMemo(() => {
    if (usingChildren) {
      return Array.from({ length: duplicateCount }, (_, dupIdx) =>
        childrenArray.map((node, idx) => ({
          type: "child" as const,
          node,
          originalIndex: idx,
          duplicateIndex: dupIdx,
        })),
      ).flat();
    }
    return Array.from({ length: duplicateCount }, (_, dupIdx) =>
      items.map((item, idx) => ({
        type: "item" as const,
        item,
        originalIndex: idx,
        duplicateIndex: dupIdx,
      })),
    ).flat();
  }, [childrenArray, duplicateCount, items, usingChildren]);

  const totalWidth = baseLength * itemWidth;

  const {
    engageUser,
    isAutoplayPaused,
    userEngaged,
    isResumeScheduled,
    pause,
    resume,
  } =
    useEngagementAutoplay({
      totalItems: Math.max(baseLength, 1),
      currentIndex:
        baseLength > 0
          ? Math.floor(Math.abs(currentOffset) / itemWidth) % baseLength
          : 0,
      setIndex: () => {},
      autoplayTime: 50,
      resumeDelay,
      resumeTriggers,
      containerSelector:
        containerSelector || `[data-autoplay-scope="${scopeId}"]`,
      itemSelector:
        itemSelector ||
        `[data-autoplay-scope="${scopeId}"] [data-smooth-item]`,
      inView: autoplay && inView,
      pauseOnEngage,
      engageOnlyOnActiveItem: false,
      activeItemAttr: "data-active",
    });

  const [canAnimate, setCanAnimate] = useState(false);
  useEffect(() => {
    const eligible = autoplay && inView && !isAutoplayPaused;
    if (!eligible) {
      setCanAnimate(false);
      return;
    }
    const timer = window.setTimeout(() => setCanAnimate(true), startDelay);
    return () => window.clearTimeout(timer);
  }, [autoplay, inView, isAutoplayPaused, startDelay]);

  useEffect(() => {
    if (!canAnimate) return;
    let animationId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setCurrentOffset((prev) => {
        if (totalWidth <= 0) return prev;
        let next = prev - speed * dt;
        if (Math.abs(next) >= totalWidth) {
          next += totalWidth;
        }
        return next;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [canAnimate, speed, totalWidth]);

  const hoverResumeTimerRef = useRef<number | null>(null);

  const clearHoverResume = useCallback(() => {
    if (hoverResumeTimerRef.current) {
      window.clearTimeout(hoverResumeTimerRef.current);
      hoverResumeTimerRef.current = null;
    }
  }, []);

  const scheduleHoverResume = useCallback(() => {
    clearHoverResume();
    hoverResumeTimerRef.current = window.setTimeout(() => {
      resume();
      hoverResumeTimerRef.current = null;
    }, resumeDelay);
  }, [clearHoverResume, resume, resumeDelay]);

  const handleItemInteraction = (payload: any, index: number, type: string) => {
    if (pauseOnEngage) {
      engageUser();
      pause();
    }
    onItemInteraction?.(payload, index, type);
  };

  const handleMouseEnterContainer = () => {
    if (!pauseOnHover) return;
    engageUser();
    pause();
  };

  const handleMouseLeaveContainer = () => {
    if (!pauseOnHover) return;
    scheduleHoverResume();
  };

  useEffect(() => () => clearHoverResume(), [clearHoverResume]);

  const [gradientPx, setGradientPx] = useState(() =>
    typeof window === "undefined"
      ? gradientWidth.base
      : window.innerWidth >= 768
        ? gradientWidth.md
        : gradientWidth.base,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const listener = () => {
      setGradientPx(
        window.innerWidth >= 768 ? gradientWidth.md : gradientWidth.base,
      );
    };
    window.addEventListener("resize", listener, { passive: true });
    return () => window.removeEventListener("resize", listener);
  }, [gradientWidth.base, gradientWidth.md]);

  return (
    <div
      ref={containerRef}
      data-autoplay-scope={scopeId}
      className={`relative w-full overflow-hidden ${className}`.trim()}
      data-smooth-carousel
      onMouseEnter={handleMouseEnterContainer}
      onMouseLeave={handleMouseLeaveContainer}
    >
      {gradientMask && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none"
            style={{ width: `${gradientPx}px` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none"
            style={{ width: `${gradientPx}px` }}
          />
        </>
      )}

      <div className="overflow-hidden" style={{ paddingInline: `${gradientPx}px` }}>
        <div
          ref={trackRef}
          className={`flex items-center ${trackClassName}`.trim()}
          style={{
            transform: `translateX(${currentOffset}px)`,
            width: "max-content",
            gap: `${gap}px`,
          }}
        >
          {duplicated.map((entry, index) => (
            <div
              key={`${entry.originalIndex}-${entry.duplicateIndex}-${index}`}
              data-smooth-item
              className="flex-shrink-0"
              onMouseEnter={() => handleItemInteraction(entry, index, "hover")}
            >
              {entry.type === "child"
                ? entry.node
                : renderItem(entry.item, index, {
                    isActive: false,
                    onInteraction: (type: string) =>
                      handleItemInteraction(entry.item, index, type),
                  })}
            </div>
          ))}
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-2 text-xs bg-bg/60 text-text px-3 py-2 rounded pointer-events-none z-50 space-y-1">
          <div>🎠 Autoplay: {autoplay ? "ON" : "OFF"}</div>
          <div>👁️ In View: {inView ? "YES" : "NO"}</div>
          <div>⏸️ Paused: {isAutoplayPaused ? "YES" : "NO"}</div>
          <div>👤 Engaged: {userEngaged ? "YES" : "NO"}</div>
          <div>⏲️ Resume Scheduled: {isResumeScheduled ? "YES" : "NO"}</div>
        </div>
      )}
    </div>
  );
});

export default SmoothScrollCarousel;
