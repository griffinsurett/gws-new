import { useRef, useEffect, useState } from "react";

// ← Configure your two sources here once:
const STATIC_SRC = "/GWS-animated.png";
const GIF_SRC    = "/GWS-animated.gif";

/**
 * GifLogo Component
 * Renders a static placeholder first, then swaps to the GIF when scrolled into view.
 *
 * Props:
 * - alt:       string alt text for accessibility
 * - className: string additional Tailwind or custom classes
 */
export default function GifLogo({
  alt = "logo",
  className = "",
}) {
  const imgRef  = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setPlay(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={play ? GIF_SRC : STATIC_SRC}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
