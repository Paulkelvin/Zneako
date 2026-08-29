import { createShoeParticlePositions } from './shoeGeometry';

export interface ParticleData {
  startPositions: Float32Array;
  endPositions: Float32Array;
  animSeeds: Float32Array;
  dampFactors: Float32Array;
  scales: Float32Array;
  formationOrder: Float32Array;
  count: number;
}

// ── Tyre staging ──
//
// Two tyres, deliberately posed rather than physics-dropped: one stands
// upright, one lies flat — a real staged scene rather than a scattered
// heap, which is what actually reads as "tyre" at a glance. Both erode
// into the same rubber cloud that becomes the shoe.

export interface TyreConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const TYRE_MAJOR_R = 0.55;
export const TYRE_MINOR_R = 0.24;

// Shared with TyrePile.tsx's solid tyre mesh so the dissolve particles'
// start positions line up with the visible tyre surface they erode from.
export const TYRE_SCENE_SCALE = 1.6;

export const STANDING_TYRE_CONFIG: TyreConfig = {
  position: [-0.42, 0.42, -0.35],
  rotation: [1.48, 0.32, 0.14],
  scale: 1.05,
};

export const LYING_TYRE_CONFIG: TyreConfig = {
  position: [0.08, -0.16, 0.32],
  rotation: [0.08, 0.55, 0.04],
  scale: 1.0,
};

export const TYRE_CONFIGS: TyreConfig[] = [STANDING_TYRE_CONFIG, LYING_TYRE_CONFIG];

function rotateEulerXYZ(
  x: number, y: number, z: number,
  rx: number, ry: number, rz: number
): [number, number, number] {
  const x1 = x;
  const y1 = y * Math.cos(rx) - z * Math.sin(rx);
  const z1 = y * Math.sin(rx) + z * Math.cos(rx);
  const x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
  const y2 = y1;
  const z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
  const x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
  const y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
  return [x3, y3, z2];
}

function createTyreStartPositions(particleCount: number, scale: number): Float32Array {
  const positions = new Float32Array(particleCount * 3);
  const perTyre = Math.floor(particleCount / TYRE_CONFIGS.length);

  for (let t = 0; t < TYRE_CONFIGS.length; t++) {
    const cfg = TYRE_CONFIGS[t];
    const start = t * perTyre;
    const count = t === TYRE_CONFIGS.length - 1 ? particleCount - start : perTyre;
    const majorR = TYRE_MAJOR_R * cfg.scale;
    const minorR = TYRE_MINOR_R * cfg.scale;

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;

      let r: number;
      if (Math.random() < 0.6) {
        r = minorR * (0.82 + Math.random() * 0.18);
      } else {
        r = minorR * Math.sqrt(Math.random());
      }

      // Canonical torus with its hole axis along Y — matches the
      // (unrotated) LatheGeometry axis in TyrePile.
      const lx = (majorR + r * Math.cos(v)) * Math.cos(u);
      const lz = (majorR + r * Math.cos(v)) * Math.sin(u);
      const ly = r * Math.sin(v);

      const [rx, ry, rz] = rotateEulerXYZ(
        lx, ly, lz,
        cfg.rotation[0], cfg.rotation[1], cfg.rotation[2]
      );

      const idx = (start + i) * 3;
      positions[idx] = (rx + cfg.position[0]) * scale;
      positions[idx + 1] = (ry + cfg.position[1]) * scale;
      positions[idx + 2] = (rz + cfg.position[2]) * scale;
    }
  }

  return positions;
}

// ── Shoe target ──
// Sampled from a real 3D trainer mesh (sole + lofted upper + tongue) via
// MeshSurfaceSampler — see shoeGeometry.ts — rather than scattered inside a
// 2D silhouette. Swapping in the actual Zneako shoe GLB later only means
// changing what geometry gets sampled there; nothing here needs to change.
//
// Stretched taller (not wider) after sampling: the mobile frame has more
// vertical room to give the formed shoe than horizontal (widening it risks
// the same edge-bleed the tyre positions are calibrated against), so only
// the y-axis gets the extra reach.
const SHOE_HEIGHT_STRETCH = 1.2;

// ── Main generator ──

export function generateParticleData(particleCount: number): ParticleData {
  const endPositions = createShoeParticlePositions(particleCount);
  for (let i = 1; i < endPositions.length; i += 3) {
    endPositions[i] *= SHOE_HEIGHT_STRETCH;
  }
  const startPositions = createTyreStartPositions(particleCount, TYRE_SCENE_SCALE);

  const animSeeds = new Float32Array(particleCount * 3);
  const dampFactors = new Float32Array(particleCount);
  const scales = new Float32Array(particleCount);
  const formationOrder = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    animSeeds[i3] = Math.random() * Math.PI * 2;
    animSeeds[i3 + 1] = Math.random() * Math.PI * 2;
    animSeeds[i3 + 2] = Math.random() * Math.PI * 2;

    dampFactors[i] = 0.4 + Math.random() * 0.6;

    const sizeRoll = Math.random();
    if (sizeRoll < 0.5) {
      scales[i] = 0.012 + Math.random() * 0.018;
    } else if (sizeRoll < 0.85) {
      scales[i] = 0.025 + Math.random() * 0.025;
    } else {
      scales[i] = 0.04 + Math.random() * 0.035;
    }

    // Sole particles (below the upper's dip into the sole plane) form first,
    // matching the sampled mesh's own sole-vs-upper split by height.
    const py = endPositions[i3 + 1];
    if (py < -0.2) {
      formationOrder[i] = 0.1 + Math.random() * 0.2;
    } else {
      formationOrder[i] = 0.25 + Math.random() * 0.45;
    }
  }

  return {
    startPositions,
    endPositions,
    animSeeds,
    dampFactors,
    scales,
    formationOrder,
    count: particleCount,
  };
}
