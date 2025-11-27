import OptimizedLottie from "@/components/OptimizedLottie";
import type { PropsWithChildren } from "react";

interface LottieLogoProps {
  alt?: string;
  className?: string;
  mediaClasses?: string;
  loading?: "lazy" | "eager";
  trigger?: "auto" | "scroll" | "visible" | "load";
  respectReducedMotion?: boolean;
  fadeMs?: number;
}

const ANIMATION_URL = new URL("../../Lotties/Animation_logo_small_size.json", import.meta.url);

export default function LottieLogo({
  alt = "",
  className = "logo-class",
  mediaClasses = "block w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] object-contain",
  trigger = "auto",
  respectReducedMotion = true,
  fadeMs = 180,
  children,
}: PropsWithChildren<LottieLogoProps>) {
  return (
    <OptimizedLottie
      animationUrl={ANIMATION_URL}
      alt={alt}
      className={className}
      containerClasses={`relative ${mediaClasses}`}
      trigger={trigger}
      respectReducedMotion={respectReducedMotion}
      fadeMs={fadeMs}
      rewindToStartOnTop
      loop
      autoplay={false}
      speed={0.5}
      renderer="svg"
      scrollThreshold={1}
      debounceDelay={8}
      wheelSensitivity={1}
    >
      {children}
    </OptimizedLottie>
  );
}
