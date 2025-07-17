// src/components/LoopComponents/CircleImageItem.jsx
import React from "react";
import { getItemKey } from "@/utils/getItemKey.js";
import Image from "@/assets/background.svg"

export default function CircleImageItem({
  item,
  itemClass = "",
  collectionName,
  HasPage,
}) {
  // 1️⃣ figure out if we should wrap in a link
  const effectiveHasPage =
    item.data.hasPage !== undefined ? item.data.hasPage : HasPage;
  const href = `/${collectionName}/${getItemKey(item)}`;

  // 2️⃣ pull the featured image or fallback
  const imgSrc =
    item.data.featuredImage?.src ||
    Image; // placeholder
  const altText = item.data.title || item.slug || "Featured image";

  // 3️⃣ shared classes for our circle
  const circleClasses =
    "w-13 h-13 md:w-15 md:h-15 rounded-full overflow-hidden flex-shrink-0 " +
    "bg-gray-200 flex items-center justify-center";

  const imgClasses = "w-full h-full object-cover";

  // 4️⃣ render the image (and optionally wrap in <a>)
  const content = (
    <div className={`circle-image-item ${circleClasses} ${itemClass}`}>
        <img src={imgSrc} alt={altText} className={imgClasses} loading="lazy" />
    </div>
  );

  if (effectiveHasPage) {
    return (
      <a href={href} aria-label={`View details for ${altText}`}>
        {content}
      </a>
    );
  }

  return content;
}
