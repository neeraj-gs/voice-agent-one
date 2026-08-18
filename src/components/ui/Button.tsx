/**
 * Panel key.
 *
 * Buttons on real gear are labelled in condensed mono caps and they move when
 * you press them. Primary is the amber signal key; secondary is a bare metal
 * key; outline is an unlit key; ghost is a legend that happens to be clickable.
 *
 * `brand` opts a key into the customer business's own colour — used only on
 * generated customer sites, never on the product surfaces.
 */

import React from 'react';
import { cn } from '../../utils/cn';
import { useBranding } from '../../stores/configStore';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  brand?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  brand = false,
  children,
  className,
  disabled,
  style,
  ...props
}) => {
  const branding = useBranding();

  const base = cn(
    'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden',
    'rounded-panel border font-mono text-[11px] font-medium uppercase tracking-[0.16em]',
    'transition-all duration-200 ease-attack',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:translate-y-px'
  );

  const sizes = {
    sm: 'h-8 px-3',
    md: 'h-10 px-5',
    lg: 'h-12 px-7 text-xs',
  };

  const variants = {
    primary:
      'border-amber-deep bg-amber text-ink shadow-bevel hover:bg-amber-glow active:shadow-recess',
    secondary:
      'border-edge-bright bg-steel-high text-bone shadow-bevel hover:border-patina hover:text-patina-glow active:shadow-recess',
    outline:
      'border-edge-bright bg-transparent text-bone hover:border-amber hover:text-amber',
    ghost:
      'border-transparent bg-transparent text-bone-dim hover:bg-steel-lift hover:text-bone',
    danger:
      'border-clip-deep bg-clip text-ink shadow-bevel hover:bg-clip/85 active:shadow-recess',
  };

  // Customer-site keys wear the business's colour instead of the amber signal.
  const brandStyle: React.CSSProperties =
    brand && branding
      ? variant === 'primary'
        ? { backgroundColor: branding.primaryColor, borderColor: branding.primaryColor, color: '#0A0B0D' }
        : variant === 'outline'
        ? { borderColor: branding.primaryColor, color: branding.primaryColor }
        : {}
      : {};

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      style={{ ...brandStyle, ...style }}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      <span className={cn('inline-flex items-center gap-2', isLoading && 'opacity-45')}>
        {children}
      </span>

      {/* Work in progress reads as a signal sweeping the key's bottom edge —
          the same way a transport shows it is running. */}
      {isLoading && (
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <span className="absolute inset-y-0 w-1/3 animate-trace-sweep bg-current opacity-90" />
        </span>
      )}
    </button>
  );
};
