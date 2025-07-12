// src/components/VideoLogo.jsx
import { useRef, useEffect, useState } from "react";

const POSTER_SRC = "/GWS-animated.png";
const VIDEO_SRC  = "/GWS-animated.webm";
const mediaClasses = "block w-[35px] md:w-[40px] lg:w-[50px] h-auto";

export default function VideoLogo({
  alt       = "",
  className = "light:filter light:invert",
}) {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);

  // ① in‐view vs. activated states
  const [inView,    setInView]    = useState(false);
  const [activated, setActivated] = useState(false);
  const pauseTimeout = useRef();

  // ② lazy‐load IntersectionObserver
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

  // ③ wheel handler: first scroll‐down “activates” video,
  //    scroll-up rewinds, then auto-pause
  useEffect(() => {
    if (!inView) return;
    const vid = videoRef.current;

    function onWheel(e) {
      clearTimeout(pauseTimeout.current);

      if (e.deltaY > 0) {
        // first downward scroll
        if (!activated) setActivated(true);

        // play the video
        vid.playbackRate = 0.5;
        vid.play().catch(() => {});
      } else {
        // rewind on any scroll-up
        vid.pause();
        const reverseStep = 0.02;
        vid.currentTime =
          vid.currentTime > reverseStep ? vid.currentTime - reverseStep : vid.duration;

        // if we’ve also hit the very top of the page, reset fully and replay:
        if (window.pageYOffset <= 0) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      }

      // auto-pause after 100ms of no wheel
      pauseTimeout.current = setTimeout(() => {
        vid.pause();
      }, 100);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView, activated]);

  return (
    <div ref={containerRef}>
      {!activated ? (
        <img
          src={POSTER_SRC}
          alt={alt}
          loading="lazy"
          className={`${className} ${mediaClasses}`}
        />
      ) : (
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
      )}
    </div>
  );
}
