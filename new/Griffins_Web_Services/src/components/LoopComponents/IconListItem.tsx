// src/components/LoopComponents/IconListItem.tsx
import { isValidElement, type ElementType, type ReactNode } from "react";
import type { IconType } from "@/content/schema";
import type { IconSize } from "@/utils/icons/iconLoader";
// Direct import - this component is already in a deferred chunk (feature-cards)
// so there's no benefit to lazy loading the icon within it
import Icon from "@/components/Icon";

type Layout = "vertical" | "horizontal" | "horizontal-reverse";
type Alignment = "center" | "left" | "right";
type TitleTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div"
  | "span"
  | "p";
type DescriptionTag = "p" | "div" | "span";

interface IconRenderConfig {
  icon: IconType;
  size?: IconSize;
  className?: string;
  color?: string;
  ariaLabel?: string;
}

type IconValue = ReactNode | IconType | IconRenderConfig;

interface IconListData {
  icon?: IconValue;
  image?: { src?: string; alt?: string } | string;
  title?: ReactNode;
  description?: ReactNode;
}

export interface IconListItemProps {
  data: IconListData;
  layout?: Layout;
  alignment?: Alignment;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  iconSize?: IconSize;
  imageClassName?: string;
  imageLoading?: "lazy" | "eager";
  titleClassName?: string;
  titleTag?: TitleTag;
  descriptionClassName?: string;
  descriptionTag?: DescriptionTag;
  showIcon?: boolean;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

export default function IconListItem({
  data,
  layout = "vertical",
  alignment = "center",
  className = "",
  containerClassName = "",
  iconClassName = "card-icon-color",
  iconSize = "lg",
  imageClassName = "w-12 h-12 rounded-full object-cover flex-shrink-0",
  imageLoading = "lazy",
  titleClassName = "h4",
  titleTag = "h3",
  descriptionClassName = "text-text text-sm",
  descriptionTag = "p",
  showIcon = true,
  showImage = false,
  showTitle = true,
  showDescription = true,
}: IconListItemProps) {
  const { icon, image, title, description } = data;

  const layouts: Record<Layout, string> = {
    vertical: "flex flex-col",
    horizontal: "flex items-center",
    "horizontal-reverse": "flex items-start flex-row-reverse",
  };

  const alignments: Record<Alignment, string> = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  };

  const iconSizeClasses: Record<IconSize, string> = {
    sm: "icon-small",
    md: "icon-medium",
    lg: "icon-large",
    xl: "icon-large",
  };

  const resolvedIconClassName = [
    iconSizeClasses[iconSize],
    iconClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const TitleTagComponent = titleTag as ElementType;
  const DescriptionTagComponent = descriptionTag as ElementType;

  const fallbackAlt =
    (typeof title === "string" && title) ||
    (typeof description === "string" && description) ||
    "Icon image";

  const imageContent = (() => {
    if (!showImage || !image) return null;
    const imageSrc = typeof image === "string" ? image : image?.src;
    if (!imageSrc) return null;
    const imageAlt =
      (typeof image === "string" ? undefined : image?.alt) || fallbackAlt;

    return (
      <div className={imageClassName}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading={imageLoading}
        />
      </div>
    );
  })();

  const titleContent =
    showTitle && title ? (
      <TitleTagComponent className={titleClassName}>{title}</TitleTagComponent>
    ) : null;

  const descriptionContent =
    showDescription && description ? (
      <DescriptionTagComponent className={descriptionClassName}>
        {description}
      </DescriptionTagComponent>
    ) : null;

  const iconContent = (() => {
    if (!showIcon || showImage || !icon) return null;

    const isIconConfig =
      typeof icon === "object" &&
      icon !== null &&
      !Array.isArray(icon) &&
      !isValidElement(icon) &&
      "icon" in icon;

    const isRenderableIcon =
      typeof icon === "string" ||
      (typeof icon === "object" &&
        icon !== null &&
        !Array.isArray(icon) &&
        !isValidElement(icon) &&
        !isIconConfig);

    if (isIconConfig) {
      const { icon: iconName, size, className: customClass = "", color, ariaLabel } =
        icon as IconRenderConfig;
      return (
        <div className={`shrink-0 ${resolvedIconClassName}`}>
          <Icon
            icon={iconName}
            size={size ?? iconSize}
            className={customClass}
            color={color}
            aria-label={ariaLabel}
          />
        </div>
      );
    }

    if (isRenderableIcon) {
      return (
        <div className={`shrink-0 ${resolvedIconClassName}`}>
          <Icon icon={icon as IconType} size={iconSize} />
        </div>
      );
    }

    return <div className={`shrink-0 ${resolvedIconClassName}`}>{icon}</div>;
  })();

  return (
    <div className={`${layouts[layout]} ${alignments[alignment]} ${className}`.trim()}>
      {imageContent}

      {iconContent}

      {layout.includes("horizontal") ? (
        <div className={containerClassName}>
          {titleContent}
          {descriptionContent}
        </div>
      ) : (
        <>
          {titleContent}
          {descriptionContent}
        </>
      )}
    </div>
  );
}
