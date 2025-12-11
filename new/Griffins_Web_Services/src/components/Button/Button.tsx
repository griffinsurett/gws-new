// src/components/Button/Button.tsx
/**
 * Button Component System
 * 
 * Polymorphic button component that renders as either <button> or <a> based on props.
 * Supports multiple variants (primary, secondary, ghost, link) with consistent API.
 * Uses TypeScript discriminated unions for type safety between button and link modes.
 */

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import PrimaryButton from './variants/PrimaryButton';
import SecondaryButton from './variants/SecondaryButton';
import GhostButton from './variants/GhostButton';
import LinkButton from './variants/LinkButton';
import TertiaryButton from './variants/TertiaryButton';
import ArrowLinkButton from './variants/ArrowLinkButton';
import MenuItemButton from './variants/MenuItemButton';

/**
 * Base props shared by all button variants
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  leftIcon?: string | ReactNode;   // Icon before text
  rightIcon?: string | ReactNode;  // Icon after text
  size?: ButtonSize;       // Button size
  children: ReactNode;              // Button text/content
  className?: string;               // Additional CSS classes
  /** Optional classes for wrapper spans used by certain variants */
  buttonWrapperClasses?: string;
  /** Forces the variant wrapper to span full width when supported */
  fullWidth?: boolean;
  /**
   * Internal escape hatch that allows variant components to opt-out of the
   * default btn-base styling when they need full control over the shell.
   */
  unstyled?: boolean;
  /**
   * Allows variants to opt-out of their entrance animations (primary uses this).
   */
  animated?: boolean;
}

/**
 * Button rendered as <button> - href must not be present
 */
type ButtonAsButton = BaseButtonProps & 
  ButtonHTMLAttributes<HTMLButtonElement> & 
  { href?: never };

/**
 * Button rendered as <a> - href is required
 */
type ButtonAsLink = BaseButtonProps & 
  AnchorHTMLAttributes<HTMLAnchorElement> & 
  { href: string };

/**
 * Discriminated union ensures type safety based on presence of href
 */
export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Base component that handles rendering as button or anchor
 * Avoids React hooks so it can be SSR-only when needed.
 */
export const ButtonBase = ({
  href,
  className = '',
  buttonWrapperClasses: _buttonWrapperClasses,
  fullWidth: _fullWidth,
  leftIcon,
  rightIcon,
  size = 'lg',
  children,
  unstyled = false,
  animated: _animated,
  ...props
}: ButtonProps) => {
  const normalizedSize = size ?? 'lg';
  const sizeClass =
    normalizedSize === 'sm'
      ? 'btn-sm'
      : normalizedSize === 'lg'
      ? 'btn-lg'
      : 'btn-md';
  const baseClasses = unstyled
    ? className.trim()
    : `btn-base ${sizeClass} ${className}`.trim();

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={baseClasses} {...anchorProps}>
        {leftIcon}
        {children}
        {rightIcon}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type ?? 'button'} className={baseClasses} {...buttonProps}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

/**
 * Map of variant names to their component implementations
 */
const VARIANT_MAP = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  ghost: GhostButton,
  link: LinkButton,
  menuItemButton: MenuItemButton,
  tertiary: TertiaryButton,
  arrowLink: ArrowLinkButton,
};

export type ButtonVariant = keyof typeof VARIANT_MAP;

/**
 * Props for the main Button component including variant selection
 */
export type ButtonComponentProps = ButtonProps & {
  variant?: ButtonVariant;
};

/**
 * Main Button component - delegates to variant components
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 * <Button variant="secondary" href="/about">Learn more</Button>
 */
export default function Button({ 
  variant = 'primary',
  ...props 
}: ButtonComponentProps) {
  const VariantComponent = VARIANT_MAP[variant] || PrimaryButton;
  return <VariantComponent {...props} />;
}
