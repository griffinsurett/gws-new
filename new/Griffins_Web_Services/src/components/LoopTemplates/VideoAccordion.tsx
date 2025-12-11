// src/components/LoopTemplates/VideoAccordion.tsx
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import EnhancedAccordionItem from "@/components/LoopComponents/EnhancedAccordionItem";
import VideoPlayer from "@/components/VideoPlayer";
import Button from "@/components/Button/Button";
import { useVisibility } from "@/hooks/animations/useVisibility";
import useEngagementAutoplay from "@/hooks/autoplay/useEngagementAutoplay";
import { animationProps } from "@/utils/animationProps";
export interface VideoAccordionItem {
  key?: string;
  title: string;
  description?: string;
  icon?: string;
  videoSrc?: string;
  contentSlotId?: string;
  slug?: string;
  hasPage?: boolean;
  url?: string;
}

interface VideoAccordionProps {
  items: VideoAccordionItem[];
  className?: string;
  autoAdvanceDelay?: number;
}

const sanitizeId = (value: string) => value.replace(/[:]/g, "");

export default function VideoAccordion({
  items,
  className = "",
  autoAdvanceDelay = 3000,
}: VideoAccordionProps) {
  const showDebug =
    (typeof import.meta !== "undefined" && import.meta.env?.DEV) ||
    process.env.NODE_ENV !== "production";

  const safeItems = Array.isArray(items)
    ? items.filter(
        (entry): entry is VideoAccordionItem =>
          !!entry && typeof entry === "object" && !!entry.title,
      )
    : [];

  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawId = useId();
  const instanceId = useMemo(() => sanitizeId(rawId), [rawId]);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inView = useVisibility(wrapRef, {
    threshold: 0,
    rootMargin: "0px 0px -20% 0px",
  });

  const autoplayTime = useCallback(() => {
    const desktop = desktopVideoRef.current;
    const mobile = mobileVideoRef.current;
    // Get the video that's actually playing
    let video = null;
    if (desktop && !desktop.paused && desktop.currentTime > 0) video = desktop;
    else if (mobile && !mobile.paused && mobile.currentTime > 0) video = mobile;
    else if (desktop && desktop.offsetParent !== null) video = desktop;
    else if (mobile && mobile.offsetParent !== null) video = mobile;
    else video = desktop || mobile;

    if (!video || !Number.isFinite(video.duration)) return autoAdvanceDelay;
    const remaining = Math.max(0, (video.duration - video.currentTime) * 1000);
    return remaining + autoAdvanceDelay;
  }, [autoAdvanceDelay]);

  const {
    engageUser,
    beginGraceWindow,
    isAutoplayPaused,
    isResumeScheduled,
    userEngaged,
    schedule,
  } = useEngagementAutoplay({
    totalItems: safeItems.length,
    currentIndex: activeIndex,
    setIndex: (next) => setActiveIndex(next),
    autoplayTime,
    resumeDelay: 5000,
    containerSelector: `[data-video-accordion="${instanceId}"]`,
    itemSelector: `[data-video-accordion="${instanceId}"] [data-accordion-item]`,
    inView,
    engageOnlyOnActiveItem: true,
    activeItemAttr: "data-active",
  });

  const scheduleRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    scheduleRef.current = schedule;
  }, [schedule]);

  useEffect(() => {
    if (safeItems.length === 0) return;
    if (activeIndex >= safeItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, safeItems.length]);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setProgress(0);
      engageUser();
      scheduleRef.current?.();
    },
    [engageUser],
  );

  const getActiveVideo = useCallback(() => {
    const desktop = desktopVideoRef.current;
    const mobile = mobileVideoRef.current;
    // Prefer the video that's actually playing (not paused and has time)
    if (desktop && !desktop.paused && desktop.currentTime > 0) return desktop;
    if (mobile && !mobile.paused && mobile.currentTime > 0) return mobile;
    // Fallback to whichever exists and is visible
    if (desktop && desktop.offsetParent !== null) return desktop;
    if (mobile && mobile.offsetParent !== null) return mobile;
    return desktop || mobile;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = getActiveVideo();
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
    scheduleRef.current?.();
  }, [getActiveVideo]);

  const handleLoadedData = useCallback(() => {
    setProgress(0);
    scheduleRef.current?.();
  }, []);

  const handleEnded = useCallback(() => {
    setProgress(100);
    beginGraceWindow();
  }, [beginGraceWindow]);

  const handleVideoClick = useCallback(() => {
    engageUser();
  }, [engageUser]);

  if (safeItems.length === 0) {
    return null;
  }

  const activeItem = safeItems[Math.min(activeIndex, safeItems.length - 1)];

  return (
    <div
      ref={wrapRef}
      {...animationProps("fade-in", { once: true })}
      className={`relative ${className}`.trim()}
      data-video-accordion={instanceId}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-12 max-2-primary">
        <div
          className="min-w-0 lg:w-1/2 lg:shrink-0 flex flex-col space-y-4"
          data-accordion-container
        >
          {safeItems.map((item, index) => {
            const key = item.key || item.title || `item-${index}`;

            return (
              <EnhancedAccordionItem
                key={key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                isActive={activeIndex === index}
                progress={progress}
                onToggle={() => handleSelect(index)}
              >
                {activeIndex === index && (
                  <div className="lg:hidden mt-4">
                    <VideoPlayer
                      key={`mobile-${key}`}
                      ref={(node) => {
                        mobileVideoRef.current = node;
                      }}
                      src={item.videoSrc}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleEnded}
                      onLoadedData={handleLoadedData}
                      onClick={handleVideoClick}
                      desktop={false}
                    />
                  </div>
                )}
                {item.hasPage && item.url && (
                  <div className="mt-4">
                    <Button
                      variant="link"
                      href={item.url}
                      rightIcon="lu:arrow-right"
                    >
                      Explore {item.title}
                    </Button>
                  </div>
                )}
              </EnhancedAccordionItem>
            );
          })}
        </div>

        <div className="hidden lg:block lg:w-1/2 min-w-0 sticky-section">
          <VideoPlayer
            key={`desktop-${activeItem?.key ?? activeIndex}`}
            ref={desktopVideoRef}
            src={activeItem?.videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedData={handleLoadedData}
            onClick={handleVideoClick}
            desktop
            wrapperClassName="shadow-2xl shadow-accent/15 bg-card/40"
          />

          {showDebug && (
            <div className="mt-4 text-xs text-white/80 bg-zinc-900/70 p-3 rounded-xl space-y-1">
              <div>⏸️ Autoplay Paused: {isAutoplayPaused ? "✅" : "❌"}</div>
              <div>👤 Engaged: {userEngaged ? "✅" : "❌"}</div>
              <div>
                ⏲️ Resume Scheduled: {isResumeScheduled ? "✅" : "❌"}
              </div>
              <div>🎪 Active Index: {activeIndex}</div>
              <div>📊 Progress: {Math.round(progress)}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
