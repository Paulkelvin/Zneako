'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ANCHOR_TYRE_CONFIG, EXPLODING_TYRE_CONFIG, TYRE_MAJOR_R, TYRE_MINOR_R } from '@/utils/generateParticles';
import vertexShader from '@/shaders/tyre.vert.glsl';
import fragmentShader from '@/shaders/tyre.frag.glsl';

interface TyrePileProps {
  progress: number;
}

const SCENE_SCALE = 1.4;

// Real car/truck tyre cross-section: narrow bead, steep near-vertical
// sidewall, a distinct shoulder, then a WIDE FLAT tread band — not a single
// rounded crown point, which is what reads as a thin bicycle/tricycle inner
// tube rather than a chunky road tyre.
function createTyreProfile(): THREE.Vector2[] {
  const innerR = TYRE_MAJOR_R - TYRE_MINOR_R * 0.92;
  const halfWidth = TYRE_MINOR_R * 1.05;
  const outerR = TYRE_MAJOR_R + TYRE_MINOR_R;
  const treadR = outerR - TYRE_MINOR_R * 0.03;

  return [
    new THREE.Vector2(innerR, -halfWidth),
    new THREE.Vector2(TYRE_MAJOR_R * 0.96, -halfWidth * 0.93),
    new THREE.Vector2(outerR * 0.93, -halfWidth * 0.68),
    new THREE.Vector2(outerR * 0.985, -halfWidth * 0.4),
    new THREE.Vector2(treadR, -halfWidth * 0.22),
    new THREE.Vector2(treadR, halfWidth * 0.22),
    new THREE.Vector2(outerR * 0.985, halfWidth * 0.4),
    new THREE.Vector2(outerR * 0.93, halfWidth * 0.68),
    new THREE.Vector2(TYRE_MAJOR_R * 0.96, halfWidth * 0.93),
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

function makeTyreMaterial(variationSeed: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uVariationSeed: { value: variationSeed },
    },
    side: THREE.DoubleSide,
  });
}

export default function TyrePile({ progress }: TyrePileProps) {
  const progressRef = useRef(0);

  const geometry = useMemo(() => createTyreGeometry(), []);

  // The anchor tyre's material never has its uProgress advanced past 0 —
  // tyre.frag.glsl's dissolve discard only triggers once uProgress clears
  // its 0.10 threshold, so leaving it pinned at 0 keeps this tyre solid
  // and fully shaded for the entire loop, reusing the exact same shader
  // (tread detail, wear, lighting) as the one that does dissolve.
  const anchorMaterial = useMemo(() => makeTyreMaterial(0.7), []);
  const explodingMaterial = useMemo(() => makeTyreMaterial(0.3), []);

  useFrame((state) => {
    const lerp = 0.1;
    progressRef.current += (progress - progressRef.current) * lerp;
    explodingMaterial.uniforms.uProgress.value = progressRef.current;
    explodingMaterial.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const showExploding = progress <= 0.45;

  return (
    <group>
      <mesh
        geometry={geometry}
        material={anchorMaterial}
        position={[
          ANCHOR_TYRE_CONFIG.position[0] * SCENE_SCALE,
          ANCHOR_TYRE_CONFIG.position[1] * SCENE_SCALE,
          ANCHOR_TYRE_CONFIG.position[2] * SCENE_SCALE,
        ]}
        rotation={ANCHOR_TYRE_CONFIG.rotation}
        scale={ANCHOR_TYRE_CONFIG.scale * SCENE_SCALE}
        castShadow
        receiveShadow
      />

      {showExploding && (
        <mesh
          geometry={geometry}
          material={explodingMaterial}
          position={[
            EXPLODING_TYRE_CONFIG.position[0] * SCENE_SCALE,
            EXPLODING_TYRE_CONFIG.position[1] * SCENE_SCALE,
            EXPLODING_TYRE_CONFIG.position[2] * SCENE_SCALE,
          ]}
          rotation={EXPLODING_TYRE_CONFIG.rotation}
          scale={EXPLODING_TYRE_CONFIG.scale * SCENE_SCALE}
          castShadow
          receiveShadow
        />
      )}

      {/* Contact shadow / grounding plane — stays for the anchor tyre's
          own shadow even once the exploding tyre is gone. */}
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
