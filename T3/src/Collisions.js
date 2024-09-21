import * as THREE from 'three';
import { OBB } from '../../build/jsm/math/OBB.js';

// Método que checa colisões do tanque com algum objeto.
function checkTankCollisions(tank, block) {
    // Obtendo a matriz de rotação do tanque e do bloco.
    tank.object.updateMatrixWorld();
    const tankRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank.object.matrixWorld);
    block.updateMatrixWorld();
    const blockRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(block.matrixWorld);
    
    // Criando as OBBs para os objetos de apoio.
    // const baseOBB = new OBB(
    //     tank.base.getWorldPosition(new THREE.Vector3),
    //     new THREE.Vector3(4.7 / 2, 2 / 2, 4.2 / 2),
    //     tankRotationMatrix3
    // );
    // const cannonOBB = new OBB(
    //     tank.cannon.getWorldPosition(new THREE.Vector3),
    //     new THREE.Vector3(0.5 / 2, 0.5 / 2, 2 / 2),
    //     tankRotationMatrix3,
    // );

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
    // if(blockOBB.intersectsOBB(cannonOBB)) {
    //     return 1;
    // }
    else return -1;
};

// Método que verifica a colisão do tanque com os blocos da parede.
export function CheckCollisionsWithWall(tank, level) {
    let colissions = [];
    level.children[1].children.forEach((block) => {
        let collision = checkTankCollisions(tank, block);
        if(collision != -1) {
            colissions.push(block);
        }
    });

    return colissions;
};