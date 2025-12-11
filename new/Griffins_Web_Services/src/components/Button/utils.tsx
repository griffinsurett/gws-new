// src/components/Button/utils.tsx
import { isValidElement, lazy, Suspense, type ReactNode } from 'react';
import type { IconSize } from '@/utils/icons/iconLoader';
import type { ButtonSize } from './Button';

// Lazy load Icon to prevent icons chunk from loading until actually needed
// This breaks the dependency chain so buttons without icons don't pull in the icons chunk
const LazyIcon = lazy(() => import('@/components/Icon'));

function mapButtonSizeToIconSize(size?: ButtonSize): IconSize {
  return size ?? 'md';
}

export function renderButtonIcon(
  icon: string | ReactNode | undefined,
  size?: ButtonSize
): ReactNode {
  if (!icon) return null;

  const iconSize = mapButtonSizeToIconSize(size);
  if (isValidElement(icon)) return icon;
  if (typeof icon === 'string') {
    return (
      <Suspense fallback={null}>
        <LazyIcon icon={icon} size={iconSize} />
      </Suspense>
    );
  }
  return null;
}

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export function getButtonBaseClasses(size?: ButtonSize): string {
  const normalizedSize = size ?? 'md';

  return [
    'inline-flex items-center justify-center gap-2',
    'rounded-full font-semibold',
    'h4',
    'shadow-accent/30',
    'button-style',
    'button-transition',
    'button-hover-transition',
    'focus-visible:outline-none',
    'w-full lg:w-auto',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    BUTTON_SIZE_CLASSES[normalizedSize],
  ]
    .filter(Boolean)
    .join(' ');
}
