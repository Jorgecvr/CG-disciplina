import * as THREE from 'three';
import { gotSecondPowerUp } from '../App.js';

// Níveis para a criação dos waypoints.
let level1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let level2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let level3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function getRandomPowerUpPosition(position) {
    let level;
    if(position == 1){
        level = level1;
    } else if(position == 2){
        level = level2
    } else level = level3;
    
    const availablePositions = [];

    // Iterar pela matriz do nível
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            // Verificar se a posição é um 0 (área onde o power-up pode ser colocado)
            if (level[i][j] === 0) {
                // Adicionar a posição (i, j) ao array de posições disponíveis
                availablePositions.push({ x: j, z: i });
            }
        }
    }

    // Verificar se há posições disponíveis
    if (availablePositions.length === 0) {
        return null;
    }

    // Selecionar uma posição aleatória
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const selectedPosition = availablePositions[randomIndex];

    // Multiplicar as coordenadas por 4 para o tamanho do bloco
    selectedPosition.x = selectedPosition.x * 4;
    selectedPosition.z = selectedPosition.z * 4;

    // Soma coordenada de acordo com o level
    if(position == 2){
        selectedPosition.x = selectedPosition.x + 84;
    } else if(position == 3){
        selectedPosition.x = selectedPosition.x + 172;
        selectedPosition.z = selectedPosition.z - 8;
    }
    
    const powerUpPosition = {
        x: selectedPosition.x, // Posição real em x
        z: selectedPosition.z  // Posição real em y
    };

    return powerUpPosition;
}


// let powerUpActive = false;

export const powerUps = [];

function createCapsulePowerUp(position) {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 32, 32);
    //const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.2
    });
    const capsule = new THREE.Mesh(geometry, material);
    
    capsule.rotation.z = Math.PI / 4; // Inclinado para evidenciar a rotação

    // Definindo a posição usando a posição passada como argumento
    capsule.position.set(position.x, 1.0, position.z); // Usando 'position.x' e 'position.z'

    capsule.userData = { type: 'energy', effect: 0.2 }; // Aumenta 20% de energia
    capsule.userData.rotationSpeed = 0.01;

    return capsule;
}

function createIcosahedronPowerUp(position) {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    // const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
    });
    const icosahedron = new THREE.Mesh(geometry, material);

    // Definindo a posição usando a posição passada como argumento
    icosahedron.position.set(position.x, 0.5, position.z); // Usando 'position.x' e 'position.y'

    icosahedron.userData = { type: 'damage', effect: 2, duration: 10000 }; // Dobra o dano por 10 segundos
    icosahedron.userData.rotationSpeed = 0.01;

    return icosahedron;
}

// Adiciona o power-up no ambiente de forma randômica
export function spawnPowerUp(scene, spawnZone) {
    //if (powerUpActive) return;

    let position = getRandomPowerUpPosition(spawnZone);

    const powerUp = Math.random() > 0.5 ? createCapsulePowerUp(position) : createIcosahedronPowerUp(position);
    powerUps.push(powerUp);
    scene.add(powerUp);

    //powerUpActive = true;
    setTimeout(() => {
        powerUp.position.set(10000, 10000, 10000); // Mover para uma coordenada extrema
        scene.remove(powerUp);
        //powerUpActive = false;
    }, 10000); // O power-up desaparece após 10 segundos se não for pego
}

/// Animação de rotação do power-up
export function animatePowerUps() {
    powerUps.forEach(powerUp => {
        powerUp.rotation.y += powerUp.userData.rotationSpeed;
    });
}

// Verifica se o player pegou o power-up
export function checkPlayerCollisionPower(player, scene) {
    powerUps.forEach((powerUp, index) => {
        const distance = player.object.position.distanceTo(powerUp.position);

        if (distance < 4) { // Distância para pegar o power-up
            if(powerUp.userData.type === 'energy'){
                player.gotFirstPowerUp();
            } else {
                gotSecondPowerUp();
            }
            powerUp.position.set(10000, 10000, 10000); // Mover para uma coordenada extrema
            scene.remove(powerUp);
            powerUps.splice(index, 1);
            //powerUpActive = false;
        }
    })
}
