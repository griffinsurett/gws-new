import { useEffect, useState, useRef } from "react";
/**
 * useScrollAnimation
 * — lazy-loads via IntersectionObserver
 * — when in-view, listens for wheel and calls the provided
 *   forward() / backward() callbacks (or toggles classes).
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {Object}            options
 * @param {number}            options.threshold    IO threshold
 * @param {() => void}        options.onForward   called on scroll down
 * @param {() => void}        options.onBackward  called on scroll up
 */
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

  // 1️⃣ Lazy-load
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

  // 2️⃣ Wheel → callbacks
  useEffect(() => {
    if (!inView) return;
    function onWheel(e) {
      clearTimeout(pauseTimeout.current);
      if (e.deltaY > 0) {
        onForward();
      } else {
        onBackward();
      }
      pauseTimeout.current = setTimeout(() => {
        // you could call an onPause() hook here if you want
      }, pauseDelay);
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(pauseTimeout.current);
    };
  }, [inView, onForward, onBackward, pauseDelay]);

  return inView;
}
