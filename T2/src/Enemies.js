import * as THREE from 'three';

// Níveis para a criação dos waypoints.
// let level1 = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// ];
let level = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];



// Função para mover os tanques adversários utilizando um método de fuga e ataque.
export function UpdateTankPosition(player, tank, shoot, levelType = 1) {
    // Criação de waypoints para onde o tanque pode se mover.
    let waypoints = [];

    for(let i = 0; i < level.length; i++) {
        for(let j = 0; j < level[i].length; j++) {
            if(level[i][j] === 0) {
                // Calcula a posição do waypoint com base nas coordenadas do mapa.
                const x = j * 4;
                const y = 0;
                const z = i * 4;

                waypoints.push(new THREE.Vector3(x, y, z));
            }
        }
    }

    const escapeDistance = 20;    // Distância de fuga.
    const attackDistance = 25;    // Distância de ataque.
    const rotationSpeed = 0.02;   // Velocidade de rotação.

    // Pega a direção atual do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);

    // Calcula o vetor de direção para rotacionar o tanque.
    const targetDirection = new THREE.Vector3().subVectors(player.position, tank.object.position).normalize();

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tank.object.position.distanceTo(player.position);

    if(distanceToPlayer < escapeDistance) {
        // Rotaciona o tanque em direção ao jogador.
        const currentRotation = tank.object.rotation.y;
        const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
        const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation)
        tank.object.rotation.set(0, newRotation, 0);

        // Foge do jogador.
        tank.object.translateZ(-0.2);
    } else if(distanceToPlayer > attackDistance) {
        // Rotaciona o tanque em direção ao jogador.
        const currentRotation = tank.object.rotation.y;
        const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
        const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation)
        tank.object.rotation.set(0, newRotation, 0);

        // Ataca o jogador.
        tank.object.translateZ(0.25);
    }

    // Atira.
    if(shoot) {
        console.log("ATIRA");
    }
        
};

// // Função para mover os tanques adversários utilizando um método de fuga e ataque.
// export function UpdateTankPosition(player, tank) {
//     const distanceThreshold = 10; // Distância para atirar.
//     const fleeDistance = 20;      // Distância de fuga.
//     const attackDistance = 15;    // Distância de ataque.

//     // Calcula o vetor de fuga para o tanque adversário.
//     const fleeVector = new THREE.Vector3().subVectors(tank.position, player.position);
//     const distanceToPlayer = fleeVector.length();

//     if(distanceToPlayer < fleeDistance) {
//         // Foge do jogador.
//         fleeVector.normalize().multiplyScalar(0.05);
//         tank.position.add(fleeVector);
//     } else if(distanceToPlayer < attackDistance) {
//         // Atira se estiver próximo o suficiente.
//         if(playerIsLookingAtTank(player, tank)) {
//             // LÓGICA DE TIRO.
//             console.log("ATIRA");
//         }
//     } else {
//         // Aproxima-se do jogador quando ele não estiver olhando.
//         approachPlayer(player, tank);
//     }
// };

// // Função que verifica se o jogador está olhando para o tanque:
// function playerIsLookingAtTank(player, tank) {
//     // Supõe uma câmera associada ao jogador.
//     const cameraDirection = new THREE.Vector3;
//     player.getWorldDirection(cameraDirection);

//     // Calcula o vetor entre o tanque o jogador.
//     const vetorTanqueJogador = new THREE.Vector3().subVectors(tank.position, player.position);

//     // Verifique se o ângulo entre os vetores é pequeno o suficiente (por exemplo, < 45 graus).
//     const angulo = cameraDirection.angleTo(vetorTanqueJogador);
//     const anguloLimite = Math.PI / 4;
//     return angulo < anguloLimite;
// };

// // Função para aproximar o tanque do jogador.
// function approachPlayer(player, tank) {
//     // Verifica se o jogador não está olhando para o tanque.
//     if(!playerIsLookingAtTank(player, tank)) {
//         // Calcula o vetor direção do tanque para o jogador.
//         const targetDirection = new THREE.Vector3().subVectors(player.position, tank.position).normalize();

//         // Pega a direção atual do tanque.
//         let tankDirection = new THREE.Vector3();
//         tank.getWorldDirection(tankDirection);
        
//         // Rotaciona a direção do tanque até que ela estaja virada para o jogador.
//         if(!(Math.abs(targetDirection.x - tankDirection.x) <= 0.005 && Math.abs(targetDirection.z - tankDirection.z) <= 0.005)) {
//             tank.rotateY(0.01);
//         } else {
//         }
//         tank.translateZ(0.15);
//     }
// };