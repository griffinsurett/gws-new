// src/components/LoopComponents/FeatureCard.tsx
import AnimatedBorder from "../AnimatedBorder/AnimatedBorder";
import IconListItem, { type IconListItemProps } from "./IconListItem";
import type { ReactNode } from "react";

type IconValue = IconListItemProps["data"]["icon"];

export type FeatureCardData =
  | (IconListItemProps["data"] & { data?: Record<string, unknown> })
  | Record<string, unknown>
  | null
  | undefined;

export interface FeatureCardProps {
  data?: FeatureCardData;
  icon?: IconValue;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  ringDuration?: number;
  listItemProps?: Partial<Omit<IconListItemProps, "data">>;
}

const ICON_KEYS = ["icon", "Icon", "iconName"];
const TITLE_KEYS = ["title", "name", "heading", "label"];
const DESCRIPTION_KEYS = ["description", "summary", "excerpt", "body", "content"];
const IMAGE_KEYS = ["image", "img", "media"];
const URL_KEYS = ["url", "href", "link"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasContent = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

const collectDataSources = (
  input: FeatureCardData,
  seen = new Set<Record<string, unknown>>()
): Record<string, unknown>[] => {
  if (!isRecord(input) || seen.has(input)) return [];
  seen.add(input);
  const record = input as Record<string, unknown>;
  const nestedSources = collectDataSources(record.data as FeatureCardData, seen);
  return [...nestedSources, record];
};

const pickValue = (sources: Record<string, unknown>[], keys: string[]) => {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      if (hasContent(value)) return value;
    }
  }
  return undefined;
};

const createOverrideSource = ({
  icon,
  title,
  description,
}: {
  icon?: IconValue;
  title?: ReactNode;
  description?: ReactNode;
}) => {
  const overrides: Record<string, unknown> = {};
  if (hasContent(icon)) overrides.icon = icon;
  if (hasContent(title)) overrides.title = title;
  if (hasContent(description)) overrides.description = description;
  return Object.keys(overrides).length > 0 ? overrides : undefined;
};

type NormalizedPayload = {
  content: IconListItemProps["data"];
  url?: string;
};

const normalizeFeatureCardData = (
  sources: Record<string, unknown>[]
): NormalizedPayload => {
  const icon = pickValue(sources, ICON_KEYS);
  const title = pickValue(sources, TITLE_KEYS);
  const description = pickValue(sources, DESCRIPTION_KEYS);
  const image = pickValue(sources, IMAGE_KEYS);
  const urlValue = pickValue(sources, URL_KEYS);
  const url =
    typeof urlValue === "string" && urlValue.trim().length > 0
      ? urlValue
      : undefined;

  const normalized: IconListItemProps["data"] = {};
  if (icon !== undefined) normalized.icon = icon as IconValue;
  if (image !== undefined) normalized.image = image as IconListItemProps["data"]["image"];
  if (title !== undefined) normalized.title = title as ReactNode;
  if (description !== undefined) normalized.description = description as ReactNode;

  return {
    content: normalized,
    ...(url ? { url } : {}),
  };
};

const EMPTY_PAYLOAD: NormalizedPayload = { content: {} };

export default function FeatureCard({
  data,
  icon,
  title,
  description,
  className = "",
  ringDuration = 800,
  listItemProps,
}: FeatureCardProps) {
  const overrideSource = createOverrideSource({ icon, title, description });
  const dataSources = [
    ...(overrideSource ? [overrideSource] : []),
    ...collectDataSources(data),
  ];
  const { content: resolvedData, url } =
    dataSources.length > 0 ? normalizeFeatureCardData(dataSources) : EMPTY_PAYLOAD;

  const {
    layout,
    alignment,
    iconClassName,
    iconSize,
    titleClassName,
    titleTag,
    descriptionClassName,
    descriptionTag,
    ...restListItemProps
  } = listItemProps ?? {};

  const resolvedLayout = layout ?? "vertical";
  const resolvedAlignment = alignment ?? (resolvedLayout.includes("horizontal") ? "left" : "center");
  const defaultIconClassName = resolvedLayout.includes("horizontal")
    ? "icon-large z-10 card-icon-color mx-auto"
    : "icon-large z-10 mb-5 card-icon-color mx-auto";

  const listItemConfig: Omit<IconListItemProps, "data"> = {
    layout: resolvedLayout,
    alignment: resolvedAlignment,
    iconClassName: iconClassName ?? defaultIconClassName,
    iconSize: iconSize ?? "xl",
    titleClassName: titleClassName ?? "h3 mb-3 relative z-10",
    titleTag: titleTag ?? "h3",
    descriptionClassName:
      descriptionClassName ?? "text-text leading-relaxed relative z-10",
    descriptionTag: descriptionTag ?? "p",
    ...restListItemProps,
  };

  const innerCardClass =
    resolvedLayout.includes("horizontal")
      ? "lg:h-55 w-full px-8 py-6 relative flex flex-col justify-center items-center card-bg"
      : "h-90 mx-auto px-10 flex flex-col justify-center items-center relative card-bg";

  const wrapperTextClass = resolvedLayout.includes("horizontal") ? "text-left" : "text-center";

  return (
    <div className={className}>
      <AnimatedBorder
        variant="progress-b-f"
        triggers="hover"
        duration={ringDuration}
        borderRadius="rounded-3xl"
        borderWidth={2}
        className={`group ${wrapperTextClass} outer-card-transition outer-card-hover-transition !duration-[900ms] ease-out`}
        innerClassName={innerCardClass}
        linkProps={url ? { href: url } : undefined}
      >
        <div className="inner-card-style inner-card-transition inner-card-color" />
        <IconListItem
          data={resolvedData}
          {...listItemConfig}
        />
      </AnimatedBorder>
    </div>
  );
}
