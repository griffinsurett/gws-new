// src/components/VideoLogo.jsx
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ← Update these paths if your assets live elsewhere
const POSTER_SRC = "/GWS-animated.png";
const VIDEO_SRC  = "/GWS-animated.webm";

// shared sizing classes
const mediaClasses = "block w-[35px] md:w-[40px] lg:w-[50px] h-auto";

export default function VideoLogo({
  alt       = "",
  className = "light:filter light:invert", // e.g. "h-16 w-auto"
}) {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);

  // hook wires up IO + wheel → callbacks
  const inView = useScrollAnimation(containerRef, {
    threshold: 0.1,
    pauseDelay: 100,
    onForward: () => {
      const vid = videoRef.current;
      vid.playbackRate = 0.5;
      vid.play().catch(() => {});
    },
    onBackward: () => {
      const vid = videoRef.current;
      const reverseStep = 0.02;
      vid.pause();
      vid.currentTime = vid.currentTime > reverseStep
        ? vid.currentTime - reverseStep
        : vid.duration;
    },
  });

  return (
    <div ref={containerRef}>
      {inView ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className={`${className} ${mediaClasses}`}
        />
      ) : (
        <img
          src={POSTER_SRC}
          alt={alt}
          loading="lazy"
          className={`${className} ${mediaClasses}`}
        />
      )}
    </div>
  );
}
