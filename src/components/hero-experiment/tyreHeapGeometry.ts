import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { TYRE_CONFIGS, TYRE_MAJOR_R, TYRE_MINOR_R } from '@/utils/generateParticles';

const SCENE_SCALE = 1.4;

// Same cross-section as TyrePile's createTyreProfile — duplicated rather
// than imported so this experiment has zero import dependency on the
// production hero component and stays trivially deletable.
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

// Builds the six-tyre heap as one merged mesh (using TyrePile's own baked
// positions/rotations/scales) so MeshSurfaceSampler can draw particles from
// real tyre surface area, distributed across the same pile silhouette as
// the production hero.
export function createTyreHeapGeometry(): THREE.BufferGeometry {
  const tyreGeo = new THREE.LatheGeometry(createTyreProfile(), 48);

  const pieces = TYRE_CONFIGS.map((cfg) => {
    const geo = tyreGeo.clone();
    geo.scale(cfg.scale * SCENE_SCALE, cfg.scale * SCENE_SCALE, cfg.scale * SCENE_SCALE);
    geo.rotateX(cfg.rotation[0]);
    geo.rotateY(cfg.rotation[1]);
    geo.rotateZ(cfg.rotation[2]);
    geo.translate(
      cfg.position[0] * SCENE_SCALE,
      cfg.position[1] * SCENE_SCALE,
      cfg.position[2] * SCENE_SCALE
    );
    return geo;
  });

  const merged = mergeGeometries(pieces, false);
  merged.computeVertexNormals();
  return merged;
}

// Samples the tyre heap's surface into particle positions, count-for-count
// swappable with createShoeParticlePositions from shoeGeometry.ts so both
// ends of the morph share one convention.
export function createTyreHeapParticlePositions(particleCount: number): Float32Array {
  const geometry = createTyreHeapGeometry();
  const mesh = new THREE.Mesh(geometry);
  const sampler = new MeshSurfaceSampler(mesh).build();

  const positions = new Float32Array(particleCount * 3);
  const sample = new THREE.Vector3();

  for (let i = 0; i < particleCount; i++) {
    sampler.sample(sample);
    const idx = i * 3;
    positions[idx] = sample.x;
    positions[idx + 1] = sample.y;
    positions[idx + 2] = sample.z;
  }

  return positions;
}
