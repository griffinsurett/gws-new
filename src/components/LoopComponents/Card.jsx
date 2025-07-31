// src/components/Card.jsx
import { getItemKey } from "@/utils/getItemKey";
import Icon from "@/components/Icon/Icon";
import Heading from "../Heading";

export default function Card({
  item,
  itemClass = "",
  collectionName,
  HasPage,
}) {
  const effectiveHasPage =
    item.data.hasPage !== undefined ? item.data.hasPage : HasPage;

  const href = `/${collectionName}/${getItemKey(item)}`;

  // 🔷 Outer wrapper - handles load animation only
  const outerClasses = "w-full load scale-up";

  // 🔷 Inner card - handles card styling and hover effects with shimmer
  const cardClasses = "card text-center relative overflow-hidden group";

  // 🔷 Article content classes
  const articleClasses =
    "flex flex-col justify-center items-center h-[35vh] md:h-[50vh] px-(--spacing-lg) py-(--spacing-sm) gap-(--spacing-lg) relative z-10";

  // 🔷 Neon effect classes (without hover animation to avoid conflicts)
  const neonClasses = "hover-neon-effect-border-primary";

  const content = (
    <>
      {item.data.icon && (
        <div className="mb-(--spacing-sm) aspect-square neon-effect-background-secondary w-16 h-auto flex justify-center items-center rounded-full">
          <Icon icon={item.data.icon} className="text-2xl grayscale" />
        </div>
      )}
      <div className="card-content px-(--spacing-lg)">
        <Heading tagName="h3" className="mb-(--spacing-sm)">
          {item.data.title}
        </Heading>
        <p className="mb-(--spacing-sm)">
          {item.data.description || item.body}
        </p>
      </div>
    </>
  );

  // 🔁 Render logic
  if (effectiveHasPage) {
    return (
      <div className={outerClasses}>
        <a
          href={href}
          className={`${cardClasses} ${neonClasses} block`}
          aria-label={`View more about ${item.data.title}`}
        >
          {/* Shimmer effect overlay using CSS variable */}
          <div 
            className="absolute inset-0 w-full h-full -translate-x-full 
                       group-hover:translate-x-full transition-transform 
                       duration-500 ease-in-out pointer-events-none z-0
                       [background-image:var(--shimmerGradient)]"
          />
          <article className={articleClasses}>{content}</article>
        </a>
      </div>
    );
  }

  return (
    <div className={outerClasses}>
      <article className={`${cardClasses} ${articleClasses}`}>
        {/* Shimmer effect overlay for non-link cards too */}
        <div className="relative z-10">{content}</div>
      </article>
    </div>
  );
}