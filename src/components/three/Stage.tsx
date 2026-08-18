/**
 * Canvas host.
 *
 * Every 3D surface in the app mounts through here so the fallback rules live
 * in one place: no WebGL, reduced motion, or a device that can't afford it,
 * and the visitor still gets a composed frame rather than a hole in the page.
 *
 * The renderer is loaded lazily. Nothing three.js-shaped is imported at module
 * scope, which keeps ~600 kB out of the first paint for anyone who never
 * reaches a 3D surface.
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

const StageCanvas = lazy(() => import('./StageCanvas'));

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
};

export const Stage: React.FC<{
  children: React.ReactNode;
  className?: string;
  /** Shown while the renderer loads and if 3D can't run at all. */
  fallback?: React.ReactNode;
  /** Passed straight through to the Canvas once it loads. */
  camera?: { position: [number, number, number]; fov?: number };
}> = ({ children, className, fallback = null, camera }) => {
  const [ready, setReady] = useState<boolean | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => setReady(hasWebGL()), []);

  if (ready === false) return <>{fallback}</>;

  return (
    <div className={cn('relative', className)}>
      {ready ? (
        <Suspense fallback={fallback}>
          <StageCanvas reduced={reduced} camera={camera}>
            {children}
          </StageCanvas>
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};
