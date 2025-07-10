import { useState, useEffect } from 'react';
import Icon from './Icon/Icon';
import { CircleCheckbox } from './CircleCheckbox';
// import { SunIcon } from '../assets/astro.svg';
// import { MoonIcon } from '../assets/astro.svg';

export default function ThemeToggle() {
  // initialize from storage or OS (with a log)
  const [isLight, setIsLight] = useState(() => {
    let result = false;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      console.log('[ThemeToggle] localStorage.theme:', stored);
      if (stored === 'light') {
        result = true;
      } else if (stored === 'dark') {
        result = false;
      } else {
        result = window.matchMedia('(prefers-color-scheme: light)').matches;
        console.log('[ThemeToggle] media query prefers light:', result);
      }
    }
    console.log('[ThemeToggle] initial isLight:', result);
    return result;
  });

  // drive the <html data-theme> attribute (with a log)
  useEffect(() => {
    console.log('[ThemeToggle] useEffect triggered, isLight =', isLight);
    const root = document.documentElement;
    if (isLight) {
      console.log('[ThemeToggle] setting data-theme="light"');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    } else {
      console.log('[ThemeToggle] setting data-theme="dark"');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  // log whenever the user toggles it
  const handleChange = (e) => {
    console.log('[ThemeToggle] checkbox onChange, checked =', e.target.checked);
    setIsLight(e.target.checked);
  };

  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      {/* <Icon icon={MoonIcon} className="w-5 h-5" /> */}
      <CircleCheckbox
        checked={isLight}
        onChange={handleChange}
        aria-label="Toggle light mode"
      />
      {/* <Icon icon={SunIcon} className="w-5 h-5" /> */}
    </div>
  );
}
