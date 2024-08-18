import * as THREE from 'three';

// Método que checa colisões do tanque com algum objeto.
export function checkTankCollisions(tank, block) {

    // Criando a Box3 do bloco.
    let bbBlock = new THREE.Box3().setFromObject(block);

    // Criando a Box3 do tanque.
    let bbTank = new THREE.Box3().setFromObject(tank.object);
    let tankSize = new THREE.Vector3; 
    bbTank.getSize(tankSize);

    return bbBlock.intersectsBox(bbTank);
};

// Método que verifica a colisão do tanque com os blocos da parede.
export function CheckCollisionsWithWall(tank, level) {
    let collisionBlock = null;
    level.wall.children.forEach((block, index) => {
        let collision = checkTankCollisions(tank, block);
        if(collision) {
            collisionBlock = block;
        }
    });
    return collisionBlock;
};