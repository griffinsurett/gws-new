import React from 'react';
import { CircleCheckbox } from './CircleCheckbox';
// import Icon from './Icon/Icon';
// import { ReactComponent as SunIcon } from '../assets/icons/sun.svg';
// import { ReactComponent as MoonIcon } from '../assets/icons/moon.svg';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useTheme();

  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      {/* <Icon icon={MoonIcon} className="w-5 h-5" /> */}
      <CircleCheckbox
        checked={isLight}
        onChange={e => setIsLight(e.target.checked)}
        aria-label="Toggle light mode"
      />
      {/* <Icon icon={SunIcon} className="w-5 h-5" /> */}
    </div>
  );
}
