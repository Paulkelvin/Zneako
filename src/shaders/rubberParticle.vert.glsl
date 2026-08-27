// Per-instance attributes
attribute vec3 positionStart;
attribute vec3 positionEnd;
attribute vec3 animSeed;
attribute float dampFactor;
attribute float scale;

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

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float getStaggeredProgress(float globalProgress, float stagger) {
  float adjusted = (globalProgress - stagger * 0.3) / (1.0 - stagger * 0.3);
  return clamp(adjusted, 0.0, 1.0);
}

void main() {
  float randVal = fract(sin(dot(animSeed.xy, vec2(12.9898, 78.233))) * 43758.5453);
  vRandomVal = randVal;

  float stagger = fract(sin(dot(positionEnd.xy, vec2(7.13, 17.31))) * 2531.71);

  float localProgress = getStaggeredProgress(uProgress, stagger);
  float easedProgress = easeInOutCubic(localProgress);
  vProgress = easedProgress;

  // Interpolate between scattered and formed positions
  vec3 morphedPosition = mix(positionStart, positionEnd, easedProgress);

  // Drift animation when particles are scattered
  float driftFade = 1.0 - smoothstep(0.0, 0.5, easedProgress);
  vec3 timeOffsets = uTime * uDriftSpeed + animSeed;
  vec3 drift = vec3(
    sin(timeOffsets.x) * cos(timeOffsets.y * 0.7),
    sin(timeOffsets.y) * cos(timeOffsets.z * 0.8),
    sin(timeOffsets.z) * cos(timeOffsets.x * 0.6)
  );
  float driftScale = uDriftAmplitude * mix(0.3, 1.0, dampFactor) * driftFade;
  morphedPosition += drift * driftScale;

  // Subtle breathing when fully formed
  float breathe = sin(uTime * 0.5 + randVal * 6.28) * 0.015 * easedProgress;
  morphedPosition += normalize(positionEnd + vec3(0.001)) * breathe;

  // Scale the local vertex position by instance scale
  float particleScale = scale * mix(1.2, 0.85, easedProgress);
  vec3 localPos = position * particleScale;

  // Random rotation per instance for irregularity
  float angle = randVal * 6.28318;
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotatedPos = vec3(
    localPos.x * cosA - localPos.z * sinA,
    localPos.y,
    localPos.x * sinA + localPos.z * cosA
  );

  // Final world position: morph target + local rotated vertex
  vec3 finalPos = morphedPosition + rotatedPos;

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(finalPos, 1.0);
  vWorldPosition = worldPos.xyz;

  // Normal transform
  mat3 normalMat = mat3(modelMatrix * instanceMatrix);
  vNormal = normalize(normalMat * normal);

  // Color
  float edgeFactor = 1.0 - abs(dot(normalize(cameraPosition - worldPos.xyz), vNormal));
  vColor = mix(uColorBase, uColorHighlight, edgeFactor * 0.15 * easedProgress);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
