/**
 * THE SIGNAL ROOM — panel primitives
 *
 * These are the parts a rack unit is built from. They are deliberately dumb:
 * a Lamp only knows how to be lit, a Meter only knows how to point at a
 * number. Meaning is assembled at the page level.
 */

import React from 'react';
import { cn } from '../../utils/cn';

/* ── LEGEND ────────────────────────────────────────────────────────────────
   The silkscreened label. Sits above or beside a control, never inside it. */

export const Legend: React.FC<{
  children: React.ReactNode;
  className?: string;
  live?: boolean;
  as?: 'span' | 'div' | 'p';
}> = ({ children, className, live, as: Tag = 'span' }) => (
  <Tag className={cn(live ? 'legend-live' : 'legend', className)}>{children}</Tag>
);

/* ── LAMP ──────────────────────────────────────────────────────────────────
   Four states, matching real gear: dark, ready (green), signal (amber),
   over (red). A lamp is never lit for decoration. */

export type LampState = 'off' | 'ready' | 'live' | 'clip';

export const Lamp: React.FC<{ state?: LampState; className?: string; pulse?: boolean }> = ({
  state = 'off',
  className,
  pulse,
}) => (
  <span
    aria-hidden
    className={cn(
      'lamp shrink-0',
      state === 'ready' && 'lamp-ready',
      state === 'live' && 'lamp-on',
      state === 'clip' && 'lamp-clip',
      pulse && state !== 'off' && 'animate-lamp-flicker',
      className
    )}
  />
);

/* ── PANEL ─────────────────────────────────────────────────────────────────
   A milled face. `lift` raises it one step out of the rack. */

export const Panel: React.FC<{
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  lift,
  as: Tag = 'div',
  ...rest
}) => (
  <Tag className={cn(lift ? 'panel-lift' : 'panel', className)} {...rest}>
    {children}
  </Tag>
);

/** A cut-out in the panel. Displays and inputs sit down inside these. */
export const Recess: React.FC<
  { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div className={cn('recess', className)} {...rest}>
    {children}
  </div>
);

/* ── SCREW ─────────────────────────────────────────────────────────────────
   Rack ears. Used only at the true corners of a unit, four per face, the way
   a real one is bolted in. */

export const Screw: React.FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden
    className={cn(
      'block h-1.5 w-1.5 rounded-jack bg-edge-bright/60',
      'shadow-[inset_0_1px_0_rgba(0,0,0,0.9)]',
      className
    )}
  />
);

/* ── READOUT ───────────────────────────────────────────────────────────────
   A number a machine printed. Always tabular so digits don't jitter. */

export const Readout: React.FC<{
  value: React.ReactNode;
  unit?: string;
  label?: string;
  tone?: 'bone' | 'amber' | 'patina' | 'clip';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ value, unit, label, tone = 'bone', size = 'md', className }) => {
  const toneClass = {
    bone: 'text-bone',
    amber: 'text-amber',
    patina: 'text-patina-glow',
    clip: 'text-clip',
  }[tone];

  const sizeClass = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl md:text-6xl',
  }[size];

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Legend>{label}</Legend>}
      <div className={cn('readout leading-none', sizeClass, toneClass)}>
        {value}
        {unit && <span className="ml-1 text-[0.5em] text-bone-faint">{unit}</span>}
      </div>
    </div>
  );
};

/* ── METER ─────────────────────────────────────────────────────────────────
   A horizontal bargraph on a real dB scale, segmented like an LED ladder.
   Green below -6, amber to -1, red at 0 and above. */

export const Meter: React.FC<{
  /** 0..1 */
  value: number;
  label?: string;
  segments?: number;
  className?: string;
  showScale?: boolean;
}> = ({ value, label, segments = 24, className, showScale }) => {
  const lit = Math.round(Math.min(Math.max(value, 0), 1) * segments);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Legend>{label}</Legend>}
      <div className="recess flex h-3 items-stretch gap-px p-px" role="presentation">
        {Array.from({ length: segments }, (_, i) => {
          const ratio = (i + 1) / segments;
          const on = i < lit;
          return (
            <span
              key={i}
              className={cn(
                'flex-1 transition-opacity duration-150',
                on ? 'opacity-100' : 'opacity-[0.14]',
                ratio > 0.92
                  ? 'bg-clip'
                  : ratio > 0.74
                  ? 'bg-amber'
                  : 'bg-patina'
              )}
            />
          );
        })}
      </div>
      {showScale && (
        <div className="flex justify-between font-mono text-[9px] tracking-widest text-bone-faint">
          <span>-40</span>
          <span>-20</span>
          <span>-10</span>
          <span>-6</span>
          <span>-3</span>
          <span className="text-clip/70">0</span>
        </div>
      )}
    </div>
  );
};

/* ── SEAM ──────────────────────────────────────────────────────────────────
   Where two rack units meet. */

export const Seam: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden className={cn('seam h-0 w-full', className)} />
);

/* ── TAG ───────────────────────────────────────────────────────────────────
   A stamped status chip. Square corners — this is a punched label, not a pill. */

export const Tag: React.FC<{
  children: React.ReactNode;
  tone?: 'neutral' | 'live' | 'ready' | 'clip';
  className?: string;
}> = ({ children, tone = 'neutral', className }) => {
  const tones = {
    neutral: 'border-edge text-bone-dim',
    live: 'border-amber/40 text-amber',
    ready: 'border-patina/40 text-patina-glow',
    clip: 'border-clip/40 text-clip',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

/* ── CHANNEL STRIP ─────────────────────────────────────────────────────────
   Numbered spine that runs down the left of every rack unit. The number is
   real information — it is the section's position in the signal path. */

export const ChannelMark: React.FC<{ n: string; label?: string; className?: string }> = ({
  n,
  label,
  className,
}) => (
  <div className={cn('flex items-center gap-3', className)}>
    <span className="readout text-xs text-amber">{n}</span>
    <span aria-hidden className="h-px w-8 bg-edge" />
    {label && <Legend>{label}</Legend>}
  </div>
);
