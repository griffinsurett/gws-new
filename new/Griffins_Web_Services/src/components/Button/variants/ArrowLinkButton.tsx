import { lazy, Suspense } from "react";
import { ButtonBase, type ButtonProps } from "../Button";

// Lazy load Icon to prevent icons chunk from loading until actually needed
const LazyIcon = lazy(() => import("@/components/Icon"));

export default function ArrowLinkButton({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonBase
      {...props}
      className={`group flex items-center justify-between gap-4 text-left cursor-pointer ${className}`.trim()}
      unstyled
    >
      <span className="flex justify-center items-center rounded-full h-10 w-10 bg-accent">
        <Suspense fallback={null}>
          <LazyIcon icon="lu:arrow-right" size="lg" className="text-bg p-0" />
        </Suspense>
      </span>
    </ButtonBase>
  );
}
