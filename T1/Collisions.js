import * as THREE from 'three';
import { OBB } from '../build/jsm/math/OBB.js';

// A função que checa colisões do tanque com algum objeto utilizando a classe OBB
export function CheckCollisions(tank, objeto) {
    // Obtendo a matrix de rotação do tanque e do objeto
    tank.object.updateMatrixWorld();
    const tankRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank.object.matrixWorld);

    objeto.object.updateMatrixWorld();
    const objetoRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(objeto.object.matrixWorld);

    // Criando a OBB para o tanque e os objetos
    const tankOBB = new OBB(
        tank.object.getWorldPosition(new THREE.Vector3()), 
        new THREE.Vector3(tank.width / 2, tank.height / 2, tank.depth / 2),
        tankRotationMatrix3);
    const objetoOBB = new OBB(
        objeto.object.getWorldPosition(new THREE.Vector3()),
        new THREE.Vector3(objeto.width / 2, objeto.height / 2, objeto.depth / 2),
        objetoRotationMatrix3);

    // Verifica se há colisão entre os tanques e o objeto
    if(tankOBB.intersectsOBB(objetoOBB)) return 1;
    else return 0;
}

// Função extra que divide a parade em blocos e chama a colisão para cada bloco
export function CheckCollisionsWithWall(tank, wall) {
    let returnBlock = null;
    wall.children.forEach(block => {
        let Bloco = {
            object: block,
            width: 4,
            height: 4,
            depth: 4,
        }
        let collision = CheckCollisions(tank, Bloco);
        if(collision) returnBlock = Bloco;
    });
    return returnBlock;
}


// Função que impede o tanque de se mover além das paredes
export function moveTankWithCollision(tank_player1, tank_player2, wall) {
    let blockCollisionWithTank1 = CheckCollisionsWithWall(tank_player1, wall);
    if( blockCollisionWithTank1 != null ) {
        console.log(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()));

        // Normais calculadas com base na posição do bloco que indica qual é a parede
        let normal;
        let speed;

        // Calcula as normais com base na posição do bloco
        if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).z == 0) {
            normal = new THREE.Vector3(1, 0, 0).normalize();
            speed = tank_player1.speed;
        }
        if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).z == -64) {
            normal = new THREE.Vector3(1, 0, 0).normalize();
            speed = -tank_player1.speed;
        }
        if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).x == -44) {
            normal = new THREE.Vector3(1, 0, 0).normalize();
            speed = tank_player1.speed;
        }


        // if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).x == 0) {
        //     normal = new THREE.Vector3(0, 0, -1).normalize();
        //     slideNormal = new THREE.Vector3(1, 0, 0).normalize();
        //     speed = tank_player1.speed;
        // }
    
        // Calcula a direção de deslizamento do tanque
        const slideDirection = tank_player1.getDirection().clone().reflect(normal.clone().normalize());
        tank_player1.object.translateOnAxis(slideDirection, speed);
        tank_player1.setDirection(tank_player1.object.getWorldDirection(new THREE.Vector3())); 
    }
}

// export function CheckCollisions(tank1, tank2, objeto) {
//     // Obtendo a matrix de rotação dos tanques e do objeto
//     tank1.updateMatrixWorld();
//     const tank1RotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank1.matrixWorld);
//     tank2.updateMatrixWorld();
//     const tank2RotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank2.matrixWorld);
//     objeto.obj.updateMatrixWorld();
//     const objetoRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(objeto.obj.matrixWorld);

//     // Criando a OBB para os objetos
//     const tank1OBB = new OBB(tank1.getWorldPosition(new THREE.Vector3()), new THREE.Vector3(1.5, 0.425, 2.5), tank1RotationMatrix3);
//     const tank2OBB = new OBB(tank2.getWorldPosition(new THREE.Vector3()), new THREE.Vector3(1.5, 0.425, 2.5), tank2RotationMatrix3);
//     // Objeto deve ser uma estrutura que contenha o objeto 3d e seus parâmetros de largura, altura e profundidade
//     // Esses parâmetros para os tanques já são conhecidos
//     const objetoOBB = new OBB(objeto.obj.children[objeto.children].getWorldPosition(new THREE.Vector3()), 
//                               new THREE.Vector3(objeto.width / 2, objeto.height / 2, objeto.depth / 2),
//                               objetoRotationMatrix3);
    
//     // Verifica se há colisão entre os tanques e o objeto
//     if(tank1OBB.intersectsOBB(objetoOBB) && tank2OBB.intersectsOBB(objetoOBB)) return 3;
//     else if(tank2OBB.intersectsOBB(objetoOBB)) return 2;
//     else if(tank1OBB.intersectsOBB(objetoOBB)) return 1;
//     else return 0;
// }