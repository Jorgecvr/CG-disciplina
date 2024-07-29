import * as THREE from 'three';
import { initRenderer, initDefaultBasicLight, setDefaultMaterial, onWindowResize } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { OBB } from '../build/jsm/math/OBB.js';

let scene, renderer, camera, controls, clock;
let tank1, tank2;
let keyboard = new KeyboardState();
let bullets = [];
let bulletSpeed = 0.5;
let bulletLimit = 2;
let walls = [];
let tankSize = { width: 2, height: 1, depth: 3 };

init();

function init() {
  scene = new THREE.Scene();
  renderer = initRenderer();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 15, 25);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  
  clock = new THREE.Clock();

  window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
  document.addEventListener('keydown', (event) => keyboard.onKeyDown(event), false);
  document.addEventListener('keyup', (event) => keyboard.onKeyUp(event), false);

  initDefaultBasicLight(scene);

  createTanks();
  createWalls();

  animate();
}

function createTanks() {
  tank1 = createTank(0xff0000);
  tank1.position.set(-10, 0.5, 0);
  tank2 = createTank(0x0000ff);
  tank2.position.set(10, 0.5, 0);
  scene.add(tank1);
  scene.add(tank2);
}

function createTank(color) {
  let tank = new THREE.Group();

  let baseMaterial = setDefaultMaterial(color);
  let baseGeometry = new THREE.BoxGeometry(tankSize.width, tankSize.height, tankSize.depth);
  let base = new THREE.Mesh(baseGeometry, baseMaterial);
  tank.add(base);

  let wheelMaterial = setDefaultMaterial(0x333333);
  for (let i = 0; i < 4; i++) {
    let wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    let wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    let x = (i < 2 ? -1 : 1) * (tankSize.width / 2 + 0.5);
    let z = (i % 2 === 0 ? -1 : 1) * (tankSize.depth / 3);
    wheel.position.set(x, -0.5, z);
    tank.add(wheel);
  }

  let cannonBaseGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI);
  let cannonBase = new THREE.Mesh(cannonBaseGeometry, baseMaterial);
  cannonBase.position.set(0, tankSize.height / 2, 0);
  tank.add(cannonBase);

  let cannonGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
  let cannon = new THREE.Mesh(cannonGeometry, baseMaterial);
  cannon.position.set(0, tankSize.height / 2, -1.5);
  cannon.rotation.x = Math.PI / 2;
  tank.add(cannon);

  tank.userData = { shotsReceived: 0, OBB: new OBB(new THREE.Vector3(), new THREE.Vector3(1, 1, 1)) };

  return tank;
}

function createWalls() {
  let wallMaterial = setDefaultMaterial(0x00ff00);

  // Create outer walls
  createWall(wallMaterial, 0, 0.5, -15, 30, 1, 1);  // Top wall
  createWall(wallMaterial, 0, 0.5, 15, 30, 1, 1);   // Bottom wall
  createWall(wallMaterial, -15, 0.5, 0, 1, 1, 30);  // Left wall
  createWall(wallMaterial, 15, 0.5, 0, 1, 1, 30);   // Right wall
  
  // Create inner walls for obstacles
  createWall(wallMaterial, -5, 0.5, 0, 1, 1, 10);   // Vertical wall in the middle-left
  createWall(wallMaterial, 5, 0.5, 0, 1, 1, 10);    // Vertical wall in the middle-right
  createWall(wallMaterial, 0, 0.5, -5, 10, 1, 1);   // Horizontal wall in the middle-top
  createWall(wallMaterial, 0, 0.5, 5, 10, 1, 1);    // Horizontal wall in the middle-bottom
}

function createWall(material, x, y, z, width, height, depth) {
  let wallGeometry = new THREE.BoxGeometry(width, height, depth);
  let wall = new THREE.Mesh(wallGeometry, material);
  wall.position.set(x, y, z);
  scene.add(wall);
  walls.push(wall);
}

function onDocumentKeyDown(event) {
  keyboard.onKeyDown(event);
}

function onDocumentKeyUp(event) {
  keyboard.onKeyUp(event);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  update();
}

function update() {
  let delta = clock.getDelta();
  updateTanks(delta);
  updateBullets(delta);
  controls.update();
  keyboard.update();
}

function updateTanks(delta) {
  moveTank(tank1, delta, 'W', 'S', 'A', 'D', ' ');
  moveTank(tank2, delta, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Slash');
}

function moveTank(tank, delta, forwardKey, backwardKey, leftKey, rightKey, shootKey) {
  let speed = 5 * delta;
  let rotateAngle = Math.PI / 2 * delta;

  if (keyboard.pressed(forwardKey)) tank.translateZ(-speed);
  if (keyboard.pressed(backwardKey)) tank.translateZ(speed);
  if (keyboard.pressed(leftKey)) tank.rotateY(rotateAngle);
  if (keyboard.pressed(rightKey)) tank.rotateY(-rotateAngle);
  
  if (keyboard.down(shootKey)) shootBullet(tank);
  
  tank.userData.OBB.set(new THREE.Vector3(), new THREE.Vector3(1, 1, 1), tank.matrixWorld);
}

function shootBullet(tank) {
  let bulletMaterial = setDefaultMaterial(0xffffff);
  let bulletGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  let bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  
  bullet.position.copy(tank.position);
  bullet.quaternion.copy(tank.quaternion);
  
  bullet.userData = { ricochetCount: 0, direction: new THREE.Vector3() };
  bullet.userData.direction.setFromMatrixPosition(tank.matrixWorld);
  bullet.userData.direction.sub(tank.position).normalize();
  
  bullets.push(bullet);
  scene.add(bullet);
}

function updateBullets(delta) {
  bullets.forEach((bullet, index) => {
    bullet.position.add(bullet.userData.direction.clone().multiplyScalar(bulletSpeed));

    if (bullet.userData.ricochetCount >= bulletLimit) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    } else {
      checkBulletCollisions(bullet, index);
    }
  });
}

function checkBulletCollisions(bullet, bulletIndex) {
  let bulletBox = new THREE.Box3().setFromObject(bullet);

  walls.forEach(wall => {
    let wallBox = new THREE.Box3().setFromObject(wall);

    if (bulletBox.intersectsBox(wallBox)) {
      bullet.userData.ricochetCount++;
      bullet.position.copy(bulletBox.getCenter(new THREE.Vector3()));
      bullet.userData.direction.reflect(wallBox.getNormal(bullet.userData.direction));
    }
  });

  [tank1, tank2].forEach(tank => {
    if (bulletBox.intersectsBox(new THREE.Box3().setFromObject(tank))) {
      tank.userData.shotsReceived++;
      scene.remove(bullet);
      bullets.splice(bulletIndex, 1);

      if (tank.userData.shotsReceived >= 10) {
        alert(`${tank === tank1 ? 'Tank 2' : 'Tank 1'} wins!`);
        resetGame();
      }
    }
  });
}

function resetGame() {
  tank1.position.set(-10, 0.5, 0);
  tank1.userData.shotsReceived = 0;

  tank2.position.set(10, 0.5, 0);
  tank2.userData.shotsReceived = 0;

  bullets.forEach(bullet => scene.remove(bullet));
  bullets = [];
}

animate();