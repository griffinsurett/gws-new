// src/components/LoopComponents/Menu/MobileMenuItem.tsx
/**
 * Mobile Menu Item Component
 *
 * Collapsible menu item for mobile navigation.
 * Accessible navigation pattern with proper ARIA.
 */

import { lazy, Suspense } from "react";
import Button from "@/components/Button/Button";

// Lazy load Icon to prevent icons chunk from loading until actually needed
const LazyIcon = lazy(() => import("@/components/Icon"));

interface MobileMenuItemProps {
  title: string;
  url?: string;
  slug: string;
  children?: any[];
  openInNewTab?: boolean;
  onNavigate: () => void;
  onOpenSubmenu?: (submenu: { title: string; items: any[] }) => void;
}

export default function MobileMenuItem({
  title,
  url,
  children = [],
  openInNewTab = false,
  onNavigate,
  onOpenSubmenu,
}: MobileMenuItemProps) {
  const hasChildren = children.length > 0;

  const openSubmenu = () => {
    if (!hasChildren) return;
    onOpenSubmenu?.({ title, items: children });
  };

  const handleParentClick = () => {
    if (url) {
      onNavigate();
      return;
    }

    openSubmenu();
  };

  if (hasChildren) {
    return (
      <li>
        <div className="flex items-center gap-2">
          <Button
            variant="menuItemButton"
            className="hover-emphasis-text inline-flex items-center gap-2 text-left"
            onClick={handleParentClick}
            {...(url
              ? {
                  href: url,
                  target: openInNewTab ? "_blank" : undefined,
                  rel: openInNewTab ? "noopener noreferrer" : undefined,
                }
              : { type: "button" as const })}
          >
            {title}
          </Button>

          <button
            type="button"
            onClick={openSubmenu}
            aria-label={`View submenu for ${title}`}
            className="text-text"
          >
            <Suspense fallback={null}>
              <LazyIcon
                icon="lu:chevron-right"
                size="md"
                className="w-6 h-6"
              />
            </Suspense>
          </button>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Button
        variant="menuItemButton"
        href={url || "#"}
        onClick={onNavigate}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className="hover-emphasis-text"
      >
        {title}
      </Button>
    </li>
  );
}
