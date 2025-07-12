// src/hooks/useScrollAnimation.js
import { useEffect, useState, useRef } from "react";

/**
 * useScrollAnimation
 *  - lazy-loads via IntersectionObserver
 *  - when in-view, listens for scroll (and wheel) and calls
 *    onForward() on scroll down, onBackward() on scroll up
 */
export function useScrollAnimation(
  ref,
  {
    threshold   = 0.1,
    pauseDelay  = 100,
    onForward   = () => {},
    onBackward  = () => {},
  } = {}
) {
  const [inView, setInView] = useState(false);
  const pauseTimeout = useRef();
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  // 1️⃣ Lazy-load intersection
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  // 2️⃣ Scroll & Wheel → direction callbacks
  useEffect(() => {
    if (!inView) return;

    const handler = (e) => {
      clearTimeout(pauseTimeout.current);

      // determine delta: try wheel, fallback to scroll
      let delta = 0;
      if (e.type === "wheel") {
        delta = e.deltaY;
      } else {
        const cur = window.scrollY;
        delta = cur - lastY.current;
        lastY.current = cur;
      }

      if (delta > 0) {
        onForward();
      } else if (delta < 0) {
        onBackward();
      }

      pauseTimeout.current = setTimeout(() => {
        /* you could fire an onPause() here */
      }, pauseDelay);
    };

    window.addEventListener("wheel", handler, { passive: true });
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("wheel", handler);
      window.removeEventListener("scroll", handler);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView, onForward, onBackward, pauseDelay]);

  return inView;
}
