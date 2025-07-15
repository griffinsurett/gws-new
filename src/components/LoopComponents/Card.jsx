// src/components/Card.jsx
import { getItemKey } from "@/utils/getItemKey";
import Icon from "@/components/Icon/Icon";

/**
 * Card component for rendering an individual item.
 * If the page exists, the whole card becomes a link.
 * Displays an icon dynamically based on item.data.icon.
 */
export default function Card({ item, itemClass, collectionName, HasPage }) {
  const effectiveHasPage =
    item.data.hasPage !== undefined ? item.data.hasPage : HasPage;

  const href = `/${collectionName}/${getItemKey(item)}`;
  const baseClasses = `card p-[var(--spacing-sm)] ${itemClass}`;
  const hoverClasses = `block w-full hover-border-effect hover-animation`

  const content = (
    <>
      {item.data.icon && (
        <div className="mb-[var(--spacing-sm)] aspect-square w-14 h-auto background-effect hover-animation-lg flex justify-center items-center rounded-full">
          <Icon icon={item.data.icon} className="text-2xl grayscale" />
        </div>
      )}
      <h3 className="mb-[var(--spacing-sm)] text-[var(--color-text)]">
        {item.data.title}
      </h3>
      <p className="mb-[var(--spacing-sm)]">
        {item.data.description || item.body}
      </p>
    </>
  );

  if (effectiveHasPage) {
    return (
      <a
        href={href}
        className={`${hoverClasses} ${baseClasses}`}
        aria-label={`View more about ${item.data.title}`}
      >
        <article>{content}</article>
      </a>
    );
  }

  return <article className={baseClasses}>{content}</article>;
}
