// src/components/LoopComponents/AccordionItem.jsx
import React, { useState } from "react";
import { getItemKey } from "@/utils/getItemKey.js";

export default function AccordionItem({
  item,
  itemClass = "",
  collectionName,
  HasPage,
  isOpen: controlledOpen,
  onToggle: controlledToggle,
}) {
  // 1) internal state for uncontrolled usage
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // 2) decide whether we're in controlled mode
  const isControlled =
    typeof controlledOpen === "boolean" && typeof controlledToggle === "function";

  // 3) which "open" value and "toggle" callback to use
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const toggle = () => {
    if (isControlled) {
      controlledToggle();
    } else {
      setUncontrolledOpen((prev) => !prev);
    }
  };

  // 4) rest of your logic
  const key = getItemKey(item);
  const effectiveHasPage = item.data.hasPage ?? HasPage;
  const href = effectiveHasPage ? `/${collectionName}/${key}` : null;
  const altTitle = item.data.title || key;

  return (
    <article
      id={`accordion-item-${key}`}
      className={`accordion-item ${itemClass}`}
    >
      {/* Header */}
      <div
        onClick={toggle}
        className="w-full flex justify-between items-center px-(--spacing-md) py-(--spacing-lg) cursor-pointer select-none"
      >
        <span className="h4">{altTitle}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Body */}
      <div
        className={`
          overflow-hidden small-text transition-[max-height] duration-(--transition-fast)
          ${open ? "max-h-96 p-(--spacing-lg)" : "max-h-0"}
        `}
      >
        {item.data.description ?? item.body}
      </div>
    </article>
  );
}
