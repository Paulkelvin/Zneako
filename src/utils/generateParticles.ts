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
export const TYRE_MINOR_R = 0.17;

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

// ── Shoe profile ──

function isInsideShoeProfile(x: number, y: number): boolean {
  const soleBottom = x > 1.2 ? (x - 1.2) * 0.5 : 0;
  if (y < soleBottom) return false;
  if (x < -1.55 || x > 1.55) return false;
  const upper = getUpperBound(x);
  return y <= upper;
}

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

const SHOE_PROFILE = [
  [1.5, 0.35],
  [1.55, 0.25],
  [1.5, 0.12],
  [1.3, 0.05],
  [0.8, 0.0],
  [0.0, 0.0],
  [-0.8, 0.0],
  [-1.2, 0.02],
  [-1.45, 0.05],
  [-1.5, 0.12],
  [-1.48, 0.3],
  [-1.42, 0.55],
  [-1.35, 0.8],
  [-1.25, 0.95],
  [-1.1, 1.05],
  [-0.85, 1.1],
  [-0.6, 1.08],
  [-0.35, 1.0],
  [-0.1, 0.95],
  [0.15, 0.85],
  [0.5, 0.7],
  [0.8, 0.58],
  [1.1, 0.48],
  [1.35, 0.4],
  [1.5, 0.35],
];

function lerpPoint(a: number[], b: number[], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function sampleProfilePoint(): [number, number] {
  const totalSegments = SHOE_PROFILE.length - 1;
  const segIdx = Math.floor(Math.random() * totalSegments);
  const t = Math.random();
  return lerpPoint(SHOE_PROFILE[segIdx], SHOE_PROFILE[(segIdx + 1) % SHOE_PROFILE.length], t);
}

function getShoeWidthAtPoint(x: number, y: number): number {
  let baseWidth: number;
  if (x < -1.0) baseWidth = 0.28;
  else if (x < 0.0) baseWidth = 0.4;
  else if (x < 0.8) baseWidth = 0.42;
  else baseWidth = 0.35 - (x - 0.8) * 0.15;

  const heightNarrow = 1.0 - Math.max(0, y - 0.3) * 0.35;
  return baseWidth * heightNarrow;
}

function createShoeShape(particleCount: number): Float32Array {
  const positions: number[] = [];
  const scale = 1.4;

  const surfaceCount = Math.floor(particleCount * 0.40);
  const soleCount = Math.floor(particleCount * 0.20);
  const interiorCount = particleCount - surfaceCount - soleCount;

  for (let i = 0; i < surfaceCount; i++) {
    const [px, py] = sampleProfilePoint();
    const width = getShoeWidthAtPoint(px, py);
    const angle = Math.random() * Math.PI * 2;
    const pz = Math.sin(angle) * width;
    const jitter = (Math.random() - 0.5) * 0.06;

    positions.push(
      (px + jitter) * scale,
      (py - 0.4 + jitter * 0.5) * scale,
      (pz + jitter) * scale
    );
  }

  for (let i = 0; i < soleCount; i++) {
    const px = -1.45 + Math.random() * 2.9;
    const soleEnd = px > 1.2 ? 1.5 : 1.55;
    if (px > soleEnd) { i--; continue; }

    const py = Math.random() * 0.18;
    const width = getShoeWidthAtPoint(px, 0.1);
    const pz = (Math.random() * 2 - 1) * width;

    positions.push(px * scale, (py - 0.4) * scale, pz * scale);
  }

  let interiorPlaced = 0;
  let interiorAttempts = 0;
  while (interiorPlaced < interiorCount && interiorAttempts < interiorCount * 15) {
    interiorAttempts++;
    const px = -1.5 + Math.random() * 3.0;
    const py = Math.random() * 1.1;

    if (!isInsideShoeProfile(px, py)) continue;

    const width = getShoeWidthAtPoint(px, py);
    const pz = (Math.random() * 2 - 1) * width * 0.85;

    positions.push(px * scale, (py - 0.4) * scale, pz * scale);
    interiorPlaced++;
  }
  while (interiorPlaced < interiorCount) {
    positions.push(
      (Math.random() * 2 - 1) * scale,
      (Math.random() * 0.5 - 0.2) * scale,
      (Math.random() - 0.5) * 0.4 * scale
    );
    interiorPlaced++;
  }

  return new Float32Array(positions);
}

// ── Main generator ──

export function generateParticleData(particleCount: number): ParticleData {
  const endPositions = createShoeShape(particleCount);
  const startPositions = createTyreStartPositions(particleCount, 1.4);

  const animSeeds = new Float32Array(particleCount * 3);
  const dampFactors = new Float32Array(particleCount);
  const scales = new Float32Array(particleCount);
  const formationOrder = new Float32Array(particleCount);

  const surfaceCount = Math.floor(particleCount * 0.40);
  const soleCount = Math.floor(particleCount * 0.20);

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

    if (i >= surfaceCount && i < surfaceCount + soleCount) {
      formationOrder[i] = Math.random() * 0.15;
    } else if (i < surfaceCount) {
      const py = endPositions[i3 + 1];
      if (py < -0.2) {
        formationOrder[i] = 0.1 + Math.random() * 0.2;
      } else {
        formationOrder[i] = 0.25 + Math.random() * 0.35;
      }
    } else {
      formationOrder[i] = 0.4 + Math.random() * 0.4;
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
