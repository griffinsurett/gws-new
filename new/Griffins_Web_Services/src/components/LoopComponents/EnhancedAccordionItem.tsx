// src/components/LoopComponents/EnhancedAccordionItem.tsx
import type { ReactNode } from "react";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";
import type { IconType } from "@/content/schema";
import Button from "../Button/Button";
// Direct import - this component is already in a deferred chunk (accordion)
// so there's no benefit to lazy loading the icon within it
import Icon from "@/components/Icon";

interface EnhancedAccordionItemProps {
  icon?: string;
  title: string;
  description?: string;
  isActive: boolean;
  progress?: number;
  onToggle: () => void;
  children?: ReactNode;
  className?: string;
}

export default function EnhancedAccordionItem({
  icon,
  title,
  description,
  isActive,
  progress = 0,
  onToggle,
  children,
  className = "",
}: EnhancedAccordionItemProps) {
  return (
    <div
      className={`group relative ${className}`.trim()}
      data-accordion-item
      data-active={isActive ? "true" : "false"}
    >
      <AnimatedBorder
        variant="progress"
        triggers="controlled"
        active={isActive}
        controller={progress}
        duration={300}
        borderRadius="rounded-3xl"
        borderWidth={2}
        className="transition-all duration-200"
        innerClassName="card-bg"
      >
        <Button
          variant="link"
          type="button"
          className="w-full text-left flex items-center justify-between p-5 hover:bg-card/50 transition-colors duration-300 cursor-pointer relative z-20"
          onClick={onToggle}
          onMouseDown={(event) => event.preventDefault()}
          aria-expanded={isActive}
        >
          <div className="flex items-center gap-4">
            {icon && (
              <span className="icon-large card-icon-color shrink-0">
                {icon.includes(":") ? (
                  <Icon icon={icon as IconType} size="lg" className="w-6 h-6" />
                ) : (
                  <span className="text-2xl leading-none">{icon}</span>
                )}
              </span>
            )}
            <div className="text-left">
              <p className="h4">{title}</p>
            </div>
          </div>

          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-[600ms] text-xl font-semibold
              ${
                isActive
                  ? "bg-primary text-bg"
                  : "bg-primary/15 text-accent group-hover:bg-primary/25"
              }
            `}
            aria-hidden="true"
          >
            <span className="translate-y-[-1px]">{isActive ? "−" : "+"}</span>
          </div>
        </Button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out relative z-20 ${
            isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6">
            <div className="w-full h-px bg-primary/15 mb-4" />
            {description && (
              <p className="text-text/80 leading-relaxed mb-4">{description}</p>
            )}
            {children}
          </div>
        </div>
      </AnimatedBorder>
    </div>
  );
}
