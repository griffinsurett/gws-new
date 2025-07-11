// src/components/Menu/HamburgerMenu/HamburgerIcon.jsx
import React, { useState, useEffect } from "react";

export default function HamburgerIcon({
  checkboxId,
  className = "",
}) {
  const [open, setOpen] = useState(false);

  // keep React state in sync with the hidden checkbox
  useEffect(() => {
    const box = document.getElementById(checkboxId);
    if (!box) return;
    const sync = () => setOpen(box.checked);
    box.addEventListener("change", sync);
    sync();
    return () => box.removeEventListener("change", sync);
  }, [checkboxId]);

  return (
    <div
      className={`
        relative w-5 h-4 md:w-6 md:h-5 cursor-pointer
        flex flex-col justify-between items-start
        group ${className}
      `}
    >
      {/* Top bar */}
      <span
        className={`
          block h-[1px] bg-current transition-all duration-300
          ${open
            ? "absolute top-1/2 transform -translate-y-1/2 rotate-45 w-full"
            : "w-full"}
        `}
      />

      {/* Middle bar */}
      <span
        className={`
          block h-[1px] bg-current transition-all duration-300
          ${open
            ? "opacity-0 w-full"
            : "w-3 group-hover:w-full"}
        `}
      />

      {/* Bottom bar */}
      <span
        className={`
          block h-[1px] bg-current transition-all duration-300
          ${open
            ? "absolute top-1/2 transform -translate-y-1/2 -rotate-45 w-full"
            : "w-full"}
        `}
      />
    </div>
  );
}
