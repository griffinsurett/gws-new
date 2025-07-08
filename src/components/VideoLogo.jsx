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

  // inView → when we've scrolled into view at least 10%
  const [inView, setInView] = useState(false);

  // track last scroll Y
  const lastScrollY = useRef(0);

  // a ref to hold our “pause after scrolling stops” timer
  const stopTimeout = useRef(null);

  // 1️⃣ Lazy-load the video when it scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 2️⃣ Once in view, listen to scroll and drive playback
  useEffect(() => {
    if (!inView) return;

    // initialize
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const vid = videoRef.current;
      if (!vid) return;

      // determine direction
      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;

      // set forward/reverse
      vid.playbackRate = delta > 0 ? 1 : -1;

      // play (if paused, this restarts)
      vid.play().catch(() => {});

      // clear any pending pause
      clearTimeout(stopTimeout.current);

      // schedule a pause once scrolling stops (after 100ms of no scroll)
      stopTimeout.current = setTimeout(() => {
        vid.pause();
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stopTimeout.current);
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