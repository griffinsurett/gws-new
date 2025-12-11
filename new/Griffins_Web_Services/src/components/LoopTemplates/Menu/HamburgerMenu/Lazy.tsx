import { useLazyLoad } from "@/hooks/useLazyLoad.tsx";

interface ContentProps {
  items: any[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  closeButton?: boolean;
}

interface Props {
  items: any[];
  buttonId?: string;
  className?: string;
  closeButton?: boolean;
}

export default function LazyHamburgerMenu({
  items,
  buttonId = "mobile-menu-toggle",
  className = "",
  closeButton = false,
}: Props) {
  const { Component, isOpen, close } = useLazyLoad<ContentProps>(
    () => import("./HamburgerMenuContent"),
    { triggerId: buttonId, toggle: true }
  );

  if (!Component) return null;

  return (
    <Component
      items={items}
      isOpen={isOpen}
      onClose={close}
      className={className}
      closeButton={closeButton}
    />
  );
}
