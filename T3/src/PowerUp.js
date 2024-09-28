import * as THREE from 'three';
import { gotSecondPowerUp } from '../App.js';

// Níveis para a criação dos waypoints.
let level1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let level2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 4, 0, 0, 0, 0, 6, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 5, 0, 0, 0, 0, 7, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    } else if( position == 2){
        level = level2
    } else level = level3;
    
    const availablePositions = [];

    // Iterar pela matriz do nível
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            // Verificar se a posição é um 0 (área onde o power-up pode ser colocado)
            if (level[i][j] === 0) {
                // Adicionar a posição (i, j) ao array de posições disponíveis
                availablePositions.push({ x: j, y: i });
            }
        }
    }

    // Verificar se há posições disponíveis
    if (availablePositions.length === 0) {
        console.log("Não há posições disponíveis para o power-up.");
        return null; // Nenhuma posição disponível
    }

    // Selecionar uma posição aleatória
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const selectedPosition = availablePositions[randomIndex];


    // Multiplicar as coordenadas por 4 para o tamanho do bloco
    selectedPosition.x = selectedPosition.x * 4;
    selectedPosition.y = selectedPosition.y * 4;

    // Soma coordenada de acordo com o level
    if(position == 2){
        selectedPosition.x = selectedPosition.x + 76 ;
    } else if(position == 3){
        selectedPosition.x = selectedPosition.x + 164;
        selectedPosition.y = selectedPosition.y -8 ;
    }
    
    const powerUpPosition = {
        x: selectedPosition.x, // Posição real em x
        y: selectedPosition.y  // Posição real em y
    };

    return powerUpPosition;
}


// let powerUpActive = false;

export const powerUps = [];

function createCapsulePowerUp(position) {
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(geometry, material);
    
    capsule.rotation.z = Math.PI / 4; // Inclinado para evidenciar a rotação

    // Definindo a posição usando a posição passada como argumento
    capsule.position.set(position.x, 1.0, position.y); // Usando 'position.x' e 'position.y'

    capsule.userData = { type: 'energy', effect: 0.2 }; // Aumenta 20% de energia
    capsule.userData.rotationSpeed = 0.01;

    return capsule;
}

function createIcosahedronPowerUp(position) {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const icosahedron = new THREE.Mesh(geometry, material);

    // Definindo a posição usando a posição passada como argumento
    icosahedron.position.set(position.x, 0.5, position.y); // Usando 'position.x' e 'position.y'

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
