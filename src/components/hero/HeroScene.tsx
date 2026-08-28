'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import RubberParticleSystem from './RubberParticleSystem';
import TyrePile from './TyrePile';

interface HeroSceneProps {
  progress: number;
  playing: boolean;
}

function HeroContent({ progress }: { progress: number }) {
  const { viewport } = useThree();
  // Offset as a fraction of the visible width so the subject sits well
  // clear of the left-anchored text on wide screens without being pushed
  // out of frame on mobile's much narrower aspect ratio.
  const offsetX = Math.min(viewport.width * 0.3, 3.6);

  return (
    <group rotation={[0.15, -0.4, 0.03]} position={[offsetX, -1.0, 0]}>
      <TyrePile progress={progress} />
      <RubberParticleSystem progress={progress} particleCount={5000} />
    </group>
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
      <color attach="background" args={['#0A0A0A']} />
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
    </Canvas>
  );
}
