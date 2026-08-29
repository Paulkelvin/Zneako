'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import vertexShader from '@/shaders/experiment/morphPoints.vert.glsl';
import fragmentShader from '@/shaders/experiment/morphPoints.frag.glsl';
import { createTyreHeapParticlePositions } from './tyreHeapGeometry';
import { createShoeParticlePositions } from '@/utils/shoeGeometry';
import { textureSizeFor, packPositionsToDataTexture, createParticleUvGeometry } from './buildMorphTextures';

interface MorphParticlesExperienceProps {
  progress: number;
  playing: boolean;
}

const BASE_PARTICLE_COUNT = 200000;

function MorphParticles({ progress }: { progress: number }) {
  const { viewport } = useThree();
  const progressRef = useRef(0);

  const targetCount = useMemo(() => {
    if (viewport.width < 6) return Math.floor(BASE_PARTICLE_COUNT * 0.35);
    if (viewport.width < 10) return Math.floor(BASE_PARTICLE_COUNT * 0.65);
    return BASE_PARTICLE_COUNT;
  }, [viewport.width]);

  const { geometry, material } = useMemo(() => {
    const { width, height } = textureSizeFor(targetCount);
    const count = width * height;

    const tyrePositions = createTyreHeapParticlePositions(count);
    const shoePositions = createShoeParticlePositions(count);

    const textureFrom = packPositionsToDataTexture(tyrePositions, width, height);
    const textureTo = packPositionsToDataTexture(shoePositions, width, height);
    const uvGeometry = createParticleUvGeometry(width, height);

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTextureFrom: { value: textureFrom },
        uTextureTo: { value: textureTo },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uSize: { value: 4 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: uvGeometry, material: shaderMaterial };
  }, [targetCount]);

  useFrame((state) => {
    const lerp = 0.06;
    progressRef.current += (progress - progressRef.current) * lerp;
    material.uniforms.uProgress.value = progressRef.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
  });

  return <points geometry={geometry} material={material} />;
}

function ExperienceEffects() {
  const bloom = useMemo(
    () => <Bloom intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />,
    []
  );
  return <EffectComposer>{bloom}</EffectComposer>;
}

function ExperienceContent({ progress }: { progress: number }) {
  const { viewport } = useThree();
  const offsetX = Math.min(viewport.width * 0.14, 1.6);

  // Full-bleed framing, deliberately much bigger than the production hero's
  // small corner decoration — MisterPrada's own legible states (the figure,
  // the demon face, the giant "E") all fill most of the viewport. A sparse
  // point cloud tucked into a hero's decorative corner reads as dust
  // regardless of density; the same particle count filling the frame reads
  // as a form.
  return (
    <group rotation={[0.15, -0.4, 0.03]} position={[offsetX, -0.15, 0]} scale={1.05}>
      <MorphParticles progress={progress} />
    </group>
  );
}

export default function MorphParticlesExperience({ progress, playing }: MorphParticlesExperienceProps) {
  return (
    <Canvas
      camera={{
        position: [0.8, 0.3, 4.6],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
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
        <ExperienceContent progress={progress} />
      </Suspense>
      <ExperienceEffects />
    </Canvas>
  );
}
