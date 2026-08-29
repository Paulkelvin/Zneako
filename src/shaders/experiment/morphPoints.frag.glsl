precision highp float;

varying float vAlpha;
varying float vGlow;
varying float vShade;

void main() {
  // Soft radial falloff sprite — bright core fading to nothing at the
  // circle edge — same trick as MisterPrada's particles.frag, additively
  // blended so overlapping particles build up into brighter cores instead
  // of overwriting each other.
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / max(distanceToCenter, 0.001) - 0.1;
  strength = clamp(strength, 0.0, 3.0);
  strength *= vShade;

  // Warm rubber-ember colour at rest, shifting toward a brighter amber
  // spark while a particle is mid-flight between the two forms.
  vec3 emberColor = vec3(0.85, 0.32, 0.08);
  vec3 sparkColor = vec3(1.0, 0.68, 0.25);
  vec3 color = mix(emberColor, sparkColor, vGlow);

  gl_FragColor = vec4(color * strength, strength * vAlpha);
}
