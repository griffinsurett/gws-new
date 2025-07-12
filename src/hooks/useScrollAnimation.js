// src/hooks/useScrollAnimation.js
import { useEffect, useState, useRef } from "react";

export function useScrollAnimation(
  ref,
  {
    threshold   = 0.1,
    onForward   = () => {},
    onBackward  = () => {},
    pauseDelay  = 100,
  } = {}
) {
  const [inView, setInView] = useState(false);
  const pauseTimeout = useRef();
  const lastY = useRef(typeof window !== "undefined" ? window.pageYOffset : 0);

  // 1️⃣ Lazy-load via IntersectionObserver
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  // 2️⃣ Scroll & Wheel → callbacks
  useEffect(() => {
    if (!inView) return;

    function handleMovement(deltaY) {
      clearTimeout(pauseTimeout.current);
      if (deltaY > 0) onForward();
      else if (deltaY < 0) onBackward();

      pauseTimeout.current = setTimeout(() => {
        // optional: onPause()
      }, pauseDelay);
    }

    function onWheel(e) {
      handleMovement(e.deltaY);
    }

    function onScroll() {
      const currentY = window.pageYOffset;
      const deltaY = currentY - lastY.current;
      handleMovement(deltaY);
      lastY.current = currentY;
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView, onForward, onBackward, pauseDelay]);

  return inView;
}
