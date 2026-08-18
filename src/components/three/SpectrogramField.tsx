/**
 * THE SPECTROGRAM FIELD — the signature.
 *
 * A waterfall spectrogram is what anyone who actually works on speech stares
 * at all day: frequency across one axis, time across the other, energy as
 * brightness. This one extrudes energy into the third dimension, so the
 * formant bands of a voice become ridges in a landscape scrolling toward you.
 *
 * It is not an ambient shape. Every peak is a real number: the mel-band
 * magnitude of whatever the source is saying. Click the key in the hero and
 * the source becomes your own microphone — the terrain is then literally your
 * voice, which is the whole argument the page is making.
 */

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BIN_COUNT, signal } from '../../lib/audio';

/* ── COLOUR RAMP ───────────────────────────────────────────────────────────
   Cold floor → verdigris → amber → hot bone. The palette's own colours used
   as a heat map, so the display never introduces a hue the rack doesn't have. */

const STOPS: [number, string][] = [
  [0.0, '#0B0F14'],
  [0.16, '#14312E'],
  [0.34, '#235A50'],
  [0.55, '#B96D14'],
  [0.76, '#FF9D2E'],
  [1.0, '#FFDCAE'],
];

// Vertex colours bypass three's colour management, so convert to linear here.
const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const RAMP = STOPS.map(([at, hex]) => {
  const n = parseInt(hex.slice(1), 16);
  return {
    at,
    r: srgbToLinear(((n >> 16) & 255) / 255),
    g: srgbToLinear(((n >> 8) & 255) / 255),
    b: srgbToLinear((n & 255) / 255),
  };
});

function rampAt(v: number, out: [number, number, number]) {
  const t = v <= 0 ? 0 : v >= 1 ? 1 : v;
  let i = 1;
  while (i < RAMP.length - 1 && RAMP[i].at < t) i++;
  const a = RAMP[i - 1];
  const b = RAMP[i];
  const k = (t - a.at) / (b.at - a.at || 1);
  out[0] = a.r + (b.r - a.r) * k;
  out[1] = a.g + (b.g - a.g) * k;
  out[2] = a.b + (b.b - a.b) * k;
}

/* ── FIELD ─────────────────────────────────────────────────────────────────*/

interface FieldProps {
  /** Time slices held on screen. Fewer on small screens. */
  cols?: number;
  /** How tall a full-scale bin stands. */
  gain?: number;
  /** Pointer parallax strength, 0 disables. */
  parallax?: number;
  /** Held still for reduced-motion visitors. */
  frozen?: boolean;
  /** Camera rest position. Parallax damps back to this. */
  home?: [number, number, number];
}

// Sized so the whole window — including the "now" edge where new time enters
// — sits inside the frame at the camera distance below.
const WIDTH = 6.4; // time axis
const DEPTH = 5.0; // frequency axis

export const SpectrogramField: React.FC<FieldProps> = ({
  cols = 140,
  gain = 1.2,
  parallax = 1,
  frozen = false,
  home = [0, 2.4, 6.4],
}) => {
  const ROWS = BIN_COUNT;
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef(0);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(WIDTH, DEPTH, cols - 1, ROWS - 1);
    g.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(cols * ROWS * 3), 3)
    );
    return g;
  }, [cols, ROWS]);

  // Ring buffer of magnitudes: [column][row]. Seeded with a couple of seconds
  // of the speech model so the very first painted frame is already a landscape
  // rather than a flat plate that grows in.
  const history = useMemo(() => {
    const buf = new Float32Array(cols * ROWS);
    for (let c = 0; c < cols; c++) {
      signal.update(c / 45);
      for (let r = 0; r < ROWS; r++) buf[c * ROWS + r] = signal.bins[r];
    }
    return buf;
  }, [cols, ROWS]);

  const rgb = useMemo<[number, number, number]>(() => [0, 0, 0], []);

  // Write the ring buffer into the plane's vertices. Local +Z becomes world up
  // once the mesh is laid flat, so height goes into Z.
  const paint = () => {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const col = geometry.attributes.color as THREE.BufferAttribute;
    const head = headRef.current;

    for (let iy = 0; iy < ROWS; iy++) {
      // Row 0 of the plane sits farthest from camera; put high frequencies
      // there and low frequencies near, matching a bench analyser.
      const bin = ROWS - 1 - iy;
      for (let ix = 0; ix < cols; ix++) {
        const c = (head + 1 + ix) % cols;
        const v = history[c * ROWS + bin];

        // Slight compression: quiet detail stays visible without the loud
        // bands blowing out into a plateau.
        const h = Math.pow(v, 0.78) * gain;
        const i = iy * cols + ix;
        pos.setZ(i, h);

        rampAt(Math.pow(v, 0.85), rgb);
        col.setXYZ(i, rgb[0], rgb[1], rgb[2]);
      }
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  // Seed the first frame.
  useMemo(() => paint(), [geometry]);

  const clock = useRef(0);

  useFrame((state, delta) => {
    if (!frozen) {
      clock.current += Math.min(delta, 0.05);
      signal.update(clock.current);

      // Advance one time slice and write the newest column at the head.
      headRef.current = (headRef.current + 1) % cols;
      const head = headRef.current;
      for (let r = 0; r < ROWS; r++) history[head * ROWS + r] = signal.bins[r];

      paint();
    }

    if (parallax > 0) {
      // The rack leans a little as you move across it. Small, damped, and it
      // settles — this is a heavy object, not a floating one.
      const px = state.pointer.x * 0.5 * parallax;
      const py = state.pointer.y * 0.28 * parallax;
      camera.position.x += (home[0] + px - camera.position.x) * 0.045;
      camera.position.y += (home[1] - py - camera.position.y) * 0.045;
      // Aimed ~26° below horizontal so the terrain fills the frame and the
      // fogged far edge sits about a third down from the top.
      camera.lookAt(0, -0.5, 0.5);
    }
  });

  return (
    <>
      {/* The far end of the window dissolves into the room. Without this the
          plane ends on a hard edge and the display reads as a flat card. */}
      <fog attach="fog" args={['#0A0B0D', 6, 16]} />

      <ambientLight intensity={0.45} />
      {/* Key light sits where the amber signal comes from. */}
      <directionalLight position={[-4, 7, 6]} intensity={1.4} color="#FFCE96" />
      {/* Cold fill from behind picks the far ridges out of the floor. */}
      <directionalLight position={[5, 2.5, -7]} intensity={0.75} color="#3E8E7E" />

      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
      >
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.62}
          metalness={0.34}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default SpectrogramField;
