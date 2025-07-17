// src/components/TextLogo.jsx
import React, { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function TextLogo({
  title = "",
  className = "",
  firstClass = "font-light leading-tight tracking-[0.1rem] text-xl lg:text-3xl text-heading",
  restClass  = "font-light text-xs md:text-sm lg:text-lg uppercase subtitle leading-tight tracking-[0.1rem] md:tracking-[var(--spacing-2xs)] px-[var(--spacing-2xs)] lg:px-0",
  fadeDuration = 1200,  // in ms
}) {
  const [firstWord, ...others] = title.split(" ");
  const restOfTitle = others.join(" ");
  const [hidden, setHidden] = useState(false);
  const ref = useRef(null);

  // hide when scrolling down, show when scrolling up
  useScrollAnimation(ref, {
    threshold: 0,                  // element enters immediately
    pauseDelay: fadeDuration,      // so we don’t flip-flop too fast
    onForward:  () => setHidden(true),
    onBackward: () => setHidden(false),
  });

  return (
    <div
      ref={ref}
      className={`
        ${className}
        transition-opacity duration-[${fadeDuration}ms]
        transition-transform duration-[${fadeDuration}ms]
        ease-[cubic-bezier(0.4,0,0.2,1)] transform
        ${hidden
          ? "opacity-0 -translate-y-4"
          : "opacity-100 translate-y-0"
        }
      `}
    >
      <span className={firstClass}>{firstWord}</span>
      {restOfTitle && <span className={restClass}> {restOfTitle}</span>}
    </div>
  );
}
