precision mediump float;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform float uProgress;
uniform float uTime;

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
  // Dissolution
  float dissolveProgress = smoothstep(0.10, 0.38, uProgress);
  float n1 = noise3D(vWorldPosition * 2.5);
  float n2 = noise3D(vWorldPosition * 6.0 + 123.456);
  float n3 = noise3D(vWorldPosition * 13.0 + 789.0);
  float noiseVal = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;

  if (noiseVal < dissolveProgress) discard;

  float edgeDist = noiseVal - dissolveProgress;
  float edgeGlow = smoothstep(0.07, 0.0, edgeDist);

  // Tread pattern
  // UV.x = around the ring, UV.y = around the tube cross-section
  // UV.y=0 → outer surface (tread), UV.y=0.5 → inner surface
  float crossAngle = vUv.y * 6.28318;
  float outerFactor = cos(crossAngle);
  float treadMask = smoothstep(0.15, 0.7, outerFactor);

  // Circumferential grooves
  float grooves = sin(vUv.x * 140.0) * 0.5 + 0.5;
  grooves = smoothstep(0.3, 0.7, grooves);

  // Lateral block pattern
  float lateralFreq = crossAngle * 5.0 + vUv.x * 25.0;
  float lateral = sin(lateralFreq) * 0.5 + 0.5;
  lateral = smoothstep(0.35, 0.65, lateral);

  float treadPattern = grooves * lateral;
  float treadDepth = (1.0 - treadPattern) * treadMask * 0.04;

  // Base rubber color
  vec3 baseColor = vec3(0.09, 0.085, 0.08);
  vec3 sidewallColor = baseColor + vec3(0.012, 0.01, 0.008);
  vec3 treadColor = baseColor * (1.0 - treadDepth * 4.0);
  vec3 color = mix(sidewallColor, treadColor, treadMask);

  // Wear variation
  float wear = noise3D(vWorldPosition * 4.5) * 0.025;
  color += wear;

  // Lighting
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  float NdotL = dot(normal, lightDir);
  float diffuse = max((NdotL + 0.5) / 1.5, 0.12);

  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = pow(rim, 3.0) * 0.35;

  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 10.0) * 0.06;

  vec3 fillDir = normalize(vec3(-0.3, -0.5, 0.4));
  float fill = max(dot(normal, fillDir) + 0.3, 0.0) * 0.15;

  vec3 ambient = vec3(0.04, 0.038, 0.035);
  vec3 lit = color * (ambient + diffuse * 0.7 + fill);
  lit += rim * vec3(0.18, 0.16, 0.13);
  lit += spec * vec3(0.2);

  // Dissolution edge — warm crumbling rubber
  lit += edgeGlow * vec3(0.3, 0.14, 0.04) * 0.45;

  gl_FragColor = vec4(lit, 1.0);
}
