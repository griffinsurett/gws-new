// src/components/TextLogo.jsx
import React, { useState, useEffect } from "react";

export default function TextLogo({
  title = "",
  className = "",
  firstClass = "font-bold text-xl lg:text-3xl",
  restClass  = "small-text",
  fadeDuration = 1200,    // fade time in ms
  threshold    = 100,     // show only when scrollY < threshold
}) {
  const [firstWord, ...others] = title.split(" ");
  const restOfTitle = others.join(" ");

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div
      className={`
        ${className}
       transition-opacity duration-[${fadeDuration}ms] ease-[cubic-bezier(0.4,0,0.2,1)]
       transition-transform duration-[${fadeDuration}ms] ease-[cubic-bezier(0.4,0,0.2,1)]
       transform
       ${visible
         // when showing, fade-in & slide down *from* above
         ? "opacity-100 translate-y-0"
         // when hiding, fade-out & slide up *to* above
         : "opacity-0 -translate-y-4"}
      `}
    >
      <span className={firstClass}>{firstWord}</span>
      {restOfTitle && <span className={restClass}> {restOfTitle}</span>}
    </div>
  );
}
