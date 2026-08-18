/**
 * The capsule, mounted.
 *
 * 3D membrane inside, state legend and level outside. Used on both the
 * operator's call page and the public one, so a caller and an owner are
 * looking at the same instrument.
 */

import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Stage, usePrefersReducedMotion } from './Stage';
import type { DiaphragmMode } from './Diaphragm';
import { Legend, Lamp } from '../system/primitives';
import { cn } from '../../utils/cn';

const Diaphragm = lazy(() => import('./Diaphragm'));

const LABEL: Record<DiaphragmMode, string> = {
  idle: 'Standing by',
  connecting: 'Opening the line',
  listening: 'Listening',
  speaking: 'Speaking',
};

const LAMP: Record<DiaphragmMode, 'off' | 'ready' | 'live'> = {
  idle: 'off',
  connecting: 'ready',
  listening: 'ready',
  speaking: 'live',
};

export const CapsuleDisplay: React.FC<{
  mode: DiaphragmMode;
  levelRef: React.MutableRefObject<number>;
  /** Agent name, shown under the capsule. */
  name?: string;
  /** mm:ss, shown once the line is open. */
  elapsed?: string | null;
  className?: string;
  /** Tint the ring with the customer business's colour on generated sites. */
  accent?: string;
}> = ({ mode, levelRef, name, elapsed, className, accent }) => {
  const reduced = usePrefersReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);

  // Level is read straight from the ref each frame; routing it through state
  // would re-render this tree sixty times a second for one CSS transform.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, levelRef.current)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, levelRef]);

  return (
    <figure className={cn('flex flex-col items-center', className)}>
      <div className="recess relative aspect-square w-full max-w-[22rem] overflow-hidden">
        <Stage
          className="absolute inset-0"
          camera={{ position: [0, 0.3, 3.5], fov: 42 }}
          fallback={
            <div
              aria-hidden
              className="absolute inset-[18%] rounded-jack border border-edge-bright"
              style={accent ? { borderColor: accent } : undefined}
            />
          }
        >
          <Suspense fallback={null}>
            <Diaphragm mode={mode} levelRef={levelRef} frozen={reduced} />
          </Suspense>
        </Stage>

        {/* Corner registration marks — how a capsule is indexed in its shell. */}
        <div aria-hidden className="pointer-events-none absolute inset-2">
          {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map(
            (p) => (
              <span key={p} className={cn('absolute h-3 w-3 border-edge-bright', p)} />
            )
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lamp state={LAMP[mode]} pulse={mode === 'speaking' || mode === 'connecting'} />
            <Legend className={mode === 'speaking' ? 'text-amber' : 'text-bone-dim'}>
              {LABEL[mode]}
            </Legend>
          </span>
          {elapsed && <span className="readout text-[11px] text-bone-dim">{elapsed}</span>}
        </div>
      </div>

      <figcaption className="mt-4 flex w-full max-w-[22rem] items-center gap-3">
        <Legend>Level</Legend>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-panel bg-ink shadow-recess">
          <div
            ref={barRef}
            className="h-full origin-left bg-amber transition-transform duration-75 ease-release"
            style={{ transform: 'scaleX(0)', ...(accent ? { backgroundColor: accent } : {}) }}
          />
        </div>
        {name && <span className="readout text-[10px] text-bone-faint">{name}</span>}
      </figcaption>
    </figure>
  );
};
