// src/components/TextLogo.jsx
import React, { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function TextLogo({
  title = "",
  className = "",
  firstClass = "h3 font-heading text-heading -ml-[0.1rem]",
  restClass  = "font-light text-primary uppercase small-text",
  fadeDuration = 1200,  
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
        ease-in-out transform
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
