// src/components/LoopComponents/PortfolioItemComponent.tsx
import {
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEngagementAutoScroll } from "@/hooks/autoscroll/useEngagementAutoScroll";
import { getImageSrc } from "@/layouts/collections/helpers/layoutHelpers";

export interface PortfolioImageSources {
  center?: string;
  side?: string;
  mobile?: string;
}

export interface PortfolioItemData {
  id?: string | number;
  slug?: string;
  title?: string;
  alt?: string;
  client?: string;
  featuredImage?: any;
  bannerImage?: any;
  image?: string;
  imageSources?: PortfolioImageSources;
  dimensions?: {
    aspectRatio?: number;
  };
}

interface PortfolioItemComponentProps {
  item: PortfolioItemData;
  i: number;
  activeIndex: number;
  itemsLength: number;
  centerW: number;
  centerH: number;
  sideW: number;
  sideH: number;
  tx: number;
  onSelect: (index: number) => void;
  mediaChild?: ReactNode;
}

const AUTO_SCROLL_START_DELAY_MS = 1500;
const AUTO_SCROLL_TARGET_DURATION_SEC = 30;
const AUTO_SCROLL_DEFAULT_CYCLE_MS = AUTO_SCROLL_TARGET_DURATION_SEC * 1000;
const AUTO_SCROLL_MAX_DURATION_MS = AUTO_SCROLL_DEFAULT_CYCLE_MS * 4;
const AUTO_SCROLL_MIN_SPEED = 18;
const AUTO_SCROLL_MAX_SPEED = 60;
const AUTO_SCROLL_READY_TIMEOUT_MS = 3000;
const MIN_SCROLL_DELTA = 6;
const CONTENT_STABLE_WINDOW_MS = 260;
const CONTENT_STABLE_DELTA_PX = 18;

export default function PortfolioItemComponent({
  item,
  i,
  activeIndex,
  itemsLength,
  centerW,
  centerH,
  sideW,
  sideH,
  tx,
  onSelect,
  mediaChild,
}: PortfolioItemComponentProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const diff = i - activeIndex;
  const [contentReady, setContentReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [scrollDurationMs, setScrollDurationMs] = useState(
    AUTO_SCROLL_DEFAULT_CYCLE_MS
  );

  const position = useMemo(() => {
    if (diff === 0) return "center";
    if (diff === -1 || diff === itemsLength - 1) return "left";
    if (diff === 1 || diff === -(itemsLength - 1)) return "right";
    return "hidden";
  }, [diff, itemsLength]);

  const isActive = position === "center";
  const translateBase = isActive ? "translate(-50%, 0)" : "translate(-50%, -50%)";

  const resolveAutoScrollSpeed = useCallback((host: HTMLElement) => {
    const maxScrollable = Math.max(0, host.scrollHeight - host.clientHeight);
    if (maxScrollable <= 0) return 0;
    const baseline = maxScrollable / AUTO_SCROLL_TARGET_DURATION_SEC;
    if (!Number.isFinite(baseline) || baseline <= 0) {
      return AUTO_SCROLL_MIN_SPEED;
    }
    return Math.min(
      AUTO_SCROLL_MAX_SPEED,
      Math.max(AUTO_SCROLL_MIN_SPEED, baseline)
    );
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
      return Math.min(
        AUTO_SCROLL_MAX_DURATION_MS,
        Math.max(AUTO_SCROLL_DEFAULT_CYCLE_MS, rawDurationMs)
      );
    },
    [resolveAutoScrollSpeed]
  );

  const autoScroll = useEngagementAutoScroll({
    ref: viewportRef,
    active: isActive && contentReady,
    speed: resolveAutoScrollSpeed,
    loop: false,
    startDelay: AUTO_SCROLL_START_DELAY_MS,
    resumeDelay: 900,
    resumeOnUserInput: true,
    threshold: 0.1,
    resetOnInactive: true,
  });

  const [progressPct, setProgressPct] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let raf: number | null = null;
    const tick = () => {
      const el = viewportRef.current;
      if (el) {
        const max = Math.max(0, el.scrollHeight - el.clientHeight);
        const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
        setProgressPct(Math.round(pct));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !mediaReady) {
      setContentReady(false);
      setScrollDurationMs(AUTO_SCROLL_DEFAULT_CYCLE_MS);
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

    let contentObserver: ResizeObserver | null = null;

    if (hasScrollableContent()) {
      waitForStableContent();
    } else if (typeof ResizeObserver !== "undefined") {
      contentObserver = new ResizeObserver(() => {
        if (hasScrollableContent()) {
          contentObserver?.disconnect();
          contentObserver = null;
          waitForStableContent();
        }
      });
      contentObserver.observe(host);
    } else {
      markReady();
    }

    const timeoutId = window.setTimeout(() => {
      markReady();
    }, AUTO_SCROLL_READY_TIMEOUT_MS);

    return () => {
      contentObserver?.disconnect();
      stabilityCleanup?.();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isActive, mediaReady]);

  useEffect(() => {
    if (!isActive || !contentReady) {
      setScrollDurationMs(AUTO_SCROLL_DEFAULT_CYCLE_MS);
      return;
    }
    const host = viewportRef.current;
    if (!host) return;

    const updateDuration = () => {
      setScrollDurationMs(measureScrollDuration(host));
    };

    updateDuration();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateDuration())
        : null;

    observer?.observe(host);

    return () => observer?.disconnect();
  }, [isActive, contentReady, measureScrollDuration]);

  useEffect(() => {
    if (!isActive || !contentReady || typeof window === "undefined") return;
    const host = viewportRef.current;
    if (!host) return;

    const dispatch = (phase: "start" | "end") => {
      host.dispatchEvent(
        new CustomEvent("autoscroll-user", {
          bubbles: true,
          detail: { phase },
        })
      );
    };

    const startTimer = window.setTimeout(() => {
      dispatch("start");
    }, AUTO_SCROLL_START_DELAY_MS);

    const stopTimer = window.setTimeout(() => {
      dispatch("end");
    }, AUTO_SCROLL_START_DELAY_MS + scrollDurationMs);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
      dispatch("end");
    };
  }, [isActive, contentReady, scrollDurationMs]);

  const slideBase =
    "absolute left-1/2 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform bg-gray-900";

  let style: React.CSSProperties = {
    width: `${sideW}px`,
    height: `${sideH}px`,
    transform: `${translateBase} scale(0)`,
    zIndex: 10,
    opacity: 0,
    pointerEvents: "none",
  };

  if (isActive) {
    style = {
      width: `${centerW}px`,
      height: `${centerH}px`,
      transform: `${translateBase} scale(1) rotateY(0deg)`,
      zIndex: 30,
      opacity: 1,
    };
  } else if (position === "left") {
    style = {
      width: `${sideW}px`,
      height: `${sideH}px`,
      transform: `${translateBase} translateX(-${tx}px) scale(0.9) rotateY(22deg)`,
      zIndex: 20,
      opacity: 0.4,
    };
  } else if (position === "right") {
    style = {
      width: `${sideW}px`,
      height: `${sideH}px`,
      transform: `${translateBase} translateX(${tx}px) scale(0.9) rotateY(-22deg)`,
      zIndex: 20,
      opacity: 0.4,
    };
  }

  const viewportClassesActive =
    "w-full h-full bg-gray-900 overflow-y-auto overscroll-auto touch-pan-y m-0 p-0 relative";
  const viewportClassesInactive =
    "w-full h-full bg-gray-900 overflow-hidden pointer-events-none select-none m-0 p-0 relative";

  const viewportInlineStyle = isActive
    ? ({ WebkitOverflowScrolling: "touch", overscrollBehaviorY: "auto" } satisfies React.CSSProperties)
    : undefined;

  const getImageSrcForPosition = () => {
    const fallback =
      getImageSrc(item.featuredImage) ||
      getImageSrc(item.bannerImage) ||
      getImageSrc(item.image) ||
      "";

    if (item.imageSources) {
      if (isActive && item.imageSources.center) return item.imageSources.center;
      if ((position === "left" || position === "right") && item.imageSources.side)
        return item.imageSources.side;
      if (item.imageSources.mobile) return item.imageSources.mobile;
    }

    return fallback;
  };

  const getImageStyle = () => {
    if (item.dimensions?.aspectRatio && centerH > 0) {
      return {
        objectFit: "cover",
        objectPosition: "center top",
      } as React.CSSProperties;
    }
    return {
      objectFit: "cover",
      objectPosition: "center top",
    } as React.CSSProperties;
  };

  const imageSrc = getImageSrcForPosition();
  const altText = item.alt || item.title || "Project preview";
  const providedMedia = useMemo(() => {
    if (!mediaChild) return undefined;
    if (!isValidElement(mediaChild)) return mediaChild;
    const props = mediaChild.props as {
      ["data-portfolio-placeholder"]?: unknown;
    };
    if (props?.["data-portfolio-placeholder"]) return undefined;
    return mediaChild;
  }, [mediaChild]);

  useEffect(() => {
    if (!isActive) {
      setMediaReady(false);
      return;
    }
    const host = viewportRef.current;
    if (!host) return;

    const imageEl =
      (host.querySelector("picture img") as HTMLImageElement | null) ??
      (host.querySelector("img") as HTMLImageElement | null);

    if (!imageEl) {
      setMediaReady(true);
      return;
    }

    const markReady = () => setMediaReady(true);

    if (imageEl.complete && imageEl.naturalHeight > 0) {
      setMediaReady(true);
      return;
    }

    setMediaReady(false);
    imageEl.addEventListener("load", markReady, { once: false });
    imageEl.addEventListener("error", markReady, { once: false });

    return () => {
      imageEl.removeEventListener("load", markReady);
      imageEl.removeEventListener("error", markReady);
    };
  }, [isActive, providedMedia, imageSrc]);

  return (
    <div
      className={`${slideBase} ${isActive ? "top-0" : "top-1/2"}`}
      style={style}
      data-carousel-item
      data-index={i}
      data-active={isActive ? "true" : "false"}
      onClick={() => {
        if (!isActive) onSelect(i);
      }}
    >
      <figure
        ref={viewportRef}
        className={isActive ? viewportClassesActive : viewportClassesInactive}
        style={viewportInlineStyle}
        aria-hidden={isActive ? "false" : "true"}
        tabIndex={isActive ? 0 : -1}
      >
        {providedMedia ? (
          providedMedia
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
            className="block w-full h-auto min-h-full select-none"
            style={getImageStyle()}
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full bg-gradient-to-b from-bg2 via-bg to-bg/80" />
        )}
      </figure>

      {import.meta.env.DEV && isActive && (
        <div className="absolute right-3 top-3 text-xs opacity-75 bg-zinc-800/95 p-3 rounded-lg shadow-lg border border-white/10 z-50 space-y-1">
          <div>👁️ In View: {autoScroll.inView ? "✅" : "❌"}</div>
          <div>⏸️ Paused: {autoScroll.paused ? "✅" : "❌"}</div>
          <div>👤 Engaged: {autoScroll.engaged ? "✅" : "❌"}</div>
          <div>⏲️ Resume Scheduled: {autoScroll.resumeScheduled ? "✅" : "❌"}</div>
          <div>🎪 Active Index: {activeIndex}</div>
          <div>📊 Progress: {progressPct}%</div>
        </div>
      )}
    </div>
  );
}
