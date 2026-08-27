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

void main() {
  float randVal = fract(sin(dot(animSeed.xy, vec2(12.9898, 78.233))) * 43758.5453);
  vRandomVal = randVal;

  // ── Phase timing ──
  // Particles emerge as tyres dissolve, staggered by formationOrder
  float revealDelay = formationOrder * 0.06;
  float reveal = smoothstep(0.06 + revealDelay, 0.28 + revealDelay, uProgress);
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
