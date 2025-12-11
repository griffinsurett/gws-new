// src/components/BorderTitle.tsx
import AnimatedBorder, {
  type VisibleRootMargin,
} from "@/components/AnimatedBorder/AnimatedBorder";
import Heading from "@/components/Heading";
import type { ReactNode } from "react";

export interface BorderTitleProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  hoverSweep?: boolean;
  pillClassName?: string;
  visibleRootMargin?: VisibleRootMargin;
}

export default function BorderTitle({
  children,
  className = "",
  duration = 1200,
  hoverSweep = true,
  pillClassName = "text-sm px-5 py-2.5 tracking-wider",
  visibleRootMargin,
}: BorderTitleProps) {
  return (
    <div className="inline-block mb-3">
      <div className="relative inline-block">
        <AnimatedBorder
          variant="progress-b-f"
          triggers="visible"
          duration={duration}
          borderRadius="rounded-full"
          borderWidth={2}
          color="var(--color-primary)"
          className="inline-block"
          innerClassName={`bg-transparent border-transparent ${pillClassName}`}
          visibleRootMargin={visibleRootMargin}
        >
          <Heading
            tagName="span"
            className={`uppercase tracking-wider font-semibold text-heading ${className}`}
          >
            <span
              data-animate="color-text-fade"
              data-animate-once="true"
              className="color-text-fade"
              style={{ "--animation-duration": `${duration}ms` } as React.CSSProperties}
            >
              {children}
            </span>
          </Heading>
        </AnimatedBorder>

        {hoverSweep && (
          <div className="absolute inset-0 pointer-events-none">
            <AnimatedBorder
              variant="progress-infinite"
              triggers="hover"
              duration={1200}
              borderRadius="rounded-full"
              borderWidth={2}
              color="var(--color-accent)"
              className="w-full h-full"
              innerClassName="bg-transparent border-transparent px-0 py-0 pointer-events-none"
            >
              <span className="sr-only">Decorative border sweep</span>
            </AnimatedBorder>
          </div>
        )}
      </div>
    </div>
  );
}
