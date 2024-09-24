import * as THREE from 'three';
import { CheckCollisionsWithWall } from './Collisions.js';
import { CriaBala } from './Bullet.js';

// Níveis para a criação dos waypoints.
let level1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 2, 2, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 2, 2, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 2, 2, 0, 1, 1],
    [1, 1, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 2, 2, 0, 1, 1],
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
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 1, 1, 1, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 1, 1, 1, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 0, 0, 0, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 0, 0, 0, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 1, 1, 1, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 0, 0, 0, 0, 4, 1, 1, 1, 0, 3, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 0, 0, 0, 0, 4, 1, 1, 1, 0, 3, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 1, 1, 1, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 5, 0, 1, 1, 1, 0, 4, 1, 1, 1, 0, 3, 1, 1, 1, 0, 2, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Armazena se os tanques adversários 2, 3 e 4 estão se movendo.
let isMoving2 = false;
let isMoving3 = false;
let isMoving4 = false;
// Armazena se os tanques adversários 2, 3 e 4 estão colidindo.
let isColliding2 = false;
let isColliding3 = false;
let isColliding4 = false;

// Armazena o waypoint aleatório para os tanques adversários 2, 3 e 4.
let waypoint2;
let waypoint3;
let waypoint4;

// Armazena variáveis para controle do tempo de movimentação e tiro para os tanques adversários 2, 3 e 4.
let lastTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];   // Array para salvar os tempos.

let shoot2 = false;
let isShooting2 = false;
let direction2 = 0;
let leftOrRight2 = 0;

let shoot3 = false;
let isShooting3 = false;
let direction3 = 0;
let leftOrRight3 = 0;

let shoot4 = false;
let isShooting4 = false;
let direction4 = 0;
let leftOrRight4 = 0;

const shootInterval2 = 1000;
const shootingInterval2 = 5000;
let swapRotationInterval2 = 400;

const shootInterval3 = 1500;
const shootingInterval3 = 4000;
let swapRotationInterval3 = 300;

const shootInterval4 = 1250;
const shootingInterval4 = 4500;
let swapRotationInterval4 = 350;

// Função para reiniciar os valores inicias na troca de níveis.
export function UpdateEnemies() {
    isMoving2 = false;
    isMoving3 = false;
    isMoving4 = false;
    isColliding2 = false;
    isColliding3 = false;
    isColliding4 = false;

    lastTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    swapRotationInterval2 = 400;
    swapRotationInterval3 = 300;
    swapRotationInterval4 = 350;

    shoot2 = false;
    isShooting2 = false;
    direction2 = 0;

    shoot3 = false;
    isShooting3 = false;
    direction3 = 0;

    shoot4 = false;
    isShooting4 = false;
    direction4 = 0;

    waypoint2 = null;
    waypoint3 = null;
    waypoint4 = null;
};

// Função para mover o tanque adversário utilizando um método de fuga e ataque com waypoints (nível 1).
export function UpdateTankPositionLevel1(player, tank, type, level, Bullet = null, scene = null) {

    // Calcula os tempos de tiro, rotação e mudança de movimento.
    const currentTime = performance.now(); // Obtém o tempo atual.

    if(currentTime - lastTimes[0] >= shootingInterval2) {
        direction2 = 0;
        isShooting2 = !isShooting2;
        swapRotationInterval2 = 400;

        lastTimes[0] = currentTime;
    }

    if(currentTime - lastTimes[1] >= shootInterval2) {
        if(isShooting2) {
            shoot2 = true;
        }

        lastTimes[1] = currentTime;
    }

    if(currentTime - lastTimes[2] >= swapRotationInterval2) {
        if(direction2 == 1) {
            leftOrRight2 = !leftOrRight2;

            swapRotationInterval2 += 100;

            lastTimes[2] = currentTime;
        }
    }

    // Criação de waypoints para onde o tanque pode se mover.
    let waypoints = [];
    
    // Criação de waypoints de segurança para quando o tanque colidir na parede.
    let safeWaypoints1 = [];
    let safeWaypoints2 = [];

    for(let i = 0; i < level1.length; i++) {
        for(let j = 0; j < level1[i].length; j++) {
            if(level1[i][j] === 0 || level1[i][j] === 2 || level1[i][j] === 3) {
                // Calcula a posição do waypoint com base nas coordenadas do mapa.
                const x = j * 4;
                const y = 0;
                const z = i * 4;

                waypoints.push(new THREE.Vector3(x, y, z));
    
                if(level1[i][j] === 2) {
                    safeWaypoints1.push(new THREE.Vector3(x, y, z));
                } else if(level1[i][j] === 3) {
                    safeWaypoints2.push(new THREE.Vector3(x, y, z));
                }
            }
        }
    }

    // Distância de fuga do player.
    const escapeDistance = 20;

    // Salva a posição atual do player.
    let playerPosition = new THREE.Vector3();
    player.object.getWorldPosition(playerPosition);

    // Salva a direção e posição atuais do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);
    let tankPosition = new THREE.Vector3();
    tank.object.getWorldPosition(tankPosition);

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tankPosition.distanceTo(playerPosition);

    // Verifica se os tanques adversários podem atirar.
    if(isShooting2) {
        if(direction2 == 0) {
            // Olha para o player.
            tank.object.lookAt(playerPosition);

            direction2 = 1;
        } else if(leftOrRight2 == 0) {
            tank.object.rotateY(0.03);
        } else {
            tank.object.rotateY(-0.03);
        }

        // Verifica se o tanque atira.
        if(shoot2) {
            Bullet.push(CriaBala(tank.object, player, tank, tank, 1, 1));
            scene.add(Bullet[Bullet.length-1].obj);

            // Após atirar faz um intervalo.
            shoot2 = false;
        }

        // Tanque se desloca devagar ao atirar.
        tank.object.translateZ(0.05);
    } else {
        // Movimenta o tanque.
        if(type == 1) {
            // Verifica se o tanque pode atirar.
            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, level);
            const collisionBlock = collisions[0];
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding2) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving2) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 32 || collisionBlock.position.x == 28 || collisionBlock.position.x == 36) {
                            
                            let randomWaypoint;
                            if(tankPosition.x >= 32) {
                                randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            } else {
                                randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            }
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
    
                            isMoving2 = true;
                        }
                    } else {
                        isColliding2 = false;
                        isMoving2 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint2;
    
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
    
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                        isColliding2 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving2) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));
    
                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);
    
                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint2 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
        
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint2 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
        
                    }
    
                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving2 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint2;
        
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
        
                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 32 || collisionBlock.position.x == 28 || collisionBlock.position.x == 36) {
                            isColliding2 = true;
                            isMoving2 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                    }
                }
            }
        }
    }
};

// Função para mover os tanques adversários utilizando um método de fuga e ataque com waypoints (nível 2).
export function UpdateTankPositionLevel2(player, tank, type, levels, Bullet = null, scene = null, oTank = null, cannon = null) {

    // Calcula os tempos de tiro, rotação e mudança de movimento.
    const currentTime = performance.now(); // Obtém o tempo atual.

    if(type == 2) {
        if(currentTime - lastTimes[0] >= shootingInterval2) {
            direction2 = 0;
            isShooting2 = !isShooting2;
            swapRotationInterval2 = 400;
    
            lastTimes[0] = currentTime;
        }
    
        if(currentTime - lastTimes[1] >= shootInterval2) {
            if(isShooting2) {
                shoot2 = true;
            }
    
            lastTimes[1] = currentTime;
        }
    
        if(currentTime - lastTimes[2] >= swapRotationInterval2) {
            if(direction2 == 1) {
                leftOrRight2 = !leftOrRight2;
    
                swapRotationInterval2 += 100;
    
                lastTimes[2] = currentTime;
            }
        }
    } else {
        if(currentTime - lastTimes[3] >= shootingInterval3) {
            direction3 = 0;
            isShooting3 = !isShooting3;
            swapRotationInterval3 = 400;
    
            lastTimes[3] = currentTime;
        }
    
        if(currentTime - lastTimes[4] >= shootInterval3) {
            if(isShooting3) {
                shoot3 = true;
            }
    
            lastTimes[4] = currentTime;
        }
    
        if(currentTime - lastTimes[5] >= swapRotationInterval3) {
            if(direction3 == 1) {
                leftOrRight3 = !leftOrRight3;
    
                swapRotationInterval3 += 100;
    
                lastTimes[5] = currentTime;
            }
        }
    }

    // Criação de waypoints para onde o tanque pode se mover.
    let waypoints = [];

    // Criação dos waypoints de segurança para quando o tanque colidir na parede.
    let safeWaypoints1 = [];
    let safeWaypoints2 = [];
    let safeWaypoints3 = [];
    let safeWaypoints4 = [];
    let safeWaypoints5 = [];
    let safeWaypoints6 = [];

    for(let i = 0; i < level2.length; i++) {
        for(let j = 0; j < level2[i].length; j++) {
            if(level2[i][j] != 1) {
                // Calcula a posição do waypoint com base nas coordenadas do mapa.
                const x = (j * 4) + 84;
                const y = 0;
                const z = i * 4;

                waypoints.push(new THREE.Vector3(x, y, z));

                if(level2[i][j] === 2) {
                    safeWaypoints1.push(new THREE.Vector3(x, y, z));
                }
                else if(level2[i][j] === 3) {
                    safeWaypoints2.push(new THREE.Vector3(x, y, z));
                } else if(level2[i][j] === 4) {
                    safeWaypoints3.push(new THREE.Vector3(x, y, z));
                } else if(level2[i][j] === 5) {
                    safeWaypoints4.push(new THREE.Vector3(x, y, z));
                } else if(level2[i][j] === 6) {
                    safeWaypoints5.push(new THREE.Vector3(x, y, z));
                } else if(level2[i][j] === 7) {
                    safeWaypoints6.push(new THREE.Vector3(x, y, z));
                }
            }
        }
    }

    // Distância de fuga do player.
    const escapeDistance = 20;

    // Salva a posição atual do player.
    let playerPosition = new THREE.Vector3();
    player.object.getWorldPosition(playerPosition);

    // Salva a direção e posição atuais do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);
    let tankPosition = new THREE.Vector3();
    tank.object.getWorldPosition(tankPosition);

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tankPosition.distanceTo(playerPosition);

    if(type == 2) {
        // Verifica se o tanque 2 pode atirar.
        if(isShooting2) {
            if(direction2 == 0) {
                // Olha para o player.
                tank.object.lookAt(playerPosition);

                direction2 = 1;
            } else if(leftOrRight2 == 0) {
                tank.object.rotateY(0.03);
            } else {
                tank.object.rotateY(-0.03);
            }

            // Verifica se o tanque atira.
            if(shoot2) {
                Bullet.push(CriaBala(tank.object, player, oTank, oTank /*Cannon*/, 2, 1));
                scene.add(Bullet[Bullet.length-1].obj);

                // Após atirar faz um intervalo.
                shoot2 = false;
            }

            // Tanque se desloca devagar ao atirar.
            tank.object.translateZ(0.05);
        } else {
            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, levels);
            const collisionBlock = collisions[0];
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding2) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving2) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 136 || collisionBlock.position.x == 132 || collisionBlock.position.x == 140 || collisionBlock.position.x == 120) {
                            
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 100 || (collisionBlock.position.x == 116 && (collisionBlock.position.z != 20 || collisionBlock.position.z != 24))) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 116 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 116 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 120 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints5[Math.floor(Math.random() * safeWaypoints5.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 120 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints6[Math.floor(Math.random() * safeWaypoints6.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        }
                    } else {
                        isColliding2 = false;
                        isMoving2 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint2;
    
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
    
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                        isColliding2 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving2) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));
        
                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);
        
                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint2 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint2 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
                    }
        
                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving2 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint2;
        
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
        
                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 136 || collisionBlock.position.x == 132 || collisionBlock.position.x == 140 || collisionBlock.position.x == 100 || collisionBlock.position.x == 116 || collisionBlock.position.x == 120) {
                            isColliding2 = true;
                            isMoving2 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                    }
                }   
            }
        }
    }
    // Movimenta o tanque 3.
    else if(type == 3) {
        if(isShooting3) {
            if(direction3 == 0) {
                // Olha para o player.
                tank.object.lookAt(playerPosition);

                direction3 = 1;
            } else if(leftOrRight3 == 0) {
                tank.object.rotateY(0.03);
            } else {
                tank.object.rotateY(-0.03);
            }

            // Verifica se o tanque atira.
            if(shoot3) {
                Bullet.push(CriaBala(tank.object, player, oTank, oTank /*Cannon*/, 2, 1));
                scene.add(Bullet[Bullet.length-1].obj);

                // Após atirar faz um intervalo.
                shoot3 = false;
            }

            // Tanque se desloca devagar ao atirar.
            tank.object.translateZ(0.05);
        } else {

            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, levels);
            const collisionBlock = collisions[0];
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding3) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving3) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 136 || collisionBlock.position.x == 132 || collisionBlock.position.x == 140 || collisionBlock.position.x == 120) {        
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 100 || (collisionBlock.position.x == 116 && (collisionBlock.position.z != 20 || collisionBlock.position.z != 24))) {        
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 116 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 116 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 120 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints5[Math.floor(Math.random() * safeWaypoints5.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 120 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints6[Math.floor(Math.random() * safeWaypoints6.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        }
                    } else {
                        isColliding3 = false;
                        isMoving3 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint3;
    
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
    
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving3 = false;
                        isColliding3 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving3) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));
        
                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);
        
                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint3 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint3 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
                    }
        
                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving3 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint3;
        
                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);
        
                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 136 || collisionBlock.position.x == 132 || collisionBlock.position.x == 140 || collisionBlock.position.x == 100 || collisionBlock.position.x == 116 || collisionBlock.position.x == 120) {
                            isColliding3 = true;
                            isMoving3 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving3 = false;
                    }
                }   
            }
        }
    }
};

// Função para mover os tanques adversários utilizando um método de fuga e ataque com waypoints (nível 3).
export function UpdateTankPositionLevel3(player, tank, type, levels, Bullet = null, scene = null, oTank = null, oTank2 = null, cannon = null) {
    // Calcula os tempos de tiro, rotação e mudança de movimento.
    const currentTime = performance.now(); // Obtém o tempo atual.

    if(type === 2) {
        if(currentTime - lastTimes[0] >= shootingInterval2) {
            direction2 = 0;
            isShooting2 = !isShooting2;
            swapRotationInterval2 = 400;

            lastTimes[0] = currentTime;
        }
        if(currentTime - lastTimes[1] >= shootInterval2) {
            if(isShooting2) {
                shoot2 = true;
            }

            lastTimes[1] = currentTime;
        }
        if(currentTime - lastTimes[2] >= swapRotationInterval2) {
            if(direction2 === 1) {
                leftOrRight2 = !leftOrRight2;

                swapRotationInterval2 += 100;

                lastTimes[2] = currentTime;
            }
        }
    }
    else if(type === 3) {
        if(currentTime - lastTimes[3] >= shootingInterval3) {
            direction3 = 0;
            isShooting3 = !isShooting3;
            swapRotationInterval3 = 300;

            lastTimes[3] = currentTime;
        }
        if(currentTime - lastTimes[4] >= shootInterval3) {
            if(isShooting3) {
                shoot3 = true;
            }

            lastTimes[4] = currentTime;
        }
        if(currentTime - lastTimes[5] >= swapRotationInterval3) {
            if(direction3 === 1) {
                leftOrRight3 = !leftOrRight3;
    
                swapRotationInterval3 += 100;
    
                lastTimes[5] = currentTime;
            }
        }
    }
    else if(type === 4) {
        if(currentTime - lastTimes[6] >= shootingInterval4) {
            direction4 = 0;
            isShooting4 = !isShooting4;
            swapRotationInterval4 = 350;

            lastTimes[6] = currentTime;
        }
        if(currentTime - lastTimes[7] >= shootInterval4) {
            if(isShooting4) shoot4 = true;

            lastTimes[7] = currentTime;
        }
        if(currentTime - lastTimes[8] >= swapRotationInterval4) {
            if(direction4 === 1) {
                leftOrRight4 = !leftOrRight4;

                swapRotationInterval4 += 100;

                lastTimes[8] = currentTime;
            }
        }
    }

    // Criação dos waypoints para onde o tanque pode se mover.
    let waypoints = [];

    // Criação dos waypoints de segurança para quando o tanque colidir na parede.
    let safeWaypoints1 = []
    let safeWaypoints2 = []
    let safeWaypoints3 = []
    let safeWaypoints4 = []

    for(let i = 0; i < level3.length; i++) {
        for(let j = 0; j < level3[i].length; j++) {
            if(level3[i][j] != 1) {
                // Calcula a posição do waypoint com base nas coordenadas do mapa.
                const x = (j*4) + 172;
                const y = 0;
                const z = (i*4) - 8;

                waypoints.push(new THREE.Vector3(x, y, z));

                if(level3[i][j] === 2) safeWaypoints1.push(new THREE.Vector3(x, y, z));
                if(level3[i][j] === 3) safeWaypoints2.push(new THREE.Vector3(x, y, z));
                if(level3[i][j] === 4) safeWaypoints3.push(new THREE.Vector3(x, y, z));
                if(level3[i][j] === 5) safeWaypoints4.push(new THREE.Vector3(x, y, z));
            }
        }
    }

    // Distância de fuga do player.
    const escapeDistance = 20;

    // Salva a posição atual do player.
    let playerPosition = new THREE.Vector3();
    player.object.getWorldPosition(playerPosition);

    // Salva a direção e posição atuais do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);
    let tankPosition = new THREE.Vector3();
    tank.object.getWorldPosition(tankPosition);

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tankPosition.distanceTo(playerPosition);

    // Movimenta o tanque 2.
    if(type === 2) {
        // Verifica se o tanque 2 pode atirar.
        if(isShooting2) {
            if(direction2 == 0) {
                // Olha para o player.
                tank.object.lookAt(playerPosition);

                direction2 = 1;
            } else if(leftOrRight2 == 0) {
                tank.object.rotateY(0.03);
            } else {
                tank.object.rotateY(-0.03);
            }

            // Verifica se o tanque atira.
            if(shoot2) {
                Bullet.push(CriaBala(tank.object, player, oTank, oTank2, 3, 1));
                scene.add(Bullet[Bullet.length-1].obj);

                // Após atirar faz um intervalo.
                shoot2 = false;
            }

            // Tanque se desloca devagar ao atirar.
            tank.object.translateZ(0.05);
        } else {
            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, levels);
            const collisionBlock = collisions[0];

            // Direção alvo do tanque.
            let targetWaypoint;

            if(isColliding2) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.

                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving2) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 236 && tankPosition.x > 236) {
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                        else if(collisionBlock.position.x == 236 && tankPosition.x < 236) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x > 216) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x < 216) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x > 196) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x < 196) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving2 = true;
                        }
                    } else {
                        isColliding2 = false;
                        isMoving2 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint2; 

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                        isColliding2 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving2) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));

                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);

                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint2 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint2 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
                    }

                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving2 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint2;

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x === 236 || collisionBlock.position.x === 216 || collisionBlock.position.x === 196) {
                            isColliding2 = true;
                            isMoving2 = false;
                        }
                    }

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving2 = false;
                    }
                }
            }
        }
    }
    // Movimenta o tanque 3.
    if(type === 3) {
        // Verifica se o tanque 3 pode atirar.
        if(isShooting3) {
            if(direction3 == 0) {
                // Olha para o player.
                tank.object.lookAt(playerPosition);

                direction3 = 1;
            } else if(leftOrRight3 == 0) {
                tank.object.rotateY(0.03);
            } else {
                tank.object.rotateY(-0.03);
            }

            // Verifica se o tanque atira.
            if(shoot3) {
                Bullet.push(CriaBala(tank.object, player, oTank, oTank2, 3, 1));
                scene.add(Bullet[Bullet.length-1].obj);

                // Após atirar faz um intervalo.
                shoot3 = false;
            }

            // Tanque se desloca devagar ao atirar.
            tank.object.translateZ(0.05);
        } else {
            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, levels);
            const collisionBlock = collisions[0];

            // Direção alvo do tanque.
            let targetWaypoint;

            if(isColliding3) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.

                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving3) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 236 && tankPosition.x > 236) {
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                        else if(collisionBlock.position.x == 236 && tankPosition.x < 236) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x > 216) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x < 216) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x > 196) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x < 196) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving3 = true;
                        }
                    } else {
                        isColliding3 = false;
                        isMoving3 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint3; 

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving3 = false;
                        isColliding3 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving3) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));

                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);

                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint3 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint3 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
                    }

                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving3 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint3;

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x === 236 || collisionBlock.position.x === 216 || collisionBlock.position.x === 196) {
                            isColliding3 = true;
                            isMoving3 = false;
                        }
                    }

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving3 = false;
                    }
                }
            }
        }
    }
    // Movimenta o tanque 4.
    if(type === 4) {
        // Verifica se o tanque 4 pode atirar.
        if(isShooting4) {
            if(direction4 == 0) {
                // Olha para o player.
                tank.object.lookAt(playerPosition);

                direction4 = 1;
            } else if(leftOrRight4 == 0) {
                tank.object.rotateY(0.03);
            } else {
                tank.object.rotateY(-0.03);
            }

            // Verifica se o tanque atira.
            if(shoot4) {
                Bullet.push(CriaBala(tank.object, player, oTank, oTank2, 3, 1));
                scene.add(Bullet[Bullet.length-1].obj);

                // Após atirar faz um intervalo.
                shoot4 = false;
            }

            // Tanque se desloca devagar ao atirar.
            tank.object.translateZ(0.05);
        } else {
            // Verifica colisão.
            const collisions = CheckCollisionsWithWall(tank, levels);
            const collisionBlock = collisions[0];

            // Direção alvo do tanque.
            let targetWaypoint;

            if(isColliding4) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.

                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving4) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 236 && tankPosition.x > 236) {
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                        else if(collisionBlock.position.x == 236 && tankPosition.x < 236) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x > 216) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                        else if(collisionBlock.position.x == 216 && tankPosition.x < 216) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x > 196) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                        else if(collisionBlock.position.x == 196 && tankPosition.x < 196) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint4 = randomWaypoint;
                            targetWaypoint = randomWaypoint;

                            isMoving4 = true;
                        }
                    } else {
                        isColliding4 = false;
                        isMoving4 = false;
                    }
                } else {
                    // Move o tanque em direção ao waypoint de segurança.
                    const targetWaypoint = waypoint4; 

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving4 = false;
                        isColliding4 = false;
                    }
                }
            } else {
                // Se não estiver se movendo cálcula um novo waypoint de deslocamento.
                if(!isMoving4) {
                    // Calcula a distância entre o player e todos os waypoints.
                    const distances = waypoints.map((waypoint) => playerPosition.distanceTo(waypoint));

                    // Ordena os waypoints com base na distância.
                    const sortedWaypoints = waypoints.map((waypoint, index) => ({waypoint: waypoint, distance: distances[index]}))
                    .sort((a, b) => a.distance - b.distance);

                    if(distanceToPlayer <= escapeDistance) {
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint4 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
                    } else {
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint4 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
                    }

                    // Se a distância desse waypoint para o tanque for maior que 10, movimenta.
                    if(tankPosition.distanceTo(targetWaypoint) >= 10) {
                        isMoving4 = true;
                    }
                } else {
                    // Move o tanque em direção ao waypoint.
                    const targetWaypoint = waypoint4;

                    tank.object.lookAt(targetWaypoint);
                    tank.object.translateZ(0.2);

                    // Se teve colisão, tanque deve se mover para os waypoints de segurança.
                    if(collisionBlock) {
                        if(collisionBlock.position.x === 236 || collisionBlock.position.x === 216 || collisionBlock.position.x === 196) {
                            isColliding4 = true;
                            isMoving4 = false;
                        }
                    }

                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        isMoving4 = false;
                    }
                }
            }
        }
    }
};