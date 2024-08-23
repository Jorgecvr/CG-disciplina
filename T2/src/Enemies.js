import * as THREE from 'three';
import { CheckCollisionsWithWall } from './Collisions.js';

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

// Armazena se os tanques adversários 2 e 3 estão se movendo.
let isMoving2 = false;
let isMoving3 = false;
// Armazena se os tanques adversários 2 e 3 estão colidindo.
let isColliding2 = false;
let isColliding3 = false;

// Armazena o waypoint aleatório para os tanques adversários 2 e 3.
let waypoint2;
let waypoint3;

// Armazena variáveis para controle do tempo de movimentação e tiro.
let shoot = false;
let isShooting = false;
let lastTime = 0;
const shootInterval = 1000;           // 1 segundo.
const shootingInterval = 3000;        // 3 segundos.
const swapRotationInterval = 1000.    // 1 segundo.

// Função para reiniciar os valores inicias na troca de níveis.
export function UpdateEnemies() {
    isMoving2 = false;
    isMoving3 = false;
    isColliding2 = false;
    isColliding3 = false;

    let shoot = false;
    let isShooting = false;
    let lastTime = 0;

    waypoint2 = null;
    waypoint3 = null;
};

// Função para mover o tanque adversário utilizando um método de fuga e ataque com waypoints (nível 1).
export function UpdateTankPositionLevel1(player, tank, type, level) {

    // Cálcula os tempos.

    // // Obtém o tempo atual.
    // const currentTime = performance.now();
    // // shoot = false;
    // // Verifica se já se passaram 3 segundos.
    // if(currentTime - lastTime >= interval) {
    //     shoot = !shoot;
    //     lastTime = currentTime;
    //     // tank2.kill(scene);
    //     // camera.initCamera(1, tank1.object.getWorldPosition(new THREE.Vector3), tank3.object.getWorldPosition(new THREE.Vector3));
    //     // interval = 10000000000000;
    // }


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
    player.getWorldPosition(playerPosition);

    // Salva a direção e posição atuais do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);
    let tankPosition = new THREE.Vector3();
    tank.object.getWorldPosition(tankPosition);

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tankPosition.distanceTo(playerPosition);

    // // Verifica se os tanques adversários podem atirar.
    // if(shoot) {
    //     tank.object.lookAt(playerPosition);
    //     console.log("ATIRA");
    // }

    // Movimenta o tanque.
    if(type == 2) {
        // Verifica se o tanque pode atirar.
        // Verifica colisão.
        const {collisionBlock, collisionType} = CheckCollisionsWithWall(tank, level);

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

// Função para mover os tanques adversários utilizando um método de fuga e ataque com waypoints (nível 2).
export function UpdateTankPositionLevel2(player, tank, type, level) {
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
                const x = j * 4;
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
    player.getWorldPosition(playerPosition);

    // Salva a direção e posição atuais do tanque adversário.
    let tankDirection = new THREE.Vector3();
    tank.object.getWorldDirection(tankDirection);
    let tankPosition = new THREE.Vector3();
    tank.object.getWorldPosition(tankPosition);

    // Calcula a distância do tanque para o player.
    const distanceToPlayer = tankPosition.distanceTo(playerPosition);

    // Verifica se os tanques adversários podem atirar.
    // if(shoot) {
    //     tank.object.lookAt(playerPosition);
    //     console.log("ATIRA");
    // // } else {
        // Movimenta o tanque 2.
        if(type == 2) {
            // Verifica colisão.
            const {collisionBlock, collisionType} = CheckCollisionsWithWall(tank, level);
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding2) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving2) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 36) {
        
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 16 || (collisionBlock.position.x == 32 && (collisionBlock.position.z != 20 || collisionBlock.position.z != 24))) {
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 32 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 32 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 36 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints5[Math.floor(Math.random() * safeWaypoints5.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 36 && collisionBlock.position.z == 24) {
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
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 16 || collisionBlock.position.x == 32 || collisionBlock.position.x == 36) {
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
        // Movimenta o tanque 3.
        else if(type == 3) {
            // Verifica se o tanque pode atirar.
            // Verifica colisão.
            const {collisionBlock, collisionType} = CheckCollisionsWithWall(tank, level);
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding3) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving3) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 36) {        
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 16 || (collisionBlock.position.x == 32 && (collisionBlock.position.z != 20 || collisionBlock.position.z != 24))) {        
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 32 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints3[Math.floor(Math.random() * safeWaypoints3.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 32 && collisionBlock.position.z == 24) {
                            const randomWaypoint = safeWaypoints4[Math.floor(Math.random() * safeWaypoints4.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 36 && collisionBlock.position.z == 20) {
                            const randomWaypoint = safeWaypoints5[Math.floor(Math.random() * safeWaypoints5.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 36 && collisionBlock.position.z == 24) {
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
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 16 || collisionBlock.position.x == 32 || collisionBlock.position.x == 36) {
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
    // }
    
};