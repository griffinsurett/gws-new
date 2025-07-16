// src/hooks/useScrollAnimation.js
import { useEffect, useState, useRef } from "react";

export function useScrollAnimation(
  ref,
  {
    // for IntersectionObserver
    threshold   = 0.1,
    // called when scrolling down
    onForward   = () => {},
    // called when scrolling up AND within restoreAtTopOffset px of top
    onBackward  = () => {},
    // ms to debounce between callbacks
    pauseDelay  = 100,
    // only fire onBackward when scrollY <= this (px)
    restoreAtTopOffset = 200,
  } = {}
) {
  const [inView, setInView] = useState(false);
  const pauseTimeout = useRef();
  const lastY = useRef(
    typeof window !== "undefined" ? window.pageYOffset : 0
  );

  // 1️⃣ wait until element is in view at least once
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

  // 2️⃣ only after inView do we listen for scroll/wheel
  useEffect(() => {
    if (!inView) return;

    function handleMovement(deltaY) {
      clearTimeout(pauseTimeout.current);

      if (deltaY > 0) {
        // scrolling down
        onForward();
      } else if (deltaY < 0) {
        // scrolling up — but only if we're back near the top
        const y = window.pageYOffset;
        if (y <= restoreAtTopOffset) {
          onBackward();
        }
      }

      pauseTimeout.current = setTimeout(() => {
        // you could call onPause() here
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
  }, [inView, onForward, onBackward, pauseDelay, restoreAtTopOffset]);

  return inView;
}
