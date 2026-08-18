/**
 * The instrument.
 *
 * 3D terrain inside, graticule and readouts outside. The axes, the dB scale
 * and the source label are DOM, not textures — an analyser's labelling has to
 * be crisp at any zoom, and it keeps the canvas doing only what a canvas is
 * good at.
 */

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Stage, usePrefersReducedMotion } from './Stage';
import { signal } from '../../lib/audio';
import { Legend, Lamp } from '../system/primitives';
import { cn } from '../../utils/cn';

const SpectrogramField = lazy(() => import('./SpectrogramField'));

/** Mel-spaced ruling, labelled at the frequencies a voice actually lives in. */
const FREQ_TICKS = ['8k', '4k', '2k', '1k', '500', '250', '120'];

export const SignalDisplay: React.FC<{
  className?: string;
  /** Smaller grids and no mic key when the display is a supporting element. */
  compact?: boolean;
  /** Level 0–1 from an external source, e.g. a live agent call. */
  externalLevel?: number;
  caption?: string;
}> = ({ className, compact = false, externalLevel, caption }) => {
  const reduced = usePrefersReducedMotion();
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLSpanElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setNarrow(mq.matches);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Meter is driven straight from the signal each frame — putting it through
  // React state would cost a render per frame for a number that changes 60×/s.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      const v = externalLevel ?? signal.level;
      if (levelRef.current) levelRef.current.style.transform = `scaleX(${Math.min(1, v)})`;
      if (dbRef.current) {
        const db = v <= 0.001 ? -60 : Math.max(-60, 20 * Math.log10(v));
        dbRef.current.textContent = `${db > -1 ? '' : ''}${db.toFixed(1)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, externalLevel]);

  const toggleMic = useCallback(async () => {
    if (listening) {
      signal.detach();
      setListening(false);
      return;
    }
    const ok = await signal.attachMic();
    setListening(ok);
    setMicError(ok ? null : signal.error);
  }, [listening]);

  return (
    <figure className={cn('flex flex-col', className)}>
      <div className="recess relative flex-1 overflow-hidden">
      {/* ── CANVAS ── */}
      <Stage
        className="absolute inset-0"
        // A portrait viewport shows more sky than terrain at the wide framing,
        // so a narrow screen gets a closer, lower camera.
        camera={{ position: narrow ? [0, 1.95, 5.5] : [0, 2.4, 6.4], fov: narrow ? 40 : 36 }}
        fallback={
          <div className="ticks-y absolute inset-0 opacity-30" aria-hidden />
        }
      >
        <Suspense fallback={null}>
          <SpectrogramField
            cols={narrow ? 72 : 140}
            gain={compact ? 0.9 : 1.2}
            parallax={compact ? 0.4 : 1}
            frozen={reduced}
            home={narrow ? [0, 1.95, 5.5] : [0, 2.4, 6.4]}
          />
        </Suspense>
      </Stage>

      {/* ── GRATICULE ──
          Ruling lines over the display, the way a scope has an etched screen. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="ticks-x absolute inset-0 opacity-[0.07]" />
        {/* Scrims keep the ruled axes legible where the terrain runs bright
            underneath them. They read as the bezel vignette of a screen. */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent opacity-90" />
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-ink to-transparent opacity-90" />
      </div>

      {/* ── FREQUENCY AXIS ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-3 top-12 hidden flex-col justify-between sm:flex"
        style={{ height: '52%' }}
      >
        {FREQ_TICKS.map((f) => (
          <div key={f} className="flex items-center gap-1.5">
            <span className="h-px w-2 bg-edge-bright" />
            <span className="readout text-[9px] text-bone-faint">{f}</span>
          </div>
        ))}
        <span className="readout ml-3 text-[9px] tracking-[0.2em] text-bone-faint">Hz</span>
      </div>

      {/* ── SOURCE + TIME ── */}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lamp state={listening ? 'live' : 'ready'} pulse={listening} />
          <Legend className={listening ? 'text-amber' : 'text-bone-dim'}>
            {listening ? 'Source · your microphone' : 'Source · speech model'}
          </Legend>
        </div>
        <span className="readout hidden text-[10px] text-bone-faint sm:block">
          {compact ? '2.0s' : '3.1s'} window
        </span>
      </div>

        {/* ── TIME AXIS ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 bottom-3 hidden items-center justify-between sm:flex"
        >
          {['−3.0', '−2.0', '−1.0', 'now'].map((t) => (
            <span
              key={t}
              className={cn('readout text-[9px]', t === 'now' ? 'text-amber' : 'text-bone-faint')}
            >
              {t}
              {t !== 'now' && 's'}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRANSPORT ──
          Outside the glass. Controls belong on the panel, not on the screen. */}
      <figcaption className="mt-3 flex flex-col items-start justify-between gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2.5">
          <Legend>Level</Legend>
          <div className="relative h-1.5 w-32 overflow-hidden rounded-panel bg-ink-lift shadow-recess sm:w-40">
            <div
              ref={levelRef}
              className="h-full origin-left bg-amber transition-transform duration-75 ease-release"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <span className="readout text-[10px] text-bone-faint">
            <span ref={dbRef}>−60</span> dB
          </span>
        </div>

        {!compact && (
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
            {micError ? (
              <p className="font-mono text-[10px] leading-snug text-clip">{micError}</p>
            ) : (
              caption && (
                <p className="hidden max-w-sm text-[12.5px] leading-snug text-bone-faint lg:block">
                  {caption}
                </p>
              )
            )}
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              className={cn(
                'inline-flex shrink-0 items-center gap-2.5 rounded-panel border px-3.5 py-2',
                'font-mono text-[10px] uppercase tracking-[0.18em] shadow-bevel',
                'transition-colors duration-200 active:translate-y-px',
                listening
                  ? 'border-clip-deep bg-clip/15 text-clip'
                  : 'border-edge-bright bg-steel-high text-bone hover:border-amber hover:text-amber'
              )}
            >
              {listening ? <MicOff size={13} strokeWidth={2} /> : <Mic size={13} strokeWidth={2} />}
              {listening ? 'Stop listening' : 'Speak into it'}
            </button>
          </div>
        )}
      </figcaption>
    </figure>
  );
};
