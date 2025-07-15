// src/components/Card.jsx
import { getItemKey } from "@/utils/getItemKey";
import Icon from "@/components/Icon/Icon";
import Heading from "../Heading";

export default function Card({ item, itemClass = "", collectionName, HasPage }) {
  const effectiveHasPage =
    item.data.hasPage !== undefined ? item.data.hasPage : HasPage;

  const href = `/${collectionName}/${getItemKey(item)}`;

  // 🔷 Classes applied to the outermost wrapper (<a> or <article>)
  const outerClasses = 
    "w-full card text-center load scale-up";

  // 🔷 Classes always on <article>
  const articleClasses = 
    "flex flex-col justify-center items-center h-[35vh] md:h-[50vh] px-[var(--spacing-lg)] py-[var(--spacing-sm)] gap-[var(--spacing-lg)]";

  // 🔷 Only applied when wrapping in a link
  const linkOnlyClasses =
    "hover-animation hover-border-effect";

  const content = (
    <>
      {item.data.icon && (
        <div className="mb-[var(--spacing-sm)] aspect-square w-14 h-auto background-effect hover-animation-lg flex justify-center items-center rounded-full">
          <Icon icon={item.data.icon} className="text-2xl grayscale" />
        </div>
      )}
     <div className="card-content px-[var(--spacing-lg)]">
       <Heading tagName="h3" className="h3 mb-[var(--spacing-sm)] text-[var(--color-text)]">
        {item.data.title}
      </Heading>
      <p className="mb-[var(--spacing-sm)]">
        {item.data.description || item.body}
      </p>
     </div>
    </>
  );

  // 🔁 Render logic
  if (effectiveHasPage) {
    return (
      <a href={href} className={`${outerClasses} ${linkOnlyClasses}`} aria-label={`View more about ${item.data.title}`}>
        <article className={articleClasses}>{content}</article>
      </a>
    );
  }

  return (
    <article className={`${outerClasses} ${articleClasses}`}>
      {content}
    </article>
  );
}
