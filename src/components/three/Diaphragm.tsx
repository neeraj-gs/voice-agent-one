/**
 * THE DIAPHRAGM
 *
 * A condenser capsule seen head-on: the gold-sputtered membrane inside its
 * machined ring, behind the grille. It is the part of a microphone that
 * physically moves when someone speaks, so it is the honest object to put on
 * the page where a conversation happens — the spectrogram belongs upstairs on
 * the marketing floor, this belongs on the call.
 *
 * Standing-wave modes ride the membrane in proportion to level. At rest it is
 * almost still: a capsule with nothing in front of it does almost nothing.
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type DiaphragmMode = 'idle' | 'listening' | 'speaking' | 'connecting';

const TONES: Record<DiaphragmMode, { face: string; emissive: string; ring: string }> = {
  idle: { face: '#1D232A', emissive: '#000000', ring: '#39424C' },
  connecting: { face: '#26313A', emissive: '#0F2622', ring: '#3E8E7E' },
  listening: { face: '#22343A', emissive: '#12312C', ring: '#3E8E7E' },
  speaking: { face: '#8A5A20', emissive: '#4A2C08', ring: '#FF9D2E' },
};

export const Diaphragm: React.FC<{
  mode: DiaphragmMode;
  /** Live level, read per frame so the membrane doesn't cost a React render. */
  levelRef: React.MutableRefObject<number>;
  frozen?: boolean;
}> = ({ mode, levelRef, frozen = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const smooth = useRef(0);

  const geometry = useMemo(() => new THREE.CircleGeometry(1.2, 128, 1, Math.PI * 2), []);

  // Radius and angle per vertex, precomputed — they never change.
  const polar = useMemo(() => {
    const pos = geometry.attributes.position;
    const r = new Float32Array(pos.count);
    const a = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      r[i] = Math.hypot(x, y) / 1.2;
      a[i] = Math.atan2(y, x);
    }
    return { r, a };
  }, [geometry]);

  const target = useMemo(() => ({
    face: new THREE.Color(TONES[mode].face),
    emissive: new THREE.Color(TONES[mode].emissive),
    ring: new THREE.Color(TONES[mode].ring),
  }), [mode]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!frozen) clock.current += dt;
    const t = clock.current;

    // Level is smoothed with a fast attack and slow release — meter ballistics.
    const raw = Math.min(1, Math.max(0, levelRef.current));
    const k = raw > smooth.current ? 0.35 : 0.06;
    smooth.current += (raw - smooth.current) * k;
    const lvl = smooth.current;

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const { r, a } = polar;

    // A membrane at rest still shivers, but only just.
    const amp = 0.012 + lvl * 0.3;

    for (let i = 0; i < pos.count; i++) {
      const rr = r[i];
      const th = a[i];
      const edge = 1 - rr; // clamped at the rim, as a real membrane is

      const z =
        amp *
        (0.62 * Math.sin(6.2 * rr - t * 4.1) * edge +
          0.34 * Math.sin(11.4 * rr - t * 6.7) * edge * edge +
          0.26 * Math.cos(4 * th + t * 1.4) * Math.sin(3.1 * rr - t * 2.9) * edge);

      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Colour eases between states rather than snapping.
    if (matRef.current) {
      matRef.current.color.lerp(target.face, 0.06);
      matRef.current.emissive.lerp(target.emissive, 0.06);
      matRef.current.emissiveIntensity = 0.4 + lvl * 1.5;
    }
    if (ringRef.current) ringRef.current.color.lerp(target.ring, 0.06);

    // The capsule turns a few degrees toward the pointer. Heavy and damped.
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (state.pointer.x * 0.16 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x +=
        (-0.16 - state.pointer.y * 0.1 - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-3, 4, 5]} intensity={1.5} color="#FFD9AE" />
      <directionalLight position={[4, -2, 2]} intensity={0.55} color="#3E8E7E" />
      <pointLight position={[0, 0, 2.4]} intensity={6} distance={7} color="#FF9D2E" />

      <group ref={groupRef}>
        {/* Backplate — the fixed electrode behind the membrane. */}
        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[1.19, 96]} />
          <meshStandardMaterial color="#0B0D0F" roughness={0.95} metalness={0.1} />
        </mesh>

        {/* The membrane. */}
        <mesh ref={meshRef} geometry={geometry}>
          <meshStandardMaterial
            ref={matRef}
            color={TONES.idle.face}
            emissive={TONES.idle.emissive}
            roughness={0.28}
            metalness={0.86}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Machined retaining ring. */}
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[1.235, 0.055, 20, 160]} />
          <meshStandardMaterial
            ref={ringRef}
            color={TONES.idle.ring}
            roughness={0.3}
            metalness={0.95}
          />
        </mesh>

        {/* Grille: two hoops in front, enough to read as a basket without
            turning into a mesh of moiré. */}
        {[0.34, 0.62].map((z, i) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[1.16 - i * 0.16, 0.012, 10, 128]} />
            <meshStandardMaterial color="#4A535E" roughness={0.5} metalness={0.9} />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default Diaphragm;
