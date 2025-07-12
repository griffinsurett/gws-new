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

  // ① track when we're in view
  const [inView,    setInView]    = useState(false);
  // ② track when the user has scrolled down enough to "activate" the video
  const [activated, setActivated] = useState(false);
  const pauseTimeout = useRef(null);
  const lastScrollY = useRef(0);

  // lazy‐load trigger
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

  // scroll/wheel handler
  useEffect(() => {
    if (!inView) return;
    const vid = videoRef.current;

    // Initialize lastScrollY once
    lastScrollY.current = window.pageYOffset;

    function handleMovement(deltaY) {
      clearTimeout(pauseTimeout.current);

      if (deltaY > 0) {
        // first downward scroll → activate
        if (!activated) setActivated(true);
        // play forward
        vid.playbackRate = 0.5;
        vid.play().catch(() => {});
      } else if (deltaY < 0) {
        // rewind on scroll-up
        vid.pause();
        const reverseStep = 0.02;
        vid.currentTime =
          vid.currentTime > reverseStep ? vid.currentTime - reverseStep : vid.duration;

        // if we're back at the very top, reset fully & replay
        if (window.pageYOffset <= 0) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      }

      // auto-pause after short delay
      pauseTimeout.current = setTimeout(() => {
        vid.pause();
      }, 100);
    }

    function onWheel(e) {
      handleMovement(e.deltaY);
    }

    function onScroll() {
      const currentY = window.pageYOffset;
      const deltaY = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      handleMovement(deltaY);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
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
