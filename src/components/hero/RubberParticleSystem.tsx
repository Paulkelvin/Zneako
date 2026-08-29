'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateParticleData } from '@/utils/generateParticles';
import vertexShader from '@/shaders/rubberParticle.vert.glsl';
import fragmentShader from '@/shaders/rubberParticle.frag.glsl';

interface RubberParticleSystemProps {
  progress: number;
  particleCount?: number;
}

function createIrregularGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const posAttr = geo.attributes.position;
  const arr = posAttr.array as Float32Array;

  for (let i = 0; i < arr.length; i += 3) {
    const distortion = 0.7 + Math.random() * 0.6;
    arr[i] *= distortion;
    arr[i + 1] *= distortion * (0.5 + Math.random() * 0.5);
    arr[i + 2] *= distortion;
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export default function RubberParticleSystem({
  progress,
  particleCount = 4000,
}: RubberParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const { viewport } = useThree();

  const responsiveCount = useMemo(() => {
    if (viewport.width < 6) return Math.floor(particleCount * 0.4);
    if (viewport.width < 10) return Math.floor(particleCount * 0.7);
    return particleCount;
  }, [viewport.width, particleCount]);

  const particleData = useMemo(
    () => generateParticleData(responsiveCount),
    [responsiveCount]
  );

  const baseGeometry = useMemo(() => createIrregularGeometry(), []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uDriftSpeed: { value: 0.3 },
        uDriftAmplitude: { value: 0.26 },
        uColorBase: { value: new THREE.Color('#4A4845') },
        uColorHighlight: { value: new THREE.Color('#6B6560') },
        uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
        uAmbientColor: { value: new THREE.Color('#5A5550') },
        uRoughness: { value: 0.92 },
      },
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const identity = new THREE.Matrix4();
    for (let i = 0; i < responsiveCount; i++) {
      mesh.setMatrixAt(i, identity);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const geo = mesh.geometry;

    geo.setAttribute(
      'positionStart',
      new THREE.InstancedBufferAttribute(particleData.startPositions, 3)
    );
    geo.setAttribute(
      'positionEnd',
      new THREE.InstancedBufferAttribute(particleData.endPositions, 3)
    );
    geo.setAttribute(
      'animSeed',
      new THREE.InstancedBufferAttribute(particleData.animSeeds, 3)
    );
    geo.setAttribute(
      'dampFactor',
      new THREE.InstancedBufferAttribute(particleData.dampFactors, 1)
    );
    geo.setAttribute(
      'scale',
      new THREE.InstancedBufferAttribute(particleData.scales, 1)
    );
    geo.setAttribute(
      'formationOrder',
      new THREE.InstancedBufferAttribute(particleData.formationOrder, 1)
    );
  }, [particleData, responsiveCount]);

  useFrame((state) => {
    if (!materialRef.current) return;

    const lerp = 0.1;
    progressRef.current += (progress - progressRef.current) * lerp;

    materialRef.current.uniforms.uProgress.value = progressRef.current;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[baseGeometry, shaderMaterial, responsiveCount]}
      frustumCulled={false}
    >
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </instancedMesh>
  );
}
