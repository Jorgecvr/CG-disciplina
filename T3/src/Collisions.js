import * as THREE from 'three';
import { OBB } from '../../build/jsm/math/OBB.js';

// Método que checa colisões do tanque com algum objeto.
function checkTankCollisions(tank, block) {
    // Obtendo a matriz de rotação do tanque e do bloco.
    tank.object.updateMatrixWorld();
    const tankRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank.object.matrixWorld);
    block.updateMatrixWorld();
    const blockRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(block.matrixWorld);

    const boxOBB = new OBB(
        tank.box.getWorldPosition(new THREE.Vector3),
        new THREE.Vector3(4.7 / 2, 3.2 / 2, 5.1 / 2),
        tankRotationMatrix3,
    );

    // Criando a OBB do bloco.
    const blockOBB = new OBB(
        block.getWorldPosition(new THREE.Vector3),
        new THREE.Vector3(2, 2, 2),
        blockRotationMatrix3,
    );

    // Verifica se há colisão entre os objetos de apoio e o bloco.
    if(blockOBB.intersectsOBB(boxOBB)) {
        return 0;
    } 
    else return -1;
};

// Método que verifica a colisão do tanque com os blocos da parede.
export function CheckCollisionsWithWall(tank, levels) {
    let colisions = [];

    levels.forEach((level) => {
        level.children[1].children.forEach((block) => {
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
        level.children[2].children.forEach((block) => {
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
        level.children[3].children.forEach((block)=>{
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
        level.children[5].children.forEach((block)=>{
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
        level.children[6].children.forEach((block)=>{
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
        level.children[7].children.forEach((block)=>{
            let collision = checkTankCollisions(tank, block);
            if(collision != -1) {
                colisions.push(block);
            }
        });
    });

    return colisions;
};

// Método que verifica a colisão da bala com as paredes que movem.
export function checkCollisionsWithMovingWalls(bullet, level) {
    // Blocos móveis;
    const movingBlocks1 = level.children[5].children;
    const movingBlocks2 = level.children[6].children;
    const movingBlocks3 = level.children[7].children;
    const movingBlocks = [movingBlocks1, movingBlocks2, movingBlocks3];
    const bulletPosition = new THREE.Vector3().setFromMatrixPosition(bullet.matrixWorld);

    let collisionPlane = null;  // Plano de colisão.

    movingBlocks.forEach((wall) => {
        wall.forEach((block) => {
            // Posição e dimensões do bloco.
            const blockBox = new THREE.Box3().setFromObject(block);

            // Verifica se a posição da bala está dentro dos limites do bloco.
            if (blockBox.containsPoint(bulletPosition)) {
                const blockPosition = new THREE.Vector3().setFromMatrixPosition(block.matrixWorld);

                // Verifica de que lado do bloco ocorreu a colisão
                if (Math.abs(bulletPosition.x - blockPosition.x) > Math.abs(bulletPosition.z - blockPosition.z)) {
                    // Se a colisão foi principalmente no eixo X, refletir no plano X.
                    collisionPlane = new THREE.Vector3(1, 0, 0);
                } else {
                    // Se a colisão foi principalmente no eixo Z, refletir no plano Z.
                    collisionPlane = new THREE.Vector3(0, 0, 1);
                }
            }
        });
    });

    return collisionPlane;
}