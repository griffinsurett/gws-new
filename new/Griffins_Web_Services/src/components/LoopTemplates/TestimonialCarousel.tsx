// src/components/LoopTemplates/TestimonialCarousel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import TestimonialCard, {
  type TestimonialItemData,
} from "@/components/LoopComponents/TestimonialCard";
import { LeftArrow, RightArrow } from "@/components/Carousels/CarouselArrows";
import useCarouselAutoplay from "@/components/Carousels/useCarouselAutoplay";
import { useSideDragNavigation } from "@/hooks/interactions/useSideDragNavigation";
import { staggeredAnimationProps } from "@/utils/animationProps";

type SlidesPerViewConfig = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
};

interface TestimonialCarouselProps {
  items?: TestimonialItemData[];
  slidesPerView?: SlidesPerViewConfig;
  gap?: number;
  autoplay?: boolean;
  autoAdvanceDelay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  drag?: boolean;
  className?: string;
}

export default function TestimonialCarousel({
  items = [],
  slidesPerView = { base: 1, md: 2 },
  gap = 32,
  autoplay = true,
  autoAdvanceDelay = 4500,
  showArrows = false,
  showDots = true,
  drag = false,
  className = "",
}: TestimonialCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftZoneRef = useRef<HTMLDivElement | null>(null);
  const rightZoneRef = useRef<HTMLDivElement | null>(null);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  const slidesPerViewValue = useMemo(() => {
    const breakpoints = [
      { key: "base", min: 0 },
      { key: "sm", min: 640 },
      { key: "md", min: 768 },
      { key: "lg", min: 1024 },
      { key: "xl", min: 1280 },
      { key: "2xl", min: 1536 },
    ] as const;

    let current = slidesPerView.base ?? 1;
    for (const { key, min } of breakpoints) {
      if (viewportWidth >= min && slidesPerView[key] != null) {
        current = slidesPerView[key] as number;
      }
    }
    return Math.max(1, Number(current) || 1);
  }, [slidesPerView, viewportWidth]);

  const pages = useMemo(() => {
    const result: TestimonialItemData[][] = [];
    for (let i = 0; i < items.length; i += slidesPerViewValue) {
      result.push(items.slice(i, i + slidesPerViewValue));
    }
    return result.length ? result : [[]];
  }, [items, slidesPerViewValue]);

  const pageCount = pages.length;
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pageIndex >= pageCount) {
      setPageIndex(pageCount - 1);
    }
  }, [pageCount, pageIndex]);

  useCarouselAutoplay({
    containerRef,
    totalItems: pageCount,
    currentIndex: pageIndex,
    setIndex: setPageIndex,
    autoplay,
    autoplayTime: autoAdvanceDelay,
    threshold: 0.3,
    resumeDelay: 5000,
    resumeTriggers: ["scroll", "click-outside", "hover-away"],
    pauseOnEngage: true,
    engageOnlyOnActiveItem: true,
    activeItemAttr: "data-active",
  });

  const goPrev = () =>
    setPageIndex((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  const goNext = () =>
    setPageIndex((prev) => (prev === pageCount - 1 ? 0 : prev + 1));

  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (pageCount <= 1) return;
    setTransitioning(true);
    const timer = setTimeout(() => setTransitioning(false), 550);
    return () => clearTimeout(timer);
  }, [pageIndex, pageCount]);

  useSideDragNavigation({
    enabled: drag && pageCount > 1,
    leftElRef: leftZoneRef,
    rightElRef: rightZoneRef,
    onLeft: goPrev,
    onRight: goNext,
    dragThreshold: Math.max(40, Math.round(viewportWidth * 0.05)),
    tapThreshold: 12,
  });

  const STAGGER_MS = 120;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <div
        className={`relative grid items-center gap-x-4 md:gap-x-6 ${
          showArrows && pageCount > 1 ? "grid-cols-[auto_1fr_auto]" : "grid-cols-1"
        }`}
      >
        {showArrows && pageCount > 1 && (
          <div className="flex items-center justify-center">
            <LeftArrow onClick={goPrev} variant="inline" />
          </div>
        )}

        <div className="relative overflow-hidden">
          <div
            className="relative z-20 flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${pageCount * 100}%`,
              transform: `translateX(-${(pageIndex * 100) / pageCount}%)`,
            }}
          >
            {pages.map((page, pageIdx) => (
              <div
                key={`page-${pageIdx}`}
                data-carousel-item
                data-active={pageIdx === pageIndex ? "true" : "false"}
                className="shrink-0"
                style={{ width: `${100 / pageCount}%` }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${slidesPerViewValue}, minmax(0, 1fr))`,
                    gap,
                  }}
                >
                  {page.map((testimonial, itemIdx) => (
                    <div
                      key={`testimonial-${pageIdx}-${itemIdx}`}
                      className="min-w-0"
                      {...staggeredAnimationProps("scale-in", pageIdx * slidesPerViewValue + itemIdx, {
                        once: true,
                        staggerDelay: STAGGER_MS,
                      })}
                    >
                      <TestimonialCard item={testimonial} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {transitioning && (
            <div className="absolute inset-0 z-30 pointer-events-auto" aria-hidden="true" />
          )}

          {drag && pageCount > 1 && (
            <>
              <div
                ref={leftZoneRef}
                className="absolute top-0 left-0 h-full z-40 cursor-grab touch-pan-x select-none"
                style={{ width: "50%" }}
                aria-hidden="true"
              />
              <div
                ref={rightZoneRef}
                className="absolute top-0 right-0 h-full z-40 cursor-grab touch-pan-x select-none"
                style={{ width: "50%" }}
                aria-hidden="true"
              />
            </>
          )}
        </div>

        {showArrows && pageCount > 1 && (
          <div className="flex items-center justify-center">
            <RightArrow onClick={goNext} variant="inline" />
          </div>
        )}
      </div>

      {showDots && pageCount > 1 && (
        <nav className="mt-6 flex justify-center gap-3" aria-label="Carousel Pagination">
          {Array.from({ length: pageCount }).map((_, dotIdx) => (
            <button
              key={`dot-${dotIdx}`}
              type="button"
              onClick={() => setPageIndex(dotIdx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                dotIdx === pageIndex ? "bg-primary scale-[1.30]" : "faded-bg"
              }`}
              aria-label={`Go to page ${dotIdx + 1}`}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
