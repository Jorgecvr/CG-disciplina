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
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
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

// Função para reiniciar os valores inicias na troca de níveis.
export function UpdateEnemies() {
    isMoving2 = false;
    isMoving3 = false;
    isColliding2 = false;
    isColliding3 = false;

    waypoint2 = null;
    waypoint3 = null;
};

// Função para mover o tanque adversário utilizando um método de fuga e ataque com waypoints (nível 1).
export function UpdateTankPositionLevel1(player, tank, shoot, type = 2, level = null, scene = null) {
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

    // Movimenta o tanque.
    if(type == 2) {
        // Verifica se o tanque pode atirar.
        if(shoot) {
            tank.object.lookAt(playerPosition);
            console.log("ATIRA");
        } else {
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
                            console.log("Movimento de Colisão");
                            
                            let randomWaypoint;
                            if(tankPosition.x >= 32) {
                                randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            } else {
                                randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            }
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
    
                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                            sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                            scene.add(sphere);
    
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
                        console.log("Verificação");
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
                        console.log("Movimento de Defesa");
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint2 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    } else {
                        console.log("Movimento de Ataque");
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint2 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    }

                    console.log(tankPosition.distanceTo(targetWaypoint));

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
                            console.log("Colisão");
                            isColliding2 = true;
                            isMoving2 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        console.log("Verificação");
                        isMoving2 = false;
                    }
                }
            }
        }
    }
}

// Função para mover os tanques adversários utilizando um método de fuga e ataque com waypoints (nível 2).
export function UpdateTankPositionLevel2(player, tank, shoot, type = 2, level = null, scene = null) {
    // Criação de waypoints para onde o tanque pode se mover.
    let waypoints = [];

    // Criação dos waypoints de segurança para quando o tanque colidir na parede.
    let safeWaypoints1 = [];
    let safeWaypoints2 = [];

    for(let i = 0; i < level2.length; i++) {
        for(let j = 0; j < level2[i].length; j++) {
            if(level2[i][j] === 0 || level2[i][j] === 2 || level2[i][j] === 3) {
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

    // Movimenta o tanque 2.
    if(type == 2) {
        // Verifica se o tanque pode atirar.
        if(shoot) {
            tank.object.lookAt(playerPosition);
            console.log("ATIRA");
        } else {
            // Verifica colisão.
            const {collisionBlock, collisionType} = CheckCollisionsWithWall(tank, level);
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding2) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving2) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56) {
                            console.log("Movimento de Colisão");
            
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                            sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                            scene.add(sphere);
            
                            isMoving2 = true;
                        } else if(collisionBlock.position.x == 16) {
                            console.log("Movimento de Colisão");
            
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint2 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                            sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                            scene.add(sphere);
            
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
                        console.log("Verificação");
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
                        console.log("Movimento de Defesa");
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint2 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    } else {
                        console.log("Movimento de Ataque");
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint2 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    }
    
                    console.log(tankPosition.distanceTo(targetWaypoint));
        
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
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 16) {
                            console.log("Colisão");
                            isColliding2 = true;
                            isMoving2 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        console.log("Verificação");
                        isMoving2 = false;
                    }
                }   
            }
        }
    }
    // Movimenta o tanque 3.
    else if(type == 3) {
        // Verifica se o tanque pode atirar.
        if(shoot) {
            tank.object.lookAt(playerPosition);
            console.log("ATIRA");
        } else {
            // Verifica colisão.
            const {collisionBlock, collisionType} = CheckCollisionsWithWall(tank, level);
    
            // Direção alvo do tanque.
            let targetWaypoint;
    
            if(isColliding3) {
                // Se teve colisão, tanque deve se mover para os waypoints de segurança.
    
                // Se não estiver se movendo pega o waypoint de segurança.
                if(!isMoving3) {
                    if(collisionBlock) {
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56) {
                            console.log("Movimento de Colisão");
            
                            const randomWaypoint = safeWaypoints1[Math.floor(Math.random() * safeWaypoints1.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                            sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                            scene.add(sphere);
            
                            isMoving3 = true;
                        } else if(collisionBlock.position.x == 16) {
                            console.log("Movimento de Colisão");
            
                            const randomWaypoint = safeWaypoints2[Math.floor(Math.random() * safeWaypoints2.length)];
                            waypoint3 = randomWaypoint;
                            targetWaypoint = randomWaypoint;
            
                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                            sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                            scene.add(sphere);
            
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
                        console.log("Verificação");
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
                        console.log("Movimento de Defesa");
                        // Tanque foge do player.
                        const furthestWaypoint = sortedWaypoints[sortedWaypoints.length-1].waypoint;
                        waypoint3 = furthestWaypoint;
                        targetWaypoint = furthestWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    } else {
                        console.log("Movimento de Ataque");
                        // Tanque se aproxima do player.
                        // Escolhe um waypoint aleatório para se mover.
                        const randomWaypoint = sortedWaypoints[Math.floor(Math.random() * sortedWaypoints.length)].waypoint;
                        waypoint3 = randomWaypoint;
                        targetWaypoint = randomWaypoint;
        
                        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
                        sphere.position.set(targetWaypoint.x, 5, targetWaypoint.z);
                        scene.add(sphere);
                    }
    
                    console.log(tankPosition.distanceTo(targetWaypoint));
        
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
                        if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56 || collisionBlock.position.x == 16) {
                            console.log("Colisão");
                            isColliding3 = true;
                            isMoving3 = false;
                        }
                    }
        
                    // Verifica se o próximo waypoint deve ser cálculado.
                    if(tankPosition.distanceTo(targetWaypoint) <= 1) {
                        console.log("Verificação");
                        isMoving3 = false;
                    }
                }   
            }
        }
    }

    // // Movimenta o tanque 2.
    // if(type == 2) {



    //     // Se estiver movendo olha para o waypoint e se desloca.
    //     if(isMoving2) {
    //         const randomWaypoint = waypoint2;

    //         // const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //         // const currentRotation = tank.object.rotation.y;
    //         // const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //         // const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //         // tank.object.rotation.set(0, newRotation, 0);

    //         tank.object.lookAt(randomWaypoint);

    //         tank.object.translateZ(0.2);

    //         // Verifica se o tanque está próximo o suficiente do waypoint ou loge o suficiente.
    //         // console.log(tankPosition.distanceTo(randomWaypoint));
    //         if(tankPosition.distanceTo(randomWaypoint) <= 1) {
    //             isMoving2 = false;
    //         } 
    //         // else if(tankPosition.distanceTo(randomWaypoint) >= 20) {
    //         //     isMoving2 = false;
    //         // }
    //     // Se não estiver movendo cálcula um novo waypoint.
    //     } else {
    //         // Calcula a distância entre o tanque e todos os waypoints.
    //         const distances = waypoints.map((wp) => tankPosition.distanceTo(wp));

    //         // Ordena os waypoints com base na distância.
    //         const sortedWaypoints = waypoints.map((wp, index) => ({ waypoint: wp, distance: distances[index] }))
    //         .sort((a, b) => a.distance - b.distance);

    //         // Seleciona 15 waypoints distantes.
    //         const closestWaypoints = sortedWaypoints.slice(1, 80);
    //         const randomWaypoint = closestWaypoints[Math.floor(Math.random() * closestWaypoints.length)].waypoint;
    //         waypoint2 = randomWaypoint;

    //         let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32));
    //         sphere.position.set(randomWaypoint.x, 5, randomWaypoint.z);
    //         scene.add(sphere);
            
    //         // Se a distância desse waypoint para o tanque for maior do que 6 e menor que 20 movimenta.
    //         // if(tankPosition.distanceTo(randomWaypoint) >= 10 && tankPosition.distanceTo(randomWaypoint) <= 50) {
    //             isMoving2 = true;
    //         // }
    //     }
    // }

    // if(type == 2) {
    //     if(!isMoving2) {

    //         // Calcula a distância entre o tanque e todos os waypoints.
    //         const distances = waypoints.map((wp) => tankPosition.distanceTo(wp));

    //         // Ordena os waypoints com base na distância.
    //         const sortedWaypoints = waypoints.map((wp, index) => ({ waypoint: wp, distance: distances[index] }))
    //         .sort((a, b) => a.distance - b.distance);

    //         // Seleciona os 5 waypoints próximos.
    //         const closestWaypoints = sortedWaypoints.slice(5, 10);

    //         // Rotaciona o tanque em direção a um waypoint aleatório.
    //         let randomWaypoint;
    //         if(!isSpinning2) {
    //             randomWaypoint = closestWaypoints[Math.floor(Math.random() * closestWaypoints.length)].waypoint;
    //             console.log(randomWaypoint);
    //             waypoint2 = randomWaypoint;
    //             isSpinning2 = true;
    //         } else {
    //             randomWaypoint = waypoint2;
    //         }
    //         const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //         const currentRotation = tank.object.rotation.y;
    //         const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //         const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //         tank.object.rotation.set(0, newRotation, 0);

    //         if(Math.abs(targetDirection.x - tankDirection.x) <= 0.005 && Math.abs(tankDirection.z - tankDirection.z) <= 0.005) {
    //             isMoving2 = true;
    //         }
    //     } else {
    //         tank.object.translateZ(0.2);
    //         let randomWaypoint = waypoint2;

    //         const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //         const currentRotation = tank.object.rotation.y;
    //         const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //         const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //         tank.object.rotation.set(0, newRotation, 0);

    //         // Verifica se o tanque está próximo o suficiente do waypoint.
    //         console.log(tankPosition.distanceTo(randomWaypoint));
    //         // if(tankPosition.distanceTo(randomWaypoint) <= 4) {
    //         //     isMoving2 = false;
    //         //     isSpinning2 = false;
    //         // } else 
    //         if(tankPosition.distanceTo(randomWaypoint) >= 20) {
    //             isMoving2 = false;
    //             isSpinning2 = false;
    //         }
    //     }
    // // Movimenta o tanque 3.
    // } else {
    //     if(!isMoving3) {
    //         // Rotaciona o tanque em direção a um waypoint aleatório.
    //         let randomWaypoint;
    //         if(!isSpinning3) {
    //             randomWaypoint = waypoints[Math.floor(Math.random() * waypoints.length)];
    //             waypoint3 = randomWaypoint;
    //             isSpinning3 = true;
    //         } else {
    //             randomWaypoint = waypoint3;
    //         }
    //         const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //         const currentRotation = tank.object.rotation.y;
    //         const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //         const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //         tank.object.rotation.set(0, newRotation, 0);

    //         if(Math.abs(targetDirection.x - tankDirection.x) <= 0.005 && Math.abs(tankDirection.z - tankDirection.z) <= 0.005) {
    //             isMoving3 = true;
    //         }
    //     } else {
    //         tank.object.translateZ(0.2);

    //         if(Math.abs(waypoint3.x - tankPosition.x) <= 1 && Math.abs(waypoint3.z - tankPosition.z) <= 1) {
    //             isMoving3 = false;
    //             isSpinning3 = false;
    //         }
    //     }
    // }

    // if(!isMoving) {
    //     // Rotaciona o tanque em direção a um waypoint aleatório.
    //     let randomWaypoint;
    //     if(!isSpinning) {
    //         randomWaypoint = waypoints[Math.floor(Math.random() * waypoints.length)];
    //         waypoint = randomWaypoint;
    //         isSpinning = true;
    //     } else {
    //         randomWaypoint = waypoint;
    //     }
    //     const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //     const currentRotation = tank.object.rotation.y;
    //     const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //     const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //     tank.object.rotation.set(0, newRotation, 0);

    //     if(Math.abs(targetDirection.x - tankDirection.x) <= 0.005 && Math.abs(targetDirection.z - tankDirection.z) <= 0.005) {
    //         isMoving = true;
    //     }
    // } else {
    //     tank.object.translateZ(0.2);

    //     if(Math.abs(waypoint.x - tankPosition.x) <= 1 && Math.abs(waypoint.z - tankPosition.z) <= 1) {
    //         isMoving = false;
    //         isSpinning = false;
    //     }
    // }

    // if(distanceToPlayer < escapeDistance) {
    //     // Rotaciona o tanque em direção a um waypoint aleatório.
    //     const randomWaypoint = waypoints[Math.floor(Math.random() * waypoints.length)];
    //     const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //     const currentRotation = tank.object.rotation.y;
    //     const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //     const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //     tank.object.rotation.set(0, newRotation, 0);

    //     // Foge do jogador.
    //     tank.object.translateZ(-0.2);
    // } else if(distanceToPlayer > attackDistance) {
    //     // Rotaciona o tanque em direção a um waypoint aleatório.
    //     const randomWaypoint = waypoints[Math.floor(Math.random() * waypoints.length)];
    //     console.log(randomWaypoint);
    //     const targetDirection = new THREE.Vector3().subVectors(randomWaypoint, tank.object.position).normalize();
    //     const currentRotation = tank.object.rotation.y;
    //     const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //     const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation);
    //     tank.object.rotation.set(0, newRotation, 0);

    //     // Ataca o jogador.
    //     tank.object.translateZ(0.25);
    // }

    // // Atira.
    // if(shoot) {
    //     // Rotaciona o tanque em direção ao jogador.
    //     const currentRotation = tank.object.rotation.y;
    //     const targetRotation = Math.atan2(targetDirection.x, targetDirection.z);
    //     const newRotation = currentRotation + rotationSpeed * (targetRotation - currentRotation)
    //     tank.object.rotation.set(0, newRotation, 0);
    //     console.log("ATIRA");
    // }
        
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