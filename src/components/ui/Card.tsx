/**
 * Panel module.
 *
 * The old Card was a rounded white box with a soft shadow — the single most
 * generic object in web design. This is a module bolted into a rack: square
 * corners, a milled bevel, a hairline seam under the header. It lifts on hover
 * only if it is actually actionable.
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  /** Raises the module out of the rack face. */
  lift?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  lift = false,
  onClick,
  ...rest
}) => {
  const interactive = hover || Boolean(onClick);

  return (
    <div
      className={cn(
        lift ? 'panel-lift' : 'panel',
        interactive && [
          'cursor-pointer transition-[border-color,transform,box-shadow] duration-200 ease-attack',
          'hover:-translate-y-0.5 hover:border-edge-bright',
          'focus-visible:-translate-y-0.5 focus-visible:border-amber',
        ],
        className
      )}
      onClick={onClick}
      {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }} : {})}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('border-b border-edge-soft px-5 py-3.5', className)}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('p-5', className)}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('border-t border-edge-soft bg-ink-lift px-5 py-3.5', className)}>
    {children}
  </div>
);
