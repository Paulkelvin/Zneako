precision highp float;

// `position.xy` is this particle's texel UV into the two morph textures —
// not a real position — matching MisterPrada's FBO.createParticles
// convention (see buildMorphTextures.ts).
uniform sampler2D uTextureFrom;
uniform sampler2D uTextureTo;
uniform float uProgress; // 0 = tyre heap, 1 = shoe
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

varying float vAlpha;
varying float vGlow;
varying float vShade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Ease with deceleration at both ends, same shape as MisterPrada's mixd().
float easedMix(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  vec2 uv = position.xy;

  vec3 fromPos = texture2D(uTextureFrom, uv).xyz;
  vec3 toPos = texture2D(uTextureTo, uv).xyz;

  // Per-particle random stagger — this, more than anything else, is what
  // makes MisterPrada's morph read as organic instead of a uniform snap:
  // every particle starts and finishes at a slightly different point along
  // uProgress instead of all moving in lockstep.
  float stagger = hash(uv) * 0.5;
  float localT = clamp((uProgress - stagger * 0.5) / max(0.0001, 1.0 - stagger * 0.5), 0.0, 1.0);
  float t = easedMix(localT);

  vec3 pos = mix(fromPos, toPos, t);

  // Organic in-flight drift: peaks mid-morph, settles back to zero at both
  // rest states so the tyre heap and the shoe both read as solid/settled.
  float flight = sin(localT * 3.14159265);
  float n = hash(uv * 3.7 + uTime * 0.05);
  pos.x += sin(uTime * 0.6 + uv.y * 20.0) * 0.05 * flight;
  pos.y += cos(uTime * 0.5 + uv.x * 24.0) * 0.05 * flight;
  pos.z += (n - 0.5) * 0.12 * flight;

  // Pseudo-shading: points have no real normal, but for a roughly
  // convex/blobby form (a torus, a lofted shoe shell) the vector from an
  // approximate shape center out to the point is a decent stand-in for one.
  // Without this every particle glows equally bright and the cloud reads as
  // a flat haze; with it, the "far" side of the tyre pile and the sole of
  // the shoe fall into shadow the way a real lit object would.
  vec3 pseudoCenter = vec3(0.0, 0.35, 0.0);
  vec3 pseudoNormal = normalize(pos - pseudoCenter);
  vec3 lightDir = normalize(vec3(0.45, 0.75, 0.6));
  float lit = dot(pseudoNormal, lightDir) * 0.5 + 0.5;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  float sizeJitter = 0.6 + hash(uv + 4.2) * 0.8;
  gl_PointSize = uSize * sizeJitter * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vAlpha = 0.55 + 0.45 * flight;
  vGlow = flight;
  vShade = mix(0.3, 1.35, lit);
}
