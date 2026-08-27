export interface ParticleData {
  startPositions: Float32Array;
  endPositions: Float32Array;
  animSeeds: Float32Array;
  dampFactors: Float32Array;
  scales: Float32Array;
  count: number;
}

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

// Shoe side profile as a polyline (x, y) — normalized to ~[-1.6, 1.6] x [0, 1.2]
// Traced clockwise: toe → sole bottom → heel → heel counter → collar → tongue → toe top
const SHOE_PROFILE = [
  // Toe front (rounded)
  [1.5, 0.35],
  [1.55, 0.25],
  [1.5, 0.12],
  // Sole bottom — flat
  [1.3, 0.05],
  [0.8, 0.0],
  [0.0, 0.0],
  [-0.8, 0.0],
  [-1.2, 0.02],
  // Heel bottom
  [-1.45, 0.05],
  [-1.5, 0.12],
  // Heel counter — rises steeply
  [-1.48, 0.3],
  [-1.42, 0.55],
  [-1.35, 0.8],
  [-1.25, 0.95],
  // Collar / ankle opening
  [-1.1, 1.05],
  [-0.85, 1.1],
  [-0.6, 1.08],
  [-0.35, 1.0],
  // Tongue peak
  [-0.1, 0.95],
  [0.15, 0.85],
  // Vamp slopes down to toe
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
  // Width varies along length and height
  let baseWidth: number;
  if (x < -1.0) baseWidth = 0.28;        // Heel
  else if (x < 0.0) baseWidth = 0.4;     // Midfoot
  else if (x < 0.8) baseWidth = 0.42;    // Forefoot
  else baseWidth = 0.35 - (x - 0.8) * 0.15; // Toe taper

  // Narrow toward top
  const heightNarrow = 1.0 - Math.max(0, y - 0.3) * 0.35;
  return baseWidth * heightNarrow;
}

function isInsideSoleRegion(x: number, y: number): boolean {
  return y >= -0.02 && y <= 0.22 && x >= -1.5 && x <= 1.5;
}

function createShoeShape(particleCount: number): Float32Array {
  const positions: number[] = [];
  const scale = 1.4;

  const surfaceCount = Math.floor(particleCount * 0.40);
  const soleCount = Math.floor(particleCount * 0.20);
  const interiorCount = particleCount - surfaceCount - soleCount;

  // Surface particles — on the shoe outline extruded in Z
  for (let i = 0; i < surfaceCount; i++) {
    const [px, py] = sampleProfilePoint();
    const width = getShoeWidthAtPoint(px, py);
    // Place on the surface — at the edge of the width
    const angle = Math.random() * Math.PI * 2;
    const pz = Math.sin(angle) * width;
    // Slight jitter inward for thickness
    const jitter = (Math.random() - 0.5) * 0.06;

    positions.push(
      (px + jitter) * scale,
      (py - 0.4 + jitter * 0.5) * scale,
      (pz + jitter) * scale
    );
  }

  // Sole particles — dense flat bottom
  for (let i = 0; i < soleCount; i++) {
    const px = -1.45 + Math.random() * 2.9;
    // Check if x is within sole range
    const soleEnd = px > 1.2 ? 1.5 : 1.55;
    if (px > soleEnd) { i--; continue; }

    const py = Math.random() * 0.18;
    const width = getShoeWidthAtPoint(px, 0.1);
    const pz = (Math.random() * 2 - 1) * width;

    positions.push(px * scale, (py - 0.4) * scale, pz * scale);
  }

  // Interior fill — distributed inside the shoe volume
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
  // fallback
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

function createScatteredPositions(
  particleCount: number,
  shoePositions: Float32Array,
  spreadRadius: number = 7
): Float32Array {
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.5 + Math.pow(Math.random(), 0.5) * spreadRadius;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6 - 1.0;
    positions[i3 + 2] = r * Math.cos(phi) * 0.7;
  }

  return positions;
}

export function generateParticleData(particleCount: number): ParticleData {
  const endPositions = createShoeShape(particleCount);
  const startPositions = createScatteredPositions(particleCount, endPositions);

  const animSeeds = new Float32Array(particleCount * 3);
  const dampFactors = new Float32Array(particleCount);
  const scales = new Float32Array(particleCount);

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
  }

  return {
    startPositions,
    endPositions,
    animSeeds,
    dampFactors,
    scales,
    count: particleCount,
  };
}
