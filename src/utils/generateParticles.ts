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

// ── Tyre pile configuration ──

export interface TyreConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const TYRE_MAJOR_R = 0.55;
export const TYRE_MINOR_R = 0.24;

// Baked from an offline cannon-es drop simulation (scripts/bake-tyre-pile.mjs,
// seed 33) — tyres dropped onto a ground plane and left to settle under
// gravity/friction so contacts, tilts and spread are physically plausible
// rather than hand-placed.
export const TYRE_CONFIGS: TyreConfig[] = [
  { position: [0.619, 0.099, -0.453], rotation: [1.529, 0.717, 0.039], scale: 0.971 },
  { position: [0.009, -0.437, 0.728], rotation: [3.141, -0.945, 3.141], scale: 0.959 },
  { position: [-0.467, 0.039, -0.264], rotation: [2.054, -1.0, 0.557], scale: 0.895 },
  { position: [-0.21, 0.347, 0.504], rotation: [-2.391, -0.02, 0.166], scale: 1.011 },
  { position: [-0.225, 0.428, -1.082], rotation: [-1.54, 0.262, -2.93], scale: 1.073 },
  { position: [0.163, 0.324, -0.83], rotation: [-1.489, -0.014, -2.941], scale: 0.861 },
];

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
      // cannon-es cylinder axis used to bake TYRE_CONFIGS and the
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

// ── Main generator ──

export function generateParticleData(particleCount: number): ParticleData {
  const endPositions = createShoeParticlePositions(particleCount);
  const startPositions = createTyreStartPositions(particleCount, 1.4);

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
