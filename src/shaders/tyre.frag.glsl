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
  // UV.x = around the ring. UV.y runs bead(0) -> tread crown(0.5) -> bead(1),
  // matching the tyre profile's cross-section path.
  float distFromCrown = abs(vUv.y - 0.5) * 2.0;
  float treadMask = smoothstep(0.55, 0.15, distFromCrown);
  float sidewallMask = smoothstep(0.7, 0.95, distFromCrown);

  // Rib layout across the tread width, from a reference photo: a narrower,
  // near-smooth centre rib flanked by two patterned "shoulder" ribs, split
  // by a continuous circumferential groove — not one uniform block pattern
  // running edge to edge.
  float ribGrooveAt = 0.22;
  float ribGroove = smoothstep(0.035, 0.01, abs(distFromCrown - ribGrooveAt));
  float shoulderZone = smoothstep(ribGrooveAt, ribGrooveAt + 0.05, distFromCrown);

  // Shoulder blocks: skewing the phase across vUv.y slants the block
  // boundaries into the angled/chevron shape real tread blocks have,
  // instead of dead-straight radial lug lines.
  float skew = (vUv.y - 0.5) * 10.0;
  float blockWave = sin((vUv.x * 46.0 + skew) * 6.28318) * 0.5 + 0.5;
  float shoulderBlocks = smoothstep(0.4, 0.6, blockWave);

  // Centre rib: fine circumferential sipes, much lower contrast than the
  // shoulder blocks — this rib reads as almost smooth, like the reference.
  float centerWave = sin(vUv.x * 90.0) * 0.5 + 0.5;
  float centerPattern = 1.0 - smoothstep(0.75, 0.85, centerWave) * 0.4;

  float treadPattern = mix(centerPattern, shoulderBlocks, shoulderZone);
  treadPattern = min(treadPattern, 1.0 - ribGroove);
  float treadDepth = (1.0 - treadPattern) * treadMask * 0.06;

  // Sidewall ribbing (faint concentric lines)
  float sidewallRing = sin(distFromCrown * 60.0) * 0.5 + 0.5;
  float sidewallDetail = smoothstep(0.4, 0.6, sidewallRing) * sidewallMask * 0.012;

  // Base rubber color — neutral charcoal, not the warm/brown tint this had
  // before, which read as "old rubber" rather than a real tyre's matte
  // near-black.
  vec3 baseColor = vec3(0.1, 0.099, 0.098);
  vec3 sidewallColor = baseColor + vec3(0.006, 0.006, 0.006) - sidewallDetail;
  vec3 treadColor = baseColor * (1.0 - treadDepth * 5.5);
  vec3 color = mix(sidewallColor, treadColor, treadMask);

  // Wear variation
  float wear = noise3D(vWorldPosition * 4.5) * 0.025;
  color += wear;

  // Contact/crevice AO — darken deep into the bead near the axle and the
  // shoulder transition, where light can't reach in a real stacked heap.
  float crevice = smoothstep(0.85, 1.0, distFromCrown) * 0.5;
  color *= 1.0 - crevice;

  // Bump-mapped tread relief: raised block tops, recessed grooves, and the
  // sidewall ribs, all as a single height field. Perturbing the normal by
  // this (via screen-space derivatives, so it works without a tangent
  // attribute) lets diffuse/specular actually catch the pattern like real
  // tread relief, instead of the flat painted-on look a color-only pattern
  // gives — and unlike vertex displacement, it can't alias into jagged
  // "gear teeth" no matter how fine the pattern is.
  float treadHeight = (treadPattern - 0.5) * treadMask * 0.06;
  float sidewallHeight = (sidewallRing - 0.5) * sidewallMask * 0.01;
  float bumpHeight = treadHeight + sidewallHeight;

  vec3 normal = normalize(vNormal);
  vec3 dPdx = dFdx(vWorldPosition);
  vec3 dPdy = dFdy(vWorldPosition);
  vec3 r1 = cross(dPdy, normal);
  vec3 r2 = cross(normal, dPdx);
  float det = dot(dPdx, r1);
  float dHdx = dFdx(bumpHeight);
  float dHdy = dFdy(bumpHeight);
  vec3 surfGrad = sign(det) * (dHdx * r1 + dHdy * r2);
  normal = normalize(abs(det) * normal - surfGrad);

  // Lighting
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  float NdotL = dot(normal, lightDir);
  float diffuse = max((NdotL + 0.5) / 1.5, 0.22);

  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = pow(rim, 3.0) * 0.35;

  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 10.0) * 0.06;

  vec3 fillDir = normalize(vec3(-0.3, -0.5, 0.4));
  float fill = max(dot(normal, fillDir) + 0.3, 0.0) * 0.18;

  // Camera-facing studio fill — keeps surfaces that edge away from the
  // key light (tread bands turned side-on by the settled heap) from
  // going flat black, like a soft box near the lens.
  float camFill = max(dot(normal, viewDir), 0.0) * 0.3;

  vec3 ambient = vec3(0.16, 0.153, 0.143);
  vec3 lit = color * (ambient + diffuse * 0.85 + fill + camFill);
  lit += rim * vec3(0.18, 0.16, 0.13);
  lit += spec * vec3(0.2);

  // Dissolution edge — warm crumbling rubber
  lit += edgeGlow * vec3(0.3, 0.14, 0.04) * 0.45;

  gl_FragColor = vec4(lit, 1.0);
}
