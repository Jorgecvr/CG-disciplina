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
export function directionTankWithCollision(tank, wall) {
    let blockCollisionWithTank1 = CheckCollisionsWithWall(tank, wall);
    if(blockCollisionWithTank1 == null) {
        return null;
    }
    else {
        console.log(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()));

        // Pegando a normal e a direção de deslocamento com base na posição do bloco e do tanque
        // É necessário mudar a velocidade do tanque dependendo da direção de colisão
        let normal;
        let direction;

        // Parede Esquerda
        if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).z == 0) {
            normal = new THREE.Vector3(1, 0, 0);
            
            // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
            const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(normal));
            console.log(angle);
            if(angle >= 89 && angle <= 91) tank.setSpeedCollision(0);
            else tank.setSpeedCollision(-0.2);

            direction = tank.getDirection().clone().reflect(normal);
        }

        // Parede Direita
        else if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).z == -64) {
            normal = new THREE.Vector3(1, 0, 0);

            // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
            const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(normal));
            console.log(angle);
            if(angle >= 89 && angle <= 91) tank.setSpeedCollision(0);
            else tank.setSpeedCollision(0.2);

            direction = tank.getDirection().clone().reflect(normal);
        }

        // Parede Frente
        else if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).x == -44) {
            let normal = new THREE.Vector3(1, 0, 1);

            // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
            const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(0, 0, 1)));
            console.log(angle);
            if(angle >= 84 && angle <= 94) tank.setSpeedCollision(0);
            else tank.setSpeedCollision(-0.2);

            direction = tank.getDirection().clone().reflect(normal);
        }

        // Parede Trás
        else if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).x == 0) {
            let normal = new THREE.Vector3(1, 0, 1);

            // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
            const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(0, 0, 1)));
            console.log(angle);
            if(angle >= 84 && angle <= 94) tank.setSpeedCollision(0);
            else tank.setSpeedCollision(0.2);

            direction = tank.getDirection().clone().reflect(normal);
        }

        // Muros  
        else if(blockCollisionWithTank1.object.getWorldPosition(new THREE.Vector3()).z == -32) {
            // Muro pelos lados
            if (tank.object.getWorldPosition(new THREE.Vector3()).x <= -12 && tank.object.getWorldPosition(new THREE.Vector3()).x > -26) {
                let normal = new THREE.Vector3(1, 0, 1);

                // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
                const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(0, 0, 1)));
                console.log(angle);
                if(angle >= 84 && angle <= 94) tank.setSpeedCollision(0);
                else tank.setSpeedCollision(0.2);

                direction = tank.getDirection().clone().reflect(normal);
            }
            else if(tank.object.getWorldPosition(new THREE.Vector3()).x <= -26 && tank.object.getWorldPosition(new THREE.Vector3()).x >= -32) {
                let normal = new THREE.Vector3(1, 0, 1);

                // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
                const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(0, 0, 1)));
                console.log(angle);
                if(angle >= 84 && angle <= 94) tank.setSpeedCollision(0);
                else tank.setSpeedCollision(-0.2);

                direction = tank.getDirection().clone().reflect(normal);
            }
            // Muro pela frente
            else if(tank.object.getWorldPosition(new THREE.Vector3()).z >= -32) {
                normal = new THREE.Vector3(1, 0, 0);

                // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
                const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(1, 0, 0)));
                console.log(angle);
                if(angle >= 89 && angle <= 91) tank.setSpeedCollision(0);
                else tank.setSpeedCollision(0.2);

                direction = tank.getDirection().clone().reflect(normal);
            }
            // Muro por trás
            else if(tank.object.getWorldPosition(new THREE.Vector3()).z < -32) {
                normal = new THREE.Vector3(1, 0, 0);

                // Calcula o ângulo entre o vetor de direção do tanque e a normal da parede
                const angle = THREE.MathUtils.radToDeg(tank.getDirection().angleTo(new THREE.Vector3(1, 0, 0)));
                console.log(angle);
                if(angle >= 89 && angle <= 91) tank.setSpeedCollision(0);   
                else tank.setSpeedCollision(-0.2);

                direction = tank.getDirection().clone().reflect(normal);
            }
        }

        return direction;
    }
}