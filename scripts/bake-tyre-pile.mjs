// Offline pre-bake: drops tyre-approximating discs onto a ground plane under
// gravity, lets them settle naturally, then prints the resting transforms.
// Run with `node scripts/bake-tyre-pile.mjs` and paste the output into
// TYRE_CONFIGS in src/utils/generateParticles.ts. Not used at runtime.
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const TYRE_MAJOR_R = 0.55;
const TYRE_MINOR_R = 0.17;
const TYRE_COUNT = 6;
const SEED = 42;

let seed = SEED;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function randRange(a, b) {
  return a + rand() * (b - a);
}

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

const groundBody = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane() });
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.set(0, -0.6, 0);
world.addBody(groundBody);

const wallMaterial = new CANNON.Material('wall');
const tyreMaterial = new CANNON.Material('tyre');
world.addContactMaterial(
  new CANNON.ContactMaterial(wallMaterial, tyreMaterial, { friction: 0.7, restitution: 0.0 })
);
world.addContactMaterial(
  new CANNON.ContactMaterial(tyreMaterial, tyreMaterial, { friction: 0.8, restitution: 0.02 })
);

const CORRAL_R = 1.5;
const wallSegments = 12;
for (let i = 0; i < wallSegments; i++) {
  const a = (i / wallSegments) * Math.PI * 2;
  const wall = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial });
  wall.addShape(new CANNON.Box(new CANNON.Vec3(0.35, 1.6, 0.03)));
  wall.position.set(Math.cos(a) * CORRAL_R, 0.6, Math.sin(a) * CORRAL_R);
  wall.quaternion.setFromEuler(0, Math.PI / 2 - a, 0);
  world.addBody(wall);
}

const bodies = [];
const scales = [];

for (let t = 0; t < TYRE_COUNT; t++) {
  const scale = randRange(0.85, 1.08);
  scales.push(scale);
  const r = (TYRE_MAJOR_R + TYRE_MINOR_R) * scale;
  const h = TYRE_MINOR_R * 2 * scale;

  const shape = new CANNON.Cylinder(r, r, h, 20);
  const body = new CANNON.Body({ mass: 4 * scale, material: tyreMaterial });
  body.addShape(shape);
  body.linearDamping = 0.35;
  body.angularDamping = 0.5;

  const ringAngle = (t / TYRE_COUNT) * Math.PI * 2 + randRange(-0.5, 0.5);
  const ringR = randRange(0.3, 1.15);
  body.position.set(
    Math.cos(ringAngle) * ringR,
    0.35 + t * 0.16,
    Math.sin(ringAngle) * ringR
  );

  const tiltX = randRange(0, Math.PI * 0.55);
  const spinY = randRange(0, Math.PI * 2);
  const tiltZ = randRange(-0.3, 0.3);
  body.quaternion.setFromEuler(tiltX, spinY, tiltZ);
  body.velocity.set(randRange(-0.3, 0.3), 0, randRange(-0.3, 0.3));

  world.addBody(body);
  bodies.push(body);
}

const fixedStep = 1 / 60;
const steps = 60 * 8;
for (let i = 0; i < steps; i++) {
  world.step(fixedStep);
}

console.log('export const TYRE_CONFIGS: TyreConfig[] = [');
for (let i = 0; i < bodies.length; i++) {
  const b = bodies[i];
  const q = new THREE.Quaternion(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
  const euler = new THREE.Euler().setFromQuaternion(q, 'XYZ');
  const px = b.position.x.toFixed(3);
  const py = b.position.y.toFixed(3);
  const pz = b.position.z.toFixed(3);
  const rx = euler.x.toFixed(3);
  const ry = euler.y.toFixed(3);
  const rz = euler.z.toFixed(3);
  console.log(
    `  { position: [${px}, ${py}, ${pz}], rotation: [${rx}, ${ry}, ${rz}], scale: ${scales[i].toFixed(3)} },`
  );
}
console.log('];');
