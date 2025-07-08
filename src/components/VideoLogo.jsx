// src/components/VideoLogo.jsx
import { useRef, useEffect, useState } from "react";

// ← Update these paths as needed:
const POSTER_SRC = "/GWS-animated.png";
const VIDEO_SRC  = "/GWS-animated.webm";

export default function VideoLogo({
  alt = "Company Logo",
  className = "",    // e.g. "h-16 w-auto"
}) {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);
  const [inView, setInView] = useState(false);
  const pauseTimeout = useRef(null);

  // 1️⃣ Lazy‐load via IntersectionObserver
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

  // 2️⃣ Wheel handler drives forward or reverse, loops instantly, pauses only after no wheel for 100ms
  useEffect(() => {
    if (!inView) return;
    const vid = videoRef.current;
    if (!vid) return;

    const reverseStep = 0.02;   // half‐speed step backwards
    const HALF_SPEED   = 0.5;   // half the normal rate

    function onWheel(e) {
      // cancel any pending pause
      clearTimeout(pauseTimeout.current);

      if (e.deltaY > 0) {
        // ▶️ scroll down → play forward at half speed
        vid.playbackRate = HALF_SPEED;
        vid.play().catch(() => {});
      } else {
        // ◀️ scroll up → pause then step backwards one chunk, looping seamlessly
        vid.pause();
        vid.currentTime =
          vid.currentTime > reverseStep
            ? vid.currentTime - reverseStep
            : vid.duration;
      }

      // once wheel stops for 100ms, pause
      pauseTimeout.current = setTimeout(() => {
        vid.pause();
      }, 100);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView]);

  return (
    <div ref={containerRef} className={className}>
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
          className={className}
          style={{ display: "block", width: "50px", height: "auto" }}
        />
      ) : (
        <img
          src={POSTER_SRC}
          alt={alt}
          loading="lazy"
          className={className}
          style={{ display: "block", width: "50px", height: "auto" }}
        />
      )}
    </div>
  );
}
