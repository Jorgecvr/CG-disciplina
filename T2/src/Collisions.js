import * as THREE from 'three';
import { OBB } from '../../build/jsm/math/OBB.js';

// Método que checa colisões do tanque com algum objeto utilizando OBB.
function checkTankCollisions(tank, objOBB) {
    // Obtendo a matriz de rotação do tanque.
    tank.mesh.updateMatrixWorld();
    const tankRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank.mesh.matrixWorld);

    // Criando a OBB para o tanque - (O objeto já deve ter uma obb acessível).
    const tankOBB = new OBB(
        tank.mesh.getWorldPosition(new THREE.Vector3()),
        new THREE.Vector3(4.4 / 2, 4 / 2, 5.7 / 2),
        tankRotationMatrix3
    );

    // Verifica se há colisão entre os tanques e o objeto
    if(tankOBB.intersectsOBB(objOBB)) return 1;
    else return 0;
};

// Método que verifica a colisão do tanque com os blocos da parede.
export function CheckCollisionsWithWall(tank, level) {
    level.wall.children.forEach((block, index) => {
        const collision = checkTankCollisions(tank, level.obbs[index]);
        if(collision) console.log(true);
    });
};