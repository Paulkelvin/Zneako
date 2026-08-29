import * as THREE from 'three';

// Square-ish texture dimensions covering `count` particles. The particle
// vertex shader treats each texel as one particle's position, addressed by
// UV — same convention as MisterPrada's FBO (see reference notes below).
export function textureSizeFor(count: number): { width: number; height: number } {
  const width = Math.ceil(Math.sqrt(count));
  const height = Math.ceil(count / width);
  return { width, height };
}

// Packs a flat [x0,y0,z0, x1,y1,z1, ...] position array into an RGBA float
// DataTexture, one particle per texel — MisterPrada's makeTexture() does the
// same thing from a GLTF mesh's raw (shuffled) vertex array; ours draws from
// MeshSurfaceSampler output instead, which is already evenly distributed
// across the source surface, so no shuffle step is needed.
export function packPositionsToDataTexture(
  positions: Float32Array,
  width: number,
  height: number
): THREE.DataTexture {
  const count = positions.length / 3;
  const data = new Float32Array(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const src = i < count ? i : i % count;
    data[i * 4 + 0] = positions[src * 3 + 0];
    data[i * 4 + 1] = positions[src * 3 + 1];
    data[i * 4 + 2] = positions[src * 3 + 2];
    data[i * 4 + 3] = 1.0;
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  // Each texel is an independent, unrelated random sample — adjacent texels
  // have no spatial relationship, so linear filtering (three's default)
  // would blend neighbouring particles' positions into meaningless average
  // points and smear the whole shape into mush. MisterPrada's own FBO.js
  // sets this for the same reason ("we want to sample square pixels").
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

// The particle geometry itself: one vertex per texel, carrying that texel's
// UV (in `position.xy`, matching MisterPrada's FBO.createParticles) so the
// vertex shader can look up the real 3D position from the morph textures.
// Addressed at texel centers, not edges, so a NearestFilter sample can't
// land exactly on a boundary and round to the wrong neighbour.
export function createParticleUvGeometry(width: number, height: number): THREE.BufferGeometry {
  const count = width * height;
  const vertices = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    vertices[i3 + 0] = (i % width) / width + 0.5 / width;
    vertices[i3 + 1] = Math.floor(i / width) / height + 0.5 / height;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  return geometry;
}
