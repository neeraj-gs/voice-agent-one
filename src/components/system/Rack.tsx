/**
 * THE SIGNAL ROOM — rack layout
 *
 * The page is not a stack of centred cards. It is a rack: full-bleed
 * horizontal units bolted one under the next, with a fixed spine down the
 * left carrying the channel numbering. The number tells you where you are in
 * the signal path — it is a position, not an ornament, which is why the rail
 * tracks scroll rather than just counting sections.
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Legend } from './primitives';

interface RackEntry {
  id: string;
  n: string;
  label: string;
}

interface RackCtx {
  register: (entry: RackEntry, el: HTMLElement | null) => void;
  active: string | null;
}

const RackContext = createContext<RackCtx | null>(null);

export const Rack: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const [entries, setEntries] = useState<RackEntry[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const nodes = useRef(new Map<string, HTMLElement>());

  const register = React.useCallback((entry: RackEntry, el: HTMLElement | null) => {
    if (!el) {
      nodes.current.delete(entry.id);
      return;
    }
    nodes.current.set(entry.id, el);
    setEntries((prev) => (prev.some((e) => e.id === entry.id) ? prev : [...prev, entry]));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (obs) => {
        // The unit occupying the meter line (40% down the viewport) is the
        // one currently passing through the head.
        const hit = obs
          .filter((o) => o.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] }
    );
    nodes.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries.length]);

  return (
    <RackContext.Provider value={{ register, active }}>
      <div className={cn('relative', className)}>
        <RackRail entries={entries} active={active} />
        <div className="lg:pl-rail">{children}</div>
      </div>
    </RackContext.Provider>
  );
};

/* The spine. Fixed, hairline-separated, hidden below lg where there is no
   room for a gutter — the numbers move inline into each unit's header. */
const RackRail: React.FC<{ entries: RackEntry[]; active: string | null }> = ({
  entries,
  active,
}) => (
  <nav
    aria-label="Signal path"
    className="fixed left-0 top-0 z-40 hidden h-screen w-rail flex-col justify-center border-r border-edge-soft bg-ink lg:flex"
  >
    <div aria-hidden className="knurl absolute inset-x-0 top-0 h-16 border-b border-edge-soft" />

    <ol className="flex flex-col gap-5 px-0 py-8">
      {entries.map((e) => {
        const on = active === e.id;
        return (
          <li key={e.id} className="group relative">
            <a
              href={`#${e.id}`}
              className="flex flex-col items-center gap-1.5 py-1 outline-offset-4"
              aria-current={on ? 'true' : undefined}
            >
              {/* Tick mark grows when the unit is under the head. */}
              <span
                aria-hidden
                className={cn(
                  'block h-px transition-all duration-500 ease-attack',
                  on ? 'w-7 bg-amber' : 'w-3 bg-edge-bright group-hover:w-5 group-hover:bg-bone-faint'
                )}
              />
              <span
                className={cn(
                  'readout text-[10px] transition-colors duration-300',
                  on ? 'text-amber' : 'text-bone-faint group-hover:text-bone-dim'
                )}
              >
                {e.n}
              </span>
            </a>

            {/* Label rides out of the rail on hover. */}
            <span
              className={cn(
                'pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap',
                'border border-edge bg-steel px-2 py-1 legend text-bone-dim',
                'opacity-0 transition-opacity duration-200 group-hover:opacity-100'
              )}
            >
              {e.label}
            </span>
          </li>
        );
      })}
    </ol>

    <div aria-hidden className="vents absolute inset-x-3 bottom-0 h-16 border-t border-edge-soft opacity-40" />
  </nav>
);

/* ── UNIT ──────────────────────────────────────────────────────────────────
   One rack unit. Seam on top, channel mark in the header, content free to be
   asymmetric inside. `bleed` drops the horizontal padding for full-width
   instruments like the spectrogram. */

export const RackUnit: React.FC<{
  id: string;
  n: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  seam?: boolean;
  bleed?: boolean;
}> = ({ id, n, label, children, className, seam = true, bleed }) => {
  const ctx = useContext(RackContext);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ctx?.register({ id, n, label }, ref.current);
    return () => ctx?.register({ id, n, label }, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, n, label]);

  return (
    <section
      id={id}
      ref={ref}
      className={cn('relative scroll-mt-16', seam && 'seam', className)}
      aria-labelledby={`${id}-legend`}
    >
      <div className={cn('mx-auto w-full max-w-[92rem]', !bleed && 'px-5 sm:px-8 lg:px-12')}>
        {/* Unit header: the stencilled channel number and its name. */}
        <header
          className={cn(
            'flex items-center gap-3 pt-8 lg:pt-10',
            bleed && 'px-5 sm:px-8 lg:px-12'
          )}
        >
          <span className="readout text-xs text-amber lg:hidden">{n}</span>
          <span aria-hidden className="h-px w-6 bg-edge lg:w-10" />
          <Legend as="div" className="text-bone-dim" >
            <span id={`${id}-legend`}>{label}</span>
          </Legend>
          <span aria-hidden className="h-px flex-1 bg-edge-soft" />
          <span className="readout hidden text-[10px] text-bone-faint sm:block">
            CH {n}
          </span>
        </header>

        {children}
      </div>
    </section>
  );
};
