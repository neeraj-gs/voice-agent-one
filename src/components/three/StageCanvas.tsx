/**
 * The Canvas itself, isolated in its own module.
 *
 * Everything three.js touches lives behind this file so it can be code-split
 * out of the main bundle — a visitor who never sees a 3D surface should never
 * download the renderer.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { Props as CanvasProps } from '@react-three/fiber';

const StageCanvas: React.FC<
  { children: React.ReactNode; reduced: boolean } & Partial<CanvasProps>
> = ({ children, reduced, ...canvasProps }) => (
  <Canvas
    dpr={[1, 1.75]}
    gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
    // Stillness means one composed frame, not a frozen animation loop.
    frameloop={reduced ? 'demand' : 'always'}
    {...canvasProps}
  >
    <Suspense fallback={null}>{children}</Suspense>
  </Canvas>
);

export default StageCanvas;
