// src/components/VideoLogo.jsx
import { useRef, useEffect, useState } from "react";

// ← Update these paths as needed:
const POSTER_SRC = "/GWS-animated.png";
const VIDEO_SRC  = "/GWS-animated.webm";
const mediaClasses = "block w-[35px] md:w-[40px] lg:w-[50px] h-auto";

export default function VideoLogo({
  alt = "",
  className = "light:filter light:invert",    // e.g. "h-16 w-auto"
}) {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);
  const [inView, setInView] = useState(false);
  const pauseTimeout = useRef(null);

  // lazy‐load
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // wheel → play
  useEffect(() => {
    if (!inView) return;
    const vid = videoRef.current;
    if (!vid) return;

    const reverseStep = 0.02;
    const HALF_SPEED  = 0.5;

    function onWheel(e) {
      clearTimeout(pauseTimeout.current);
      if (e.deltaY > 0) {
        vid.playbackRate = HALF_SPEED;
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = vid.currentTime > reverseStep
          ? vid.currentTime - reverseStep
          : vid.duration;
      }
      pauseTimeout.current = setTimeout(() => vid.pause(), 100);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView]);

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
