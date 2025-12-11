// src/components/LoopComponents/OneColumnIconListItem.tsx
import { isValidElement, lazy, Suspense, type ReactNode } from "react";
import type { IconType } from "@/content/schema";
import type { IconSize } from "@/utils/icons/iconLoader";

// Lazy load Icon to prevent icons chunk from loading until actually needed
const LazyIcon = lazy(() => import("@/components/Icon"));

type IconValue = IconType | ReactNode | IconRenderConfig;

interface IconRenderConfig {
  icon: IconType;
  size?: IconSize;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

const ACCENT_PRESETS = {
  projects: {
    iconWrap:
      "bg-[#123628]/90 text-[#c4ff84] ring-1 ring-[#47dd9d]/40 shadow-[0_15px_40px_-20px_rgba(39,255,176,0.5)]",
    arrow:
      "text-[#8ef0bf] border-[#8ef0bf]/40 bg-[#0c241c]/70 shadow-[0_8px_25px_-15px_rgba(142,240,191,0.8)]",
  },
  primary: {
    iconWrap: "bg-primary/15 text-primary ring-1 ring-primary/35",
    arrow: "text-primary border-primary/30 bg-transparent",
  },
  neutral: {
    iconWrap: "bg-white/10 text-white ring-1 ring-white/25",
    arrow: "text-white border-white/20 bg-transparent",
  },
} as const;

const BASE_SURFACE =
  "group flex items-start gap-5 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-5 lg:px-7 lg:py-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]";

const BASE_ICON =
  "flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold transition-transform duration-300 group-hover:scale-105";

const BASE_TITLE = "text-2xl font-semibold leading-tight text-[#f4fff4]";
const BASE_DESCRIPTION = "text-base leading-relaxed text-[#ccefdc]";
const BASE_EYEBROW =
  "text-[0.65rem] uppercase tracking-[0.4em] text-[#6fceaa]";

export interface OneColumnIconListItemProps {
  icon?: IconValue;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  accent?: keyof typeof ACCENT_PRESETS;
  className?: string;
  iconWrapperClassName?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showArrow?: boolean;
}

function renderIconContent(icon: IconValue) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;

  const isIconConfig =
    typeof icon === "object" &&
    icon !== null &&
    !Array.isArray(icon) &&
    !isValidElement(icon) &&
    "icon" in icon;

  if (isIconConfig) {
    const { icon: iconName, size, className, color, ariaLabel } =
      icon as IconRenderConfig;
    return (
      <Suspense fallback={null}>
        <LazyIcon
          icon={iconName}
          size={size ?? "lg"}
          className={className}
          color={color}
          aria-label={ariaLabel}
        />
      </Suspense>
    );
  }

  if (typeof icon === "string" || typeof icon === "object") {
    return (
      <Suspense fallback={null}>
        <LazyIcon icon={icon as IconType} size="lg" />
      </Suspense>
    );
  }

  return <span className="text-2xl font-semibold">{icon}</span>;
}

export default function OneColumnIconListItem({
  icon,
  title,
  description,
  eyebrow,
  href,
  target,
  rel,
  accent = "projects",
  className = "",
  iconWrapperClassName = "",
  eyebrowClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  showArrow = true,
}: OneColumnIconListItemProps) {
  const palette =
    ACCENT_PRESETS[accent] ?? ACCENT_PRESETS.projects;

  const containerClass = [BASE_SURFACE, className]
    .filter(Boolean)
    .join(" ");

  const iconWrapClass = [BASE_ICON, palette.iconWrap, iconWrapperClassName]
    .filter(Boolean)
    .join(" ");

  const eyebrowClass = [BASE_EYEBROW, eyebrowClassName]
    .filter(Boolean)
    .join(" ");

  const titleClass = [BASE_TITLE, titleClassName]
    .filter(Boolean)
    .join(" ");

  const descriptionClass = [BASE_DESCRIPTION, descriptionClassName]
    .filter(Boolean)
    .join(" ");

  const relValue =
    rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  const arrow = (
    <span
      className={[
        "ml-4 hidden h-11 w-11 items-center justify-center rounded-full border text-lg transition-all duration-300 group-hover:translate-x-1 sm:flex",
        palette.arrow,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <LazyIcon icon="lu:arrow-up-right" size="md" />
      </Suspense>
    </span>
  );

  const content = (
    <>
      <div className={iconWrapClass}>{renderIconContent(icon)}</div>
      <div className="space-y-2 text-left">
        {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
        {title && <h3 className={titleClass}>{title}</h3>}
        {description && (
          <p className={descriptionClass}>{description}</p>
        )}
      </div>
      {href && showArrow && arrow}
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={relValue} className={containerClass}>
        {content}
      </a>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
