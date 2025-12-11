import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEngagementAutoScroll } from "@/hooks/autoscroll/useEngagementAutoScroll";
import { getImageSrc } from "@/layouts/collections/helpers/layoutHelpers";
import type { PortfolioItemData } from "@/components/LoopComponents/PortfolioItemComponent";

interface PortfolioMediaEntry {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  sources?: { type?: string; srcSet: string; sizes?: string }[];
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async";
  fetchPriority?: "high" | "low" | "auto";
  desktopEager?: boolean;
}

type LoadingStrategy = "static-preview" | "client-only" | "responsive";

interface PortfolioScreenShowcaseProps {
  items?: PortfolioItemData[];
  className?: string;
  mediaEntries?: (PortfolioMediaEntry | undefined)[];
  /** ID of the static placeholder to remove on hydration */
  staticContainerId?: string;
  /** ID of this carousel's container to reveal on hydration */
  carouselContainerId?: string;
  /** Loading strategy - affects when images start loading */
  loadingStrategy?: LoadingStrategy;
}

interface ScreenProps {
  item: PortfolioItemData;
  mediaEntry?: PortfolioMediaEntry;
  totalSlides: number;
  activeIndex: number;
  onCycleComplete: () => void;
  autoplayEnabled?: boolean;
  isActive: boolean;
  shouldUseDesktopEager: boolean;
  /** Called when the image finishes loading (for first slide swap) */
  onImageLoad?: () => void;
  /** Delay rendering the image until this becomes true (prevents double-loading with preview) */
  deferImageRender?: boolean;
}

const AUTO_SCROLL_START_DELAY_MS = 700;
const AUTO_SCROLL_TARGET_DURATION_SEC = 14;
const AUTO_SCROLL_DEFAULT_CYCLE_MS = AUTO_SCROLL_TARGET_DURATION_SEC * 1000;
const AUTO_SCROLL_MIN_SPEED = 28;
const MIN_SCROLL_DELTA = 4;
const CONTENT_STABLE_WINDOW_MS = 220;
const CONTENT_STABLE_DELTA_PX = 16;
const CONTENT_READY_TIMEOUT_MS = 2200;
const BETWEEN_SLIDE_PAUSE_MS = 450;
const SLIDE_TRANSITION_DURATION_MS = 750;

function useDesktopEagerPreference() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      return null;
    }
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      return;
    }
    const matcher = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };
    handleChange(matcher);
    if (typeof matcher.addEventListener === "function") {
      matcher.addEventListener("change", handleChange);
      return () => matcher.removeEventListener("change", handleChange);
    }
    matcher.addListener(handleChange);
    return () => matcher.removeListener(handleChange);
  }, []);

  return isDesktop;
}

function ComputerScreen({
  item,
  mediaEntry,
  totalSlides,
  activeIndex,
  onCycleComplete,
  autoplayEnabled = true,
  isActive,
  shouldUseDesktopEager,
  onImageLoad,
  deferImageRender = false,
}: ScreenProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const hasCalledOnLoadRef = useRef(false);
  const [contentReady, setContentReady] = useState(false);
  const [scrollDurationMs, setScrollDurationMs] = useState(
    AUTO_SCROLL_DEFAULT_CYCLE_MS,
  );
  // Only track scroll progress in dev mode
  const scrollProgressRef = useRef(0);

  const resolveAutoScrollSpeed = useCallback((host: HTMLElement) => {
    const maxScrollable = Math.max(0, host.scrollHeight - host.clientHeight);
    if (maxScrollable <= 0) return 0;
    const baseline = maxScrollable / AUTO_SCROLL_TARGET_DURATION_SEC;
    if (!Number.isFinite(baseline) || baseline <= 0) {
      return AUTO_SCROLL_MIN_SPEED;
    }
    return Math.max(AUTO_SCROLL_MIN_SPEED, baseline);
  }, []);

  const measureScrollDuration = useCallback(
    (host: HTMLElement) => {
      const maxScrollable = Math.max(0, host.scrollHeight - host.clientHeight);
      if (maxScrollable <= 0) return AUTO_SCROLL_DEFAULT_CYCLE_MS;
      const pxPerSecond = resolveAutoScrollSpeed(host);
      if (pxPerSecond <= 0) return AUTO_SCROLL_DEFAULT_CYCLE_MS;
      const rawDurationMs = Math.round((maxScrollable / pxPerSecond) * 1000);
      if (!Number.isFinite(rawDurationMs) || rawDurationMs <= 0) {
        return AUTO_SCROLL_DEFAULT_CYCLE_MS;
      }
      return Math.max(AUTO_SCROLL_DEFAULT_CYCLE_MS, rawDurationMs);
    },
    [resolveAutoScrollSpeed],
  );

  const autoScroll = useEngagementAutoScroll({
    ref: viewportRef,
    active: autoplayEnabled && contentReady,
    speed: resolveAutoScrollSpeed,
    loop: false,
    startDelay: AUTO_SCROLL_START_DELAY_MS,
    resumeDelay: 600,
    resumeOnUserInput: true,
    threshold: 0.05,
    resetOnInactive: false,
  });

  useEffect(() => {
    if (!autoplayEnabled) return;
    autoScroll.resetPosition(0);
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [autoplayEnabled, autoScroll.resetPosition]);
  useEffect(() => {
    // Don't check for image if rendering is deferred - wait until image is actually rendered
    if (deferImageRender) {
      setMediaReady(false);
      return;
    }

    const host = viewportRef.current;
    if (!host) return;

    const imageEl =
      (host.querySelector("picture img") as HTMLImageElement | null) ??
      (host.querySelector("img") as HTMLImageElement | null);

    if (!imageEl) {
      // No image element yet, keep waiting
      setMediaReady(false);
      return;
    }

    if (imageEl.complete && imageEl.naturalHeight > 0) {
      setMediaReady(true);
      return;
    }

    setMediaReady(false);
    const handleReady = () => setMediaReady(true);
    imageEl.addEventListener("load", handleReady, { once: true });
    imageEl.addEventListener("error", handleReady, { once: true });

    return () => {
      imageEl.removeEventListener("load", handleReady);
      imageEl.removeEventListener("error", handleReady);
    };
  }, [item, mediaEntry, deferImageRender]);

  // Notify parent when image loads (for swap from preview to full carousel)
  useEffect(() => {
    if (mediaReady && onImageLoad && !hasCalledOnLoadRef.current) {
      hasCalledOnLoadRef.current = true;
      onImageLoad();
    }
  }, [mediaReady, onImageLoad]);

  useEffect(() => {
    if (!mediaReady) {
      setContentReady(false);
      return;
    }

    const host = viewportRef.current;
    if (!host) return;

    let resolved = false;
    let stabilityCleanup: (() => void) | null = null;

    const hasScrollableContent = () => {
      const max = Math.max(0, host.scrollHeight - host.clientHeight);
      return max > MIN_SCROLL_DELTA;
    };

    const markReady = () => {
      if (resolved) return;
      resolved = true;
      stabilityCleanup?.();
      stabilityCleanup = null;
      setContentReady(true);
    };

    const waitForStableContent = () => {
      if (typeof ResizeObserver === "undefined") {
        markReady();
        return;
      }

      let stabilityTimer: number | null = null;
      let lastHeight = host.scrollHeight;

      const scheduleReady = () => {
        if (stabilityTimer) return;
        stabilityTimer = window.setTimeout(() => {
          stabilityTimer = null;
          markReady();
        }, CONTENT_STABLE_WINDOW_MS);
      };

      const resetReady = () => {
        if (stabilityTimer) {
          window.clearTimeout(stabilityTimer);
          stabilityTimer = null;
        }
      };

      const observer = new ResizeObserver(() => {
        const nextHeight = host.scrollHeight;
        if (Math.abs(nextHeight - lastHeight) > CONTENT_STABLE_DELTA_PX) {
          lastHeight = nextHeight;
          resetReady();
        }
        scheduleReady();
      });

      observer.observe(host);
      scheduleReady();

      stabilityCleanup = () => {
        observer.disconnect();
        if (stabilityTimer) {
          window.clearTimeout(stabilityTimer);
          stabilityTimer = null;
        }
      };
    };

    if (hasScrollableContent()) {
      waitForStableContent();
    } else if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        if (hasScrollableContent()) {
          observer.disconnect();
          waitForStableContent();
        }
      });
      observer.observe(host);
      stabilityCleanup = () => observer.disconnect();
    } else {
      markReady();
    }

    const timeoutId = window.setTimeout(() => {
      markReady();
    }, CONTENT_READY_TIMEOUT_MS);

    return () => {
      stabilityCleanup?.();
      window.clearTimeout(timeoutId);
    };
  }, [mediaReady]);

  useEffect(() => {
    if (!contentReady || !autoplayEnabled) {
      setScrollDurationMs(AUTO_SCROLL_DEFAULT_CYCLE_MS);
      return;
    }

    const host = viewportRef.current;
    if (!host) return;

    const updateDuration = () => setScrollDurationMs(measureScrollDuration(host));
    updateDuration();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateDuration())
        : null;

    observer?.observe(host);

    return () => observer?.disconnect();
  }, [contentReady, measureScrollDuration]);

  useEffect(() => {
    if (!contentReady || !autoplayEnabled || totalSlides <= 1 || autoScroll.paused) return;
    const totalDuration =
      AUTO_SCROLL_START_DELAY_MS + scrollDurationMs + BETWEEN_SLIDE_PAUSE_MS;
    const timer = window.setTimeout(() => onCycleComplete(), totalDuration);
    return () => window.clearTimeout(timer);
  }, [
    autoplayEnabled,
    contentReady,
    onCycleComplete,
    scrollDurationMs,
    totalSlides,
    autoScroll.paused,
  ]);

  // Only track scroll progress in dev mode to avoid continuous RAF in production
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!contentReady || !isActive) {
      scrollProgressRef.current = 0;
      return;
    }

    const host = viewportRef.current;
    if (!host) return;

    const updateProgress = () => {
      const max = Math.max(0, host.scrollHeight - host.clientHeight);
      const pct = max > 0 ? (host.scrollTop / max) * 100 : 0;
      scrollProgressRef.current = Math.round(pct);
    };

    host.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      host.removeEventListener("scroll", updateProgress);
    };
  }, [contentReady, isActive]);

  const fallbackSrc =
    getImageSrc(item.featuredImage) ||
    getImageSrc(item.bannerImage) ||
    getImageSrc(item.image) ||
    "";
  const wantsDesktopEager =
    Boolean(mediaEntry?.desktopEager && shouldUseDesktopEager);
  const resolvedLoading = wantsDesktopEager
    ? "eager"
    : mediaEntry?.loading ?? "lazy";
  // Use the fetchPriority from mediaEntry directly - Astro sets "low" for first slide
  // to ensure full image loads gently behind the preview without affecting LCP
  const resolvedFetchPriority = wantsDesktopEager
    ? "high"
    : mediaEntry?.fetchPriority ?? "low";

  const renderMedia = () => {
    // Don't render image yet if deferred - prevents double-loading with static preview
    if (deferImageRender) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-black/40">
          {/* Placeholder while waiting for preview to be viewed */}
        </div>
      );
    }

    if (mediaEntry?.sources?.length) {
      return (
        <picture>
          {mediaEntry.sources.map((source, idx) => (
            <source
              key={`${item.slug ?? item.id ?? idx}-source-${idx}`}
              srcSet={source.srcSet}
              sizes={source.sizes ?? mediaEntry.sizes}
              type={source.type}
            />
          ))}
          <img
            src={mediaEntry.src}
            srcSet={mediaEntry.srcSet}
            sizes={mediaEntry.sizes}
            alt={mediaEntry.alt || item.alt || item.title || "Project preview"}
            width={mediaEntry.width}
            height={mediaEntry.height}
            loading={resolvedLoading}
            decoding={mediaEntry.decoding ?? "async"}
            fetchPriority={resolvedFetchPriority}
            draggable={false}
            className="block h-auto min-h-full w-full select-none object-cover object-top"
          />
        </picture>
      );
    }
    if (mediaEntry?.src) {
      return (
        <img
          src={mediaEntry.src}
          srcSet={mediaEntry.srcSet}
          sizes={mediaEntry.sizes}
          alt={mediaEntry.alt || item.alt || item.title || "Project preview"}
          width={mediaEntry.width}
          height={mediaEntry.height}
          loading={resolvedLoading}
          decoding={mediaEntry.decoding ?? "async"}
          fetchPriority={resolvedFetchPriority}
          draggable={false}
          className="block h-auto min-h-full w-full select-none object-cover object-top"
        />
      );
    }
    if (!fallbackSrc) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-bg2 via-bg to-bg/80 text-white/30">
          Preview coming soon
        </div>
      );
    }

    return (
      <img
        src={fallbackSrc}
        alt={item.alt || item.title || "Project preview"}
        loading={wantsDesktopEager ? "eager" : "lazy"}
        draggable={false}
        className="block h-auto min-h-full w-full select-none object-cover object-top"
        decoding="async"
        fetchPriority={wantsDesktopEager ? "high" : "auto"}
      />
    );
  };

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full bg-bg3">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-gray-800" />
              <span className="h-3 w-3 rounded-full bg-gray-800" />
              <span className="h-3 w-3 rounded-full bg-gray-800" />
            </span>
          </div>
        </div>
        <figure
          ref={viewportRef}
          className="relative h-full overflow-y-auto overscroll-contain bg-black/40"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {renderMedia()}
        </figure>
        {import.meta.env.DEV && isActive && (
          <div className="absolute right-3 top-3 z-50 space-y-1 rounded-lg border border-white/10 bg-zinc-900/95 p-3 text-xs text-white/90 opacity-80 shadow-lg">
            <div>Slide {activeIndex + 1} / {totalSlides}</div>
            <div>Progress: {scrollProgressRef.current}%</div>
            <div>In View: {autoScroll.inView ? "✅" : "❌"}</div>
            <div>Paused: {autoScroll.paused ? "✅" : "❌"}</div>
            <div>Engaged: {autoScroll.engaged ? "✅" : "❌"}</div>
            <div>Resume Pending: {autoScroll.resumeScheduled ? "✅" : "❌"}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortfolioScreenShowcase({
  items = [],
  className = "",
  mediaEntries: mediaEntriesProp = [],
  staticContainerId,
  loadingStrategy = "static-preview",
}: PortfolioScreenShowcaseProps) {
  const slides = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const mediaEntries = useMemo(
    () => (Array.isArray(mediaEntriesProp) ? mediaEntriesProp : []),
    [mediaEntriesProp],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitionStage, setTransitionStage] = useState<"idle" | "pre" | "animating">("idle");
  const transitionTimerRef = useRef<number | null>(null);
  const transitionFrameRef = useRef<number | null>(null);
  const preferDesktopEager = useDesktopEagerPreference();

  // Determine effective loading behavior:
  // - "client-only": always load client-side immediately
  // - "static-preview": always wait for preview, defer full image
  // - "responsive": desktop uses static-preview behavior, mobile uses client-only
  const isClientOnly = loadingStrategy === "client-only" ||
    (loadingStrategy === "responsive" && preferDesktopEager === false);

  // Track when the first full image has loaded and we can swap from preview
  // For client-only mode, we consider it already loaded (no preview to swap)
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const hasSwappedRef = useRef(false);

  // Defer first image render until preview has had time to display
  // For client-only mode, load immediately (no preview to wait for)
  const [shouldLoadFirstImage, setShouldLoadFirstImage] = useState(false);

  // Sync state when isClientOnly changes (e.g., responsive mode detecting screen size)
  useEffect(() => {
    if (isClientOnly) {
      setFirstImageLoaded(true);
      hasSwappedRef.current = true;
      setShouldLoadFirstImage(true);
    } else {
      setFirstImageLoaded(false);
      hasSwappedRef.current = false;
      setShouldLoadFirstImage(false);
    }
  }, [isClientOnly]);

  // Wait for the page to be fully idle before loading the full carousel image.
  // Only applies to static-preview mode - client-only loads immediately.
  useEffect(() => {
    // Client-only mode: load immediately
    if (isClientOnly) {
      setShouldLoadFirstImage(true);
      return;
    }

    if (!staticContainerId) {
      // No preview to wait for - load immediately
      setShouldLoadFirstImage(true);
      return;
    }

    // Use requestIdleCallback to wait until browser is idle, with a generous timeout
    // This ensures LCP (preview) is fully complete before we start the large full image
    const IDLE_TIMEOUT_MS = 4000; // Max wait before starting anyway
    const MIN_DELAY_MS = 1500; // Minimum delay to ensure preview is painted and LCP measured

    let cancelled = false;

    const startLoading = () => {
      if (!cancelled) {
        setShouldLoadFirstImage(true);
      }
    };

    // Always wait at least MIN_DELAY_MS to ensure preview is painted
    const minDelayTimer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        // Wait for browser idle after minimum delay
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          startLoading,
          { timeout: IDLE_TIMEOUT_MS - MIN_DELAY_MS }
        );
      } else {
        // Fallback for Safari - just use the timeout
        setTimeout(startLoading, 500);
      }
    }, MIN_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(minDelayTimer);
    };
  }, [staticContainerId, isClientOnly]);

  // Callback when first image finishes loading - triggers the swap
  const handleFirstImageLoad = useCallback(() => {
    if (hasSwappedRef.current) return;
    hasSwappedRef.current = true;

    const staticEl = staticContainerId ? document.getElementById(staticContainerId) : null;

    // Use requestAnimationFrame to ensure layout is stable before fade
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Fade out the preview to reveal carousel underneath
        if (staticEl) {
          staticEl.classList.add("opacity-0", "pointer-events-none");
          // Remove from DOM after fade completes
          setTimeout(() => {
            staticEl.style.display = "none";
          }, 500);
        }
        setFirstImageLoaded(true);
      });
    });
  }, [staticContainerId]);

  useEffect(() => {
    if (!slides.length) {
      setActiveIndex(0);
      setPrevIndex(null);
      setTransitionStage("idle");
      return;
    }
    setActiveIndex((prev) => (prev >= slides.length ? 0 : prev));
  }, [slides.length]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      if (transitionFrameRef.current) {
        cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }
    },
    [],
  );

  const startSlideTransition = useCallback(
    (targetIndex: number) => {
      if (typeof window === "undefined") return;
      setPrevIndex(activeIndex);
      setActiveIndex(targetIndex);
      setTransitionStage("pre");

      if (transitionFrameRef.current) {
        cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }

      transitionFrameRef.current = requestAnimationFrame(() => {
        transitionFrameRef.current = requestAnimationFrame(() => {
          setTransitionStage("animating");
        });
      });

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }

      transitionTimerRef.current = window.setTimeout(() => {
        setTransitionStage("idle");
        setPrevIndex(null);
      }, SLIDE_TRANSITION_DURATION_MS);
    },
    [activeIndex],
  );

  const handleCycleComplete = useCallback(() => {
    if (!slides.length || slides.length <= 1) return;
    if (transitionStage !== "idle") return;
    const nextIndex = (activeIndex + 1) % slides.length;
    startSlideTransition(nextIndex);
  }, [activeIndex, slides.length, startSlideTransition, transitionStage]);

  if (!slides.length) return null;

  const baseTransitionClass =
    "absolute inset-0 transition-transform transition-opacity duration-[750ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <div className={`relative h-full ${className}`.trim()}>
      <div className="relative h-full w-full overflow-hidden card-bg rounded-lg">
        {slides.map((item, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          const isPrev = slideIndex === prevIndex;
          const isVisible = isActive || (isPrev && transitionStage !== "idle");

          // Only mount active slide and previous during transition
          const shouldMount = isActive || (isPrev && transitionStage !== "idle");
          if (!shouldMount) return null;

          let translateClass = "translate-x-full";
          if (isPrev && transitionStage !== "idle") {
            translateClass = "-translate-x-full";
          } else if (isActive) {
            if (transitionStage === "idle" || prevIndex === null) {
              translateClass = "translate-x-0";
            } else if (transitionStage === "pre") {
              translateClass = "translate-x-full";
            } else {
              translateClass = "translate-x-0";
            }
          }

          return (
            <div
              key={item.slug ?? item.id ?? slideIndex}
              className={`${baseTransitionClass} shadow-2xl ${translateClass} ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={isActive ? "false" : "true"}
            >
              <ComputerScreen
                item={item}
                mediaEntry={mediaEntries[slideIndex]}
                totalSlides={slides.length || 1}
                activeIndex={slideIndex}
                onCycleComplete={handleCycleComplete}
                autoplayEnabled={isActive && transitionStage === "idle" && firstImageLoaded}
                isActive={isActive}
                shouldUseDesktopEager={preferDesktopEager ?? false}
                onImageLoad={slideIndex === 0 ? handleFirstImageLoad : undefined}
                deferImageRender={slideIndex === 0 && !shouldLoadFirstImage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
