precision mediump float;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vProgress;
varying float vRandomVal;
varying vec3 vColor;
varying float vReveal;

uniform vec3 uLightDir;
uniform float uTime;
uniform vec3 uAmbientColor;
uniform float uRoughness;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // Wrap diffuse for soft rubber look
  float NdotL = dot(normal, lightDir);
  float diffuse = max((NdotL + 0.6) / 1.6, 0.15);

  // Rim light — makes particles visible against dark background
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = pow(rim, 2.0) * 0.6;

  // Secondary fill light from below-left
  vec3 fillDir = normalize(vec3(-0.3, -0.5, 0.4));
  float fill = max(dot(normal, fillDir) + 0.3, 0.0) * 0.25;

  // Very subtle specular
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 6.0) * 0.12;

  // Micro-surface grain
  float grain = fract(sin(dot(vWorldPosition.xz * 40.0, vec2(12.9898, 78.233))) * 43758.5453);
  float grainEffect = mix(0.9, 1.1, grain);

  // Combine
  vec3 ambient = uAmbientColor * 0.5;
  vec3 lit = vColor * (ambient + diffuse * 0.8 + fill) * grainEffect;
  lit += rim * vec3(0.35, 0.32, 0.28);
  lit += spec * vec3(0.4, 0.38, 0.35);

  // Depth fog — fades toward the hero's own white background instead of
  // near-black, so distant particles blend into the page rather than
  // leaving a dark halo floating on a light backdrop.
  float depth = length(cameraPosition - vWorldPosition);
  float fog = 1.0 - smoothstep(20.0, 50.0, depth);
  vec3 fogColor = vec3(1.0, 1.0, 1.0);
  vec3 finalColor = mix(fogColor, lit, fog);

  float alpha = vReveal * mix(0.9, 1.0, vProgress);

  gl_FragColor = vec4(finalColor, alpha);
}
