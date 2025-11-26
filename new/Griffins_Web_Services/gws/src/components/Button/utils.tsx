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
