import React from 'react';

export function CircleCheckbox({ checked, className=
        "border-bg2 bg-bg2",
        onChange, label, ...props }) {
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
        className={`${className} border-2 w-6 h-6 md:w-8 md:h-8 rounded-full peer-checked:border-primary peer-checked:bg-primary transition-all`}
      />
    </label>
  );
}
