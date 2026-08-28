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

// Real tyre cross-section: bead near the axle, tapered sidewall, rounded
// shoulder, flat-ish tread crown — not a circular tube like a torus.
function createTyreProfile(): THREE.Vector2[] {
  const innerR = TYRE_MAJOR_R - TYRE_MINOR_R * 0.85;
  const halfWidth = TYRE_MINOR_R * 1.1;
  const outerR = TYRE_MAJOR_R + TYRE_MINOR_R;

  return [
    new THREE.Vector2(innerR, -halfWidth),
    new THREE.Vector2(TYRE_MAJOR_R * 0.8, -halfWidth * 0.96),
    new THREE.Vector2(outerR - TYRE_MINOR_R * 0.55, -halfWidth * 0.62),
    new THREE.Vector2(outerR - TYRE_MINOR_R * 0.12, -halfWidth * 0.34),
    new THREE.Vector2(outerR, -halfWidth * 0.14),
    new THREE.Vector2(outerR + TYRE_MINOR_R * 0.02, 0),
    new THREE.Vector2(outerR, halfWidth * 0.14),
    new THREE.Vector2(outerR - TYRE_MINOR_R * 0.12, halfWidth * 0.34),
    new THREE.Vector2(outerR - TYRE_MINOR_R * 0.55, halfWidth * 0.62),
    new THREE.Vector2(TYRE_MAJOR_R * 0.8, halfWidth * 0.96),
    new THREE.Vector2(innerR, halfWidth),
  ];
}

function createTyreGeometry(): THREE.BufferGeometry {
  // Gentle silhouette-only variation here — the fine tread block/groove
  // pattern is bump-mapped in the fragment shader instead (see
  // tyre.frag.glsl), since resolving 54 discrete lug blocks as real
  // geometry needs far more segments than this scene can afford and
  // aliases into a jagged "gear tooth" edge at anything less.
  const geo = new THREE.LatheGeometry(createTyreProfile(), 96);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const arr = pos.array as Float32Array;

  for (let i = 0; i < pos.count; i++) {
    const x = arr[i * 3];
    const z = arr[i * 3 + 2];
    const u = uv.getX(i);
    const v = uv.getY(i);

    const radial = Math.sqrt(x * x + z * z) || 1;
    const nx = x / radial;
    const nz = z / radial;

    const grain = (Math.sin(u * 240.7 + v * 130.3) * 0.5 + 0.5 - 0.5) * 0.004;

    arr[i * 3] = x + nx * grain;
    arr[i * 3 + 2] = z + nz * grain;
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export default function TyrePile({ progress }: TyrePileProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);

  const geometry = useMemo(() => createTyreGeometry(), []);

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
          castShadow
          receiveShadow
        />
      ))}
      <primitive object={material} ref={materialRef} />

      {/* Contact shadow / grounding plane */}
      <mesh
        position={[0.0, -0.42 * SCENE_SCALE, 0.0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <shadowMaterial transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
