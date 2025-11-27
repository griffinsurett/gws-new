import type { HTMLAttributes, ReactNode } from "react";

interface HeadingSegmentProps {
  id?: string;
  className?: string;
  [key: string]: unknown;
}

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  tagName?: keyof JSX.IntrinsicElements;
  before?: ReactNode;
  text?: ReactNode;
  after?: ReactNode;
  beforeClass?: string;
  textClass?: string;
  afterClass?: string;
  beforeId?: string;
  textId?: string;
  afterId?: string;
  beforeProps?: HeadingSegmentProps;
  textProps?: HeadingSegmentProps;
  afterProps?: HeadingSegmentProps;
  children?: ReactNode;
}

export default function Heading({
  tagName: Tag = "h2",
  className = "",
  before,
  text,
  after,
  beforeClass = "",
  textClass = "",
  afterClass = "",
  beforeId,
  textId,
  afterId,
  beforeProps,
  textProps,
  afterProps,
  children,
  ...props
}: HeadingProps) {
  const tagLevel = typeof Tag === "string" ? Tag.toLowerCase() : "h2";
  const isHeadingTag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagLevel);
  const hasManualHeadingClass = /\bh[1-6]\b/.test(className);
  const finalClassName =
    hasManualHeadingClass || !isHeadingTag
      ? className
      : `${tagLevel} ${className}`.trim();

  const isPropBased =
    before !== undefined || text !== undefined || after !== undefined;

  const mergeProps = (
    idFromProp: string | undefined,
    clsFromProp: string,
    bag?: HeadingSegmentProps
  ) => {
    const bagSafe = bag ?? {};
    const mergedClass = [clsFromProp, bagSafe.className]
      .filter(Boolean)
      .join(" ");
    return {
      id: idFromProp ?? bagSafe.id,
      ...bagSafe,
      className: mergedClass || undefined,
    };
  };

  const TagComponent = Tag as keyof JSX.IntrinsicElements;

  return (
    <TagComponent className={finalClassName} {...props}>
      {isPropBased ? (
        <>
          {before !== undefined && (
            <span {...mergeProps(beforeId, beforeClass, beforeProps)}>
              {before}
            </span>
          )}
          {text !== undefined && (
            <span {...mergeProps(textId, textClass, textProps)}>{text}</span>
          )}
          {after !== undefined && (
            <span {...mergeProps(afterId, afterClass, afterProps)}>
              {after}
            </span>
          )}
        </>
      ) : (
        children
      )}
    </TagComponent>
  );
}
