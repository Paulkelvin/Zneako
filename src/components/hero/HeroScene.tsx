'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RubberParticleSystem from './RubberParticleSystem';

interface HeroSceneProps {
  progress: number;
}

export default function HeroScene({ progress }: HeroSceneProps) {
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
        <group rotation={[0.15, -0.4, 0.03]} position={[0.8, -1.0, 0]}>
          <RubberParticleSystem progress={progress} particleCount={5000} />
        </group>
      </Suspense>
      <ambientLight intensity={0.6} color="#E8E0D8" />
      <directionalLight position={[5, 8, 3]} intensity={1.2} color="#F5F0E8" />
      <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#C8B891" />
      <directionalLight position={[0, 3, -5]} intensity={0.3} color="#B0A898" />
    </Canvas>
  );
}
