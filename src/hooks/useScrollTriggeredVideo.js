// src/hooks/useScrollTriggeredVideo.js
import { useEffect, useRef, useState } from "react";

export function useScrollTriggeredVideo(containerRef, videoRef) {
  const [inView, setInView] = useState(false);
  const [activated, setActivated] = useState(false);
  const pauseTimeout = useRef(null);
  const lastScrollY = useRef(0);

  // Intersection Observer to detect when in view
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
  }, [containerRef]);

  // Scroll/Wheel tracking
  useEffect(() => {
    if (!inView) return;

    function handleMovement(deltaY) {
      const vid = videoRef.current;

      // Activate first
      if (!activated && deltaY > 0) {
        setActivated(true);
        return;
      }

      if (!vid) return;

      clearTimeout(pauseTimeout.current);

      if (deltaY > 0) {
        vid.playbackRate = 0.5;
        vid.play().catch(() => {});
      } else if (deltaY < 0) {
        vid.pause();
        const reverseStep = 0.02;
        vid.currentTime =
          vid.currentTime > reverseStep ? vid.currentTime - reverseStep : vid.duration;

        if (window.pageYOffset <= 0) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      }

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
  }, [inView, activated, videoRef]);

  // Autoplay on first activation
  useEffect(() => {
    if (!activated || !videoRef.current) return;
    videoRef.current.playbackRate = 0.5;
    videoRef.current.play().catch(() => {});
  }, [activated, videoRef]);

  return { activated };
}
