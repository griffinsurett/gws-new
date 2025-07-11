// src/components/AccentPicker.jsx
import { useState } from 'react';
import { CircleCheckbox } from './CircleCheckbox';
import Modal from './Modal';
import { useAccentColor } from '../hooks/useAccentColor';

export default function AccentPicker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accent, setAccent, accents] = useAccentColor();

  return (
    <>
      <CircleCheckbox
        checked={modalOpen}
        onChange={() => setModalOpen(open => !open)}
        aria-label="Pick accent color"
        className='border-accent bg-accent'
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}

        /* --------- Overrides --------- */
        /* semi-transparent black backdrop (optional) */
        overlayClass="bg-bg/50"

        /* make the panel itself fully transparent, no padding, no shadow */
        className="bg-bg w-60 h-auto p-[var(--spacing-sm)] shadow-none"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-text)]">
          Choose an accent
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {accents.map(color => (
            <label key={color} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="accent"
                value={color}
                checked={accent === color}
                onChange={() => setAccent(color)}
                className="sr-only peer"
              />
              <span
                className={`
                    w-8 h-8 rounded border-2
                    peer-checked:border-[var(--color-text)]
                    ${accent === color 
                       ? 'border-[var(--color-text)]' 
                       : 'border-neutral'
                    }
                  `}
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
