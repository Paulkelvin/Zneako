attribute vec3 positionStart;
attribute vec3 positionEnd;
attribute vec3 animSeed;
attribute float dampFactor;
attribute float scale;
attribute float formationOrder;

uniform float uProgress;
uniform float uTime;
uniform float uDriftSpeed;
uniform float uDriftAmplitude;
uniform vec3 uColorBase;
uniform vec3 uColorHighlight;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vProgress;
varying float vRandomVal;
varying vec3 vColor;
varying float vReveal;

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

// Same hash/noise and dissolve domain as tyre.frag.glsl, evaluated at each
// particle's own start position — so a chunk reveals right around when the
// tyre surface at that same spot erodes away, instead of on an unrelated
// per-particle random delay. The two shaders can't share GLSL source, so
// this is intentionally kept identical to tyre.frag.glsl's version.
float hash3(vec3 p) {
  p = fract(p * vec3(443.897, 397.297, 491.187));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x),
        mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x),
        mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

void main() {
  float randVal = fract(sin(dot(animSeed.xy, vec2(12.9898, 78.233))) * 43758.5453);
  vRandomVal = randVal;

  // ── Phase timing ──
  // Particles emerge as the tyre erodes at that same location: sample the
  // tyre shader's own dissolve noise at this particle's start position, and
  // invert its smoothstep(0.10, 0.38, uProgress) threshold (linearised —
  // exact enough for a stagger curve) to find the uProgress this chunk
  // should reveal at.
  vec3 startWorldPos = (modelMatrix * instanceMatrix * vec4(positionStart, 1.0)).xyz;
  float n1 = noise3D(startWorldPos * 2.5);
  float n2 = noise3D(startWorldPos * 6.0 + 123.456);
  float n3 = noise3D(startWorldPos * 13.0 + 789.0);
  float tyreNoiseVal = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;

  float revealCenter = 0.10 + 0.28 * tyreNoiseVal;
  float reveal = smoothstep(revealCenter - 0.05, revealCenter + 0.09, uProgress);
  vReveal = reveal;

  // Detach from tyre surface
  float detachDelay = formationOrder * 0.08;
  float detach = smoothstep(0.12 + detachDelay, 0.35 + detachDelay * 0.6, uProgress);

  // Morph toward shoe — sole (formationOrder ~0) arrives first
  float morphDelay = formationOrder * 0.25;
  float morphRaw = smoothstep(0.38 + morphDelay, 0.82 + morphDelay * 0.12, uProgress);
  float easedMorph = easeInOutCubic(morphRaw);
  vProgress = easedMorph;

  // ── Position interpolation ──
  vec3 morphedPosition = mix(positionStart, positionEnd, easedMorph);

  // ── Drift: active after detach, fades as shoe forms ──
  float driftIntensity = detach * (1.0 - easedMorph * 0.85);
  vec3 timeOffsets = uTime * uDriftSpeed + animSeed;
  vec3 drift = vec3(
    sin(timeOffsets.x) * cos(timeOffsets.y * 0.7),
    sin(timeOffsets.y) * cos(timeOffsets.z * 0.8),
    sin(timeOffsets.z) * cos(timeOffsets.x * 0.6)
  );
  float driftScale = uDriftAmplitude * mix(0.3, 1.0, dampFactor) * driftIntensity;
  morphedPosition += drift * driftScale;

  // ── Breathing when formed ──
  float breathe = sin(uTime * 0.5 + randVal * 6.28) * 0.015 * easedMorph;
  morphedPosition += normalize(positionEnd + vec3(0.001)) * breathe;

  // ── Scale: particles invisible at start, grow as tyres dissolve ──
  float particleScale = scale * reveal * mix(1.2, 0.85, easedMorph);
  vec3 localPos = position * particleScale;

  // ── Random rotation per instance ──
  float angle = randVal * 6.28318;
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotatedPos = vec3(
    localPos.x * cosA - localPos.z * sinA,
    localPos.y,
    localPos.x * sinA + localPos.z * cosA
  );

  vec3 finalPos = morphedPosition + rotatedPos;

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(finalPos, 1.0);
  vWorldPosition = worldPos.xyz;

  mat3 normalMat = mat3(modelMatrix * instanceMatrix);
  vNormal = normalize(normalMat * normal);

  float edgeFactor = 1.0 - abs(dot(normalize(cameraPosition - worldPos.xyz), vNormal));
  vColor = mix(uColorBase, uColorHighlight, edgeFactor * 0.15 * easedMorph);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
