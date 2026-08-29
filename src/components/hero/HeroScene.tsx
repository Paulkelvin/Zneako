'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { EffectPass, type EffectComposer as EffectComposerImpl } from 'postprocessing';
import RubberParticleSystem from './RubberParticleSystem';
import TyrePile from './TyrePile';

interface HeroSceneProps {
  progress: number;
  playing: boolean;
}

// @react-three/postprocessing's EffectPass always encodes its output as if
// compositing physically-linear scene radiance into sRGB, but our tyre/rubber
// shaders write already display-ready color (no linear workflow). Left alone
// that reapplies an sRGB curve on top of colors that already have one, washing
// everything out. Disabling it here restores the un-composited look while
// keeping the composited bloom highlights.
function BloomEncodeFix({ composerRef }: { composerRef: React.MutableRefObject<EffectComposerImpl | null> }) {
  useFrame(() => {
    const composer = composerRef.current;
    if (!composer) return;
    for (const pass of composer.passes) {
      if (pass instanceof EffectPass && pass.encodeOutput) {
        pass.encodeOutput = false;
      }
    }
  });
  return null;
}

function HeroContent({ progress }: { progress: number }) {
  const { viewport, size } = useThree();
  // Below md (768px) the text and art stack vertically instead of
  // overlaying (see HeroSection.tsx), so mobile's offsetX only needs to
  // hit the same left margin the text itself uses (px-6, 24px) rather
  // than dodge anything. Desktop's offsetX dodges the left-anchored text
  // while leaving matching breathing room on the right edge too — both
  // margins (text-gap and right-edge) verified via dense frame sampling
  // across the full ~15s cycle, not just a resting frame, since the
  // dissolve/drift animation pushes noticeably further than any static
  // pose does.
  const isMobile = size.width < 768;
  const offsetX = isMobile ? -0.15 : Math.min(viewport.width * 0.3, 2.4);
  const offsetY = isMobile ? 0.95 : -0.2;
  const groupScale = isMobile ? 1.0 : 0.55;

  return (
    <group rotation={[0.15, -0.4, 0.03]} position={[offsetX, offsetY, 0]} scale={groupScale}>
      <TyrePile progress={progress} />
      <RubberParticleSystem progress={progress} particleCount={5000} />
    </group>
  );
}

// Subtle push-in synced to the same progress that drives the material
// transformation, so the camera reads as directed rather than static —
// dollies toward the subject as the shoe assembles, eases back out as it
// breaks down again. Z-only: the object's own on-screen X position already
// depends on camera distance (see HeroContent's offsetX, computed from
// viewport.width), so any lateral camera drift compounds with that and can
// push the subject out of frame — confirmed by testing, not just theory.
const CAMERA_Z_TYRE = 8;
const CAMERA_Z_SHOE = 7.4;

function CameraRig({ progress }: { progress: number }) {
  useFrame(({ camera }) => {
    camera.position.z = THREE.MathUtils.lerp(CAMERA_Z_TYRE, CAMERA_Z_SHOE, progress);
  });
  return null;
}

function HeroEffects() {
  const composerRef = useRef<EffectComposerImpl | null>(null);
  // Bloom's props are static, but re-creating this element on every
  // progress-driven render would otherwise give <EffectComposer> a new
  // `children` reference each frame, tearing down and rebuilding its
  // EffectPass (and recompiling its shader) 60 times a second.
  const bloom = useMemo(
    () => <Bloom intensity={0.35} luminanceThreshold={0.82} luminanceSmoothing={0.25} mipmapBlur />,
    []
  );

  return (
    <>
      <EffectComposer ref={composerRef}>{bloom}</EffectComposer>
      <BloomEncodeFix composerRef={composerRef} />
    </>
  );
}

export default function HeroScene({ progress, playing }: HeroSceneProps) {
  return (
    <Canvas
      camera={{
        position: [0.8, 0.3, 8],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      shadows="soft"
      frameloop={playing ? 'always' : 'never'}
      dpr={[1, 1.5]}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <CameraRig progress={progress} />
      <Suspense fallback={null}>
        <HeroContent progress={progress} />
      </Suspense>
      <ambientLight intensity={0.6} color="#E8E0D8" />
      <directionalLight
        position={[1.6, 3.2, 1.8]}
        intensity={1.2}
        color="#F5F0E8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
        shadow-bias={-0.0015}
      />
      <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#C8B891" />
      <directionalLight position={[0, 3, -5]} intensity={0.3} color="#B0A898" />

      <HeroEffects />
    </Canvas>
  );
}
