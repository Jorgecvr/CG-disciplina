// Importe as bibliotecas necessárias
import * as THREE from 'three';

// Configuração inicial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando o tanque personalizado como um objeto 3D
const tank = new THREE.Object3D();

// Base do tanque (quadrado)
const tankBaseGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const tankBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const tankBaseMesh = new THREE.Mesh(tankBaseGeometry, tankBaseMaterial);
tankBaseMesh.position.set(0, 0.25, 0); // Posição da base
tank.add(tankBaseMesh); // Adicione à hierarquia do tanque

// Topo do tanque (meia lua)
const tankTopGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
const tankTopMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const tankTopMesh = new THREE.Mesh(tankTopGeometry, tankTopMaterial);
tankTopMesh.position.set(0, 0.75, 0); // Posição do topo
tank.add(tankTopMesh); // Adicione à hierarquia do tanque

// Cano do tanque
const tankBarrelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
const tankBarrelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const tankBarrelMesh = new THREE.Mesh(tankBarrelGeometry, tankBarrelMaterial);
tankBarrelMesh.position.set(0, 1.25, 0); // Posição do cano
tank.add(tankBarrelMesh); // Adicione à hierarquia do tanque

// Posicione o tanque na cena
scene.add(tank);

// Matriz representando o quarto
const roomMatrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tileSize = 1; // Tamanho de cada célula da matriz

// Criando o nível com base na matriz
for (let row = 0; row < roomMatrix.length; row++) {
  for (let col = 0; col < roomMatrix[row].length; col++) {
    if (roomMatrix[row][col] === 1) {
      // Célula de parede
      const wallGeometry = new THREE.BoxGeometry(tileSize, tileSize, tileSize);
      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(col * tileSize, tileSize / 2, row * tileSize);
      scene.add(wall);
    } else {
      // Célula de chão
      const floorGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
      const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2;
      floor.position.set(col * tileSize, 0, row * tileSize);
      scene.add(floor);
    }
  }
}

// Restrições de movimento
const roomLimits = {
  minX: -4.5,
  maxX: 4.5,
  minZ: -4.5,
  maxZ: 4.5,
};

// Controles de movimento (use as teclas W, A, S, D)
const movementSpeed = 0.1;
const rotationSpeed = 0.02;
const keyboardState = {};

document.addEventListener('keydown', (event) => {
  keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keyboardState[event.key] = false;
});

function updateTankPosition() {
  const forwardVector = new THREE.Vector3(0, 0, -1);
  const backwardVector = new THREE.Vector3(0, 0, 1);

  if (keyboardState['w']) tank.position.add(forwardVector.clone().applyQuaternion(tank.quaternion).multiplyScalar(movementSpeed));
  if (keyboardState['s']) tank.position.add(backwardVector.clone().applyQuaternion(tank.quaternion).multiplyScalar(movementSpeed));
  if (keyboardState['a']) tank.rotation.y += rotationSpeed;
  if (keyboardState['d']) tank.rotation.y -= rotationSpeed;

  // Verifique os limites do quarto
  tank.position.x = THREE.MathUtils.clamp(tank.position.x, roomLimits.minX, roomLimits.maxX);
  tank.position.z = THREE.MathUtils.clamp(tank.position.z, roomLimits.minZ, roomLimits.maxZ);
}

// Renderização e atualização
function animate() {
  requestAnimationFrame(animate);
  updateTankPosition();
  renderer.render(scene, camera);
}

// Configurações da câmera (ajuste conforme necessário)
camera.position.set(0, 3, 5);
camera.lookAt(tank.position);

animate();