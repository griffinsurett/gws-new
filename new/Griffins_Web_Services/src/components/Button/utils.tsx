// src/components/Button/utils.tsx
import { isValidElement, type ReactNode } from 'react';
import Icon from '@/components/Icon';
import type { IconSize } from '@/utils/icons/iconLoader';
import type { ButtonSize } from './Button';

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
  if (typeof icon === 'string') return <Icon icon={icon} size={iconSize} />;
  return null;
}

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-6 py-3 text-base',
  md: 'px-8 py-4 text-lg',
  lg: 'px-10 py-5 text-xl',
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
