import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// Same silhouette art-direction as the old profile-scatter system (heel at
// negative x, toe at positive x, sole at y=0, ankle collar peaking around
// x=-1.0) — reused here to loft a real 3D shell instead of just bounding a
// random point scatter, so MeshSurfaceSampler has genuine surface area to
// sample from.
function getUpperBound(x: number): number {
  if (x < -1.5) return 0.12;
  if (x < -1.2) {
    return 0.25 + 0.9 * Math.sqrt(Math.max(0, 1 - Math.pow((x + 1.2) / 0.4, 2)));
  } else if (x < -0.3) {
    const t = (x + 1.2) / 0.9;
    return 1.15 - t * 0.35;
  } else if (x < 0.8) {
    const t = (x + 0.3) / 1.1;
    return 0.8 - t * 0.3;
  } else if (x < 1.55) {
    const t = (x - 0.8) / 0.75;
    return 0.5 - t * t * 0.15;
  }
  return 0.2;
}

function getShoeHalfWidth(x: number, y: number): number {
  let baseWidth: number;
  if (x < -1.0) baseWidth = 0.28;
  else if (x < 0.0) baseWidth = 0.4;
  else if (x < 0.8) baseWidth = 0.42;
  else baseWidth = 0.35 - (x - 0.8) * 0.15;

  const heightNarrow = 1.0 - Math.max(0, y - 0.3) * 0.35;
  return baseWidth * heightNarrow;
}

// A ring-loft: at each step along x, build a closed elliptical cross-section
// (radius/height set by yBottomFn/yTopFn, half-width set by widthFn) and
// connect consecutive rings into a tube of triangles. Used for both the
// upper shell and the flatter sole slab below.
function buildLoftShell(
  xMin: number,
  xMax: number,
  rings: number,
  segments: number,
  yBottomFn: (x: number) => number,
  yTopFn: (x: number) => number,
  widthFn: (x: number, y: number) => number
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const x = xMin + (xMax - xMin) * t;
    const yBottom = yBottomFn(x);
    const yTop = yTopFn(x);
    const centerY = (yTop + yBottom) / 2;
    const radY = (yTop - yBottom) / 2;

    for (let k = 0; k <= segments; k++) {
      const theta = (k / segments) * Math.PI * 2;
      const y = centerY + radY * Math.sin(theta);
      const halfWidth = widthFn(x, Math.max(y, 0));
      const z = halfWidth * Math.cos(theta);
      positions.push(x, y, z);
    }
  }

  const ringVerts = segments + 1;
  for (let i = 0; i < rings; i++) {
    for (let k = 0; k < segments; k++) {
      const a = i * ringVerts + k;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

// A small raised panel over the vamp opening — the tongue.
function buildTongue(): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const xStart = -0.4;
  const xEnd = 0.2;
  const uSegs = 8;
  const vSegs = 4;

  for (let i = 0; i <= uSegs; i++) {
    const u = i / uSegs;
    const x = xStart + (xEnd - xStart) * u;
    const baseY = getUpperBound(x) - 0.05;
    for (let j = 0; j <= vSegs; j++) {
      const v = j / vSegs;
      const lift = Math.sin(v * Math.PI * 0.5) * 0.22;
      const y = baseY + lift;
      const halfWidth = getShoeHalfWidth(x, baseY) * (1 - v * 0.35);
      const z = (v - 0.5) * 2 * halfWidth * 0.9;
      positions.push(x, y, z);
    }
  }

  const rowVerts = vSegs + 1;
  for (let i = 0; i < uSegs; i++) {
    for (let j = 0; j < vSegs; j++) {
      const a = i * rowVerts + j;
      const b = a + 1;
      const c = a + rowVerts;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

// Builds a real 3D trainer mesh — distinct sole slab, lofted upper shell,
// and a raised tongue panel — in place of the old 2D-silhouette point
// scatter. This is a placeholder stand-in: swap in a real GLB (loaded via
// useGLTF and its geometry passed straight into createShoeParticlePositions
// below) once the actual Zneako shoe model exists, without touching the
// particle architecture that consumes this.
export function createShoeMeshGeometry(): THREE.BufferGeometry {
  const upper = buildLoftShell(-1.55, 1.55, 48, 20, () => -0.04, getUpperBound, getShoeHalfWidth);
  const sole = buildLoftShell(
    -1.5,
    1.55,
    40,
    14,
    () => -0.17,
    () => -0.02,
    (x) => getShoeHalfWidth(x, 0) * 1.1
  );
  const tongue = buildTongue();

  const merged = mergeGeometries([upper, sole, tongue], false);
  merged.computeVertexNormals();
  return merged;
}

// Samples the trainer mesh's surface into particle positions, applying the
// same (x, y-0.4, z) * 1.4 convention the old profile-scatter system used —
// so the shoe lands at the same size/position in the existing hero
// composition with no downstream changes needed.
export function createShoeParticlePositions(particleCount: number): Float32Array {
  const geometry = createShoeMeshGeometry();
  const mesh = new THREE.Mesh(geometry);
  const sampler = new MeshSurfaceSampler(mesh).build();

  const positions = new Float32Array(particleCount * 3);
  const scale = 1.4;
  const sample = new THREE.Vector3();

  for (let i = 0; i < particleCount; i++) {
    sampler.sample(sample);
    const idx = i * 3;
    positions[idx] = sample.x * scale;
    positions[idx + 1] = (sample.y - 0.4) * scale;
    positions[idx + 2] = sample.z * scale;
  }

  return positions;
}
