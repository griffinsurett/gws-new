// src/components/AccentPicker.jsx
import { useState, useRef, useEffect } from 'react';
import { useAccentColor } from '../hooks/useAccentColor';
import { CircleCheckbox } from './CircleCheckbox';
import { SquareCheckbox } from './SquareCheckbox';

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent, accents] = useAccentColor();
  const containerRef = useRef(null);

  // Close if clicked outside
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative contents">
      {/* trigger */}
      <CircleCheckbox
        checked={open}
        onChange={() => setOpen(o => !o)}
        aria-label="Pick accent color"
        className='border-accent bg-accent'
      />

      {/* dropdown panel */}
      {open && (
        <div
          className="
            absolute top-full mt-2 left-0
            bg-[var(--color-bg2)] rounded-xl p-3
            flex space-x-3 overflow-x-auto hide-scrollbar
            shadow-lg z-50
          "
        >
         {accents.map(color => (
            <SquareCheckbox
              key={color}
              color={color}
              checked={accent === color}
              onChange={() => {
                setAccent(color);
                setOpen(false);
              }}
            />
         ))}
        </div>
      )}
    </div>
  );
}
