// src/components/ThemeToggle/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import Icon from './Icon/Icon';
import { CircleCheckbox } from './CircleCheckbox';
import { ReactComponent as SunIcon } from '../assets/astro.svg';
import { ReactComponent as MoonIcon } from '../assets/astro.svg';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === 'undefined') return false; 
    const stored = localStorage.getItem('theme');
    if (stored === 'light') return true;
    if (stored === 'dark')  return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <Icon icon={MoonIcon} className="w-5 h-5" />
      <CircleCheckbox
        checked={isLight}
        onChange={e => setIsLight(e.target.checked)}
        aria-label="Toggle light mode"
      />
      <Icon icon={SunIcon} className="w-5 h-5" />
    </div>
  );
}
