// src/components/Card.jsx
import { getItemKey } from "@/utils/getItemKey";

/**
 * Card component for rendering an individual item.
 * If the page exists, the whole card becomes a link.
 */
export default function Card({ item, itemClass, collectionName, HasPage }) {
  const effectiveHasPage =
    item.data.hasPage !== undefined ? item.data.hasPage : HasPage;

  const href = `/${collectionName}/${getItemKey(item)}`;
  const baseClasses = `card p-[var(--spacing-sm)] ${itemClass}`;

  const content = (
    <>
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
      <a href={href} className={`block w-full hover-border-effect hover-animation ${baseClasses}`} aria-label={`View more about ${item.data.title}`}>
        <article>
          {content}
        </article>
      </a>
    );
  }

  return (
    <article className={baseClasses}>
      {content}
    </article>
  );
}

