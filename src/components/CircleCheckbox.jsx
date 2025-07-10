import React from 'react';

export function CircleCheckbox({ checked, onChange, label, ...props }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      {/* 1. Visually hide the real checkbox but keep it accessible */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        aria-label={label}
        {...props}
      />

      {/* 2. The visible circle */}
      <span
        className="
          w-8 h-8            
          rounded-full     
          border-2
          border-bg2            
          bg-bg2
          peer-checked:border-primary
          peer-checked:bg-primary
          transition-all  
        "
      />
    </label>
  );
}
