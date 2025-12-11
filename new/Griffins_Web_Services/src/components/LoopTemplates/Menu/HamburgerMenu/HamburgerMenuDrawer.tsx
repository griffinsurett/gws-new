// src/components/HamburgerMenuDrawer.tsx
/**
 * Mobile Menu Drawer Template
 *
 * Manages open/close state for mobile menu with checkbox-based hamburger button.
 */

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import MobileMenuItem from "@/components/LoopComponents/Menu/MobileMenuItem";
import HamburgerButton from "../../Menu/HamburgerButton";

interface MobileMenuDrawerProps {
  items: any[];
  className?: string;
  hamburgerTransform?: boolean;
  closeButton?: boolean;
}

interface MenuLevel {
  title: string;
  items: any[];
}

export default function MobileMenuDrawer({
  items,
  className = "",
  hamburgerTransform = true,
  closeButton = false,
}: MobileMenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<MenuLevel[]>(() => [
    { title: "Main Menu", items },
  ]);

  const resetMenuStack = useCallback(() => {
    setMenuStack([{ title: "Main Menu", items }]);
  }, [items]);

  useEffect(() => {
    resetMenuStack();
  }, [resetMenuStack]);

  const toggleMenu = (nextState: boolean) => {
    setIsOpen(nextState);
    if (!nextState) {
      resetMenuStack();
    }
  };

  const handleNavigate = () => {
    toggleMenu(false);
  };

  const handleOpenSubmenu = (title: string, nextItems: any[]) => {
    if (!nextItems?.length) {
      return;
    }

    setMenuStack((prev) => [...prev, { title, items: nextItems }]);
  };

  const handleBack = () => {
    setMenuStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const slideOffset = (menuStack.length - 1) * 100;

  return (
    <>
      {/* Checkbox-based Hamburger Button */}
      <HamburgerButton
        isOpen={isOpen}
        onChange={toggleMenu}
        hamburgerTransform={hamburgerTransform}
        ariaLabel={isOpen ? "Close menu" : "Open menu"}
        id="mobile-menu-toggle"
      />

      {/* Mobile Menu Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => toggleMenu(false)}
        position="center"
        className={`w-full max-w-full h-full hero-gradient-bg p-0 rounded-none transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        overlayClass={`bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        closeButton={closeButton}
        ariaLabel="Mobile navigation menu"
        ssr={false}
      >
        <nav
          className={`${className} h-full w-full flex flex-col justify-center overflow-hidden`}
          aria-label="Mobile navigation"
        >
          <div
            className="inner-section my-auto py-4"
            style={{ maxHeight: "calc(100vh - 6rem)" }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${slideOffset}%)` }}
              >
                {menuStack.map((level, index) => (
                  <div
                    key={`${level.title}-${index}`}
                    className="w-full flex-shrink-0 h-full flex flex-col relative"
                    aria-hidden={index !== menuStack.length - 1}
                  >
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-text hover:underline absolute left-0 top-0"
                        aria-label={`Go back to ${
                          menuStack[index - 1]?.title ?? "previous menu"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                    )}

                    <div
                      className={`flex-1 overflow-y-auto overflow-x-hidden pr-2 ${
                        index > 0 ? "pt-12" : ""
                      }`}
                    >
                      <ul className="menu-item-spacing pb-10">
                        {level.items.map((item) => (
                          <MobileMenuItem
                            key={item.slug || item.id}
                            {...item}
                            onNavigate={handleNavigate}
                            onOpenSubmenu={(submenu) =>
                              handleOpenSubmenu(submenu.title, submenu.items)
                            }
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </Modal>
    </>
  );
}
