// src/components/LoopComponents/SocialIcon.tsx
import { lazy, Suspense } from "react";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";
import type { IconType } from "@/content/schema";
import type { IconSize } from "@/utils/icons/iconLoader";

// Lazy load Icon to prevent icons chunk from loading until actually needed
const LazyIcon = lazy(() => import("@/components/Icon"));

type SocialIconSize = "sm" | "md" | "lg";

export interface SocialIconProps {
  title: string;
  link?: string;
  icon?: IconType;
  size?: SocialIconSize;
}

const PADDING_MAP: Record<SocialIconSize, string> = {
  sm: "p-2",
  md: "p-2.5",
  lg: "p-3",
};

const ICON_SIZE_MAP: Record<SocialIconSize, IconSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export default function SocialIcon({
  title,
  link,
  icon = "lu:globe",
  size = "md",
}: SocialIconProps) {
  const wrapperClass = `${PADDING_MAP[size]} rounded-full inline-flex items-center justify-center bg-accent/10 border border-accent/30 text-accent`;
  const iconSize = ICON_SIZE_MAP[size];

  return (
    <AnimatedBorder
      variant="progress-b-f"
      triggers="hover"
      duration={800}
      borderRadius="rounded-full"
      borderWidth={2}
      color="var(--color-accent)"
      className="inline-flex transition-all duration-300 hover:-translate-y-1"
      innerClassName="rounded-full w-full h-full"
    >
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex rounded-full ${wrapperClass}`}
          aria-label={`Visit our ${title}`}
          title={title}
        >
          <Suspense fallback={null}>
            <LazyIcon icon={icon} size={iconSize} className="text-current" />
          </Suspense>
        </a>
      ) : (
        <div className={`inline-flex rounded-full ${wrapperClass}`} title={title}>
          <Suspense fallback={null}>
            <LazyIcon icon={icon} size={iconSize} className="text-current" />
          </Suspense>
        </div>
      )}
    </AnimatedBorder>
  );
}
