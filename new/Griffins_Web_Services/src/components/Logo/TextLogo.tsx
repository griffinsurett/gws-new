import { useEffect, useRef, useState } from "react";
import { useVisibility } from "@/hooks/animations/useVisibility";

interface TextLogoProps {
  title?: string;
  className?: string;
  firstClass?: string;
  restClass?: string;
  fadeDuration?: number;
  animateOutText?: boolean;
}

export default function TextLogo({
  title = "Griffin's Web Services",
  className = "",
  firstClass = "text-2xl lg:text-3xl -ml-[0.1rem] leading-wide font-bold",
  restClass = "font-light text-accent uppercase text-xs lg:text-sm p-0 m-0 tracking-wider",
  fadeDuration = 1200,
  animateOutText = false,
}: TextLogoProps) {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [textHidden, setTextHidden] = useState(false);

  useVisibility(textRef, {
    threshold: 0,
    pauseDelay: fadeDuration,
    onForward: () => {
      if (animateOutText) {
        setTextHidden(true);
      }
    },
    onBackward: () => setTextHidden(false),
  });

  useEffect(() => {
    if (!animateOutText) setTextHidden(false);
  }, [animateOutText]);

  const [firstWord, ...others] = (title || "").split(" ");
  const restOfTitle = others.join(" ");

  return (
    <div
      ref={textRef}
      className={`${className} transform transition-opacity transition-transform ease-in-out ${
        textHidden ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
      style={{
        transitionDuration: `${fadeDuration}ms`,
      }}
    >
      <span className={firstClass} style={{ lineHeight: "normal" }}>
        {firstWord}
      </span>
      {restOfTitle && (
        <span className={restClass} style={{ lineHeight: "normal" }}>
          {" "}
          {restOfTitle}
        </span>
      )}
    </div>
  );
}
