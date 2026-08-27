'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TYRE_CONFIGS, TYRE_MAJOR_R, TYRE_MINOR_R } from '@/utils/generateParticles';
import vertexShader from '@/shaders/tyre.vert.glsl';
import fragmentShader from '@/shaders/tyre.frag.glsl';

interface TyrePileProps {
  progress: number;
}

const SCENE_SCALE = 1.4;

export default function TyrePile({ progress }: TyrePileProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);

  const geometry = useMemo(
    () => new THREE.TorusGeometry(TYRE_MAJOR_R, TYRE_MINOR_R, 24, 48),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
        },
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    const lerp = 0.1;
    progressRef.current += (progress - progressRef.current) * lerp;
    materialRef.current.uniforms.uProgress.value = progressRef.current;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (progress > 0.45) return null;

  return (
    <group>
      {TYRE_CONFIGS.map((cfg, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position={[
            cfg.position[0] * SCENE_SCALE,
            cfg.position[1] * SCENE_SCALE,
            cfg.position[2] * SCENE_SCALE,
          ]}
          rotation={cfg.rotation}
          scale={cfg.scale * SCENE_SCALE}
        />
      ))}
      <primitive object={material} ref={materialRef} />
    </group>
  );
}
