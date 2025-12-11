// src/components/Video/Video.tsx
/**
 * React Video - Client-side video with lazy loading.
 * Use with Video.astro wrapper for build-time poster generation.
 */
import { useEffect, useRef, useId, useState, useCallback } from "react";

export interface VideoProps {
  src: string;
  poster: string;
  placeholderSrc?: string;
  alt?: string;
  className?: string;
  aspectClass?: string;
  videoClass?: string;
  showPlayButton?: boolean;
  lazy?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export default function Video({
  src,
  poster,
  placeholderSrc,
  alt = "Video preview",
  className = "",
  aspectClass = "aspect-video",
  videoClass = "",
  showPlayButton = true,
  lazy = true,
  muted = true,
  autoplay = false,
  controls = true,
  loop = false,
  playsInline = true,
}: VideoProps) {
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.dataset.loaded === "true") return;

    video.src = src;
    video.load();
    video.dataset.loaded = "true";

    if (autoplay) {
      video.play().catch(() => {});
    }
  }, [src, autoplay]);

  const handlePlay = useCallback(() => {
    loadVideo();
    videoRef.current?.play().catch(() => {});
  }, [loadVideo]);

  // Lazy load when visible
  useEffect(() => {
    if (!lazy) {
      loadVideo();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          loadVideo();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [lazy, loadVideo]);

  // Track video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => setIsLoaded(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <figure
      id={id}
      ref={rootRef}
      className={`video-component relative w-full ${className}`.trim()}
      data-video-loaded={isLoaded}
      data-video-playing={isPlaying}
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-bg2/40 border border-white/5 ${aspectClass}`}
      >
        {/* Poster overlay */}
        <div
          className={`poster absolute inset-0 z-10 grid place-items-center bg-cover bg-center transition-all duration-350 ${
            isLoaded ? "opacity-0 invisible pointer-events-none" : ""
          }`}
          style={placeholderSrc ? { backgroundImage: `url(${placeholderSrc})` } : undefined}
        >
          <img
            src={poster}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          {showPlayButton && (
            <button
              type="button"
              onClick={handlePlay}
              className="play-btn absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-4 bg-black/55 backdrop-blur-sm cursor-pointer hover:scale-105 hover:bg-black/70 transition-transform"
              aria-label="Play video"
            >
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white drop-shadow-lg">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${videoClass}`.trim()}
          muted={muted}
          autoPlay={autoplay}
          controls={controls}
          loop={loop}
          playsInline={playsInline}
          poster={poster}
          preload={lazy ? "metadata" : undefined}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </figure>
  );
}
