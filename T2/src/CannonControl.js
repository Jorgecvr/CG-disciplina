import * as THREE from 'three';
import { CriaBala3 } from './Bullet.js';

export class CannonControl {
    constructor(cannon, tanks) {
        this.cannon = cannon;
        this.tanks = tanks;
    }

    updateCannonRotation(Bullet, shoot, tank1, tank2, tank3, scene) {
        // Canhão atira.
        if(shoot) {
            Bullet.push(CriaBala3(this.cannon.object, tank1, tank2, tank3));
            scene.add(Bullet[Bullet.length-1].obj);
        }

        // Encontra o tanque mais próximo
        let closestTank = this.findClosestTank();
        if (!closestTank) return;
    
        // Obtém a posição do tanque mais próximo e do canhão
        let targetPosition = closestTank.object.position.clone();
        let cannonPosition = this.cannon.object.position.clone();
    
        // Calcula a direção do vetor do canhão ao tanque
        let direction = new THREE.Vector3().subVectors(targetPosition, cannonPosition).normalize();
    
        // Calcula o ângulo necessário para rotacionar o canhão na direção do tanque
        let targetAngle = Math.atan2(direction.x, direction.z);
    
        // Suaviza a rotação (ajuste a velocidade conforme necessário)
        let currentAngle = this.cannon.object.children[0].rotation.y;
        let rotationSpeed = 0.02;  // Velocidade de rotação (ajuste conforme necessário)
    
        // Calcula a diferença angular para aplicar a rotação suavemente
        let angleDifference = targetAngle - currentAngle;
        if (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
        if (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;
    
        // Aplica a rotação suave ao canhão.
        this.cannon.object.children[0].rotation.y += angleDifference * rotationSpeed;
    }
    

    findClosestTank() {
        let closestTank = null;
        let minDistance = Infinity;

        this.tanks.forEach(tank => {
            let distance = this.cannon.object.position.distanceTo(tank.object.position);
            if (distance < minDistance) {
                minDistance = distance;
                closestTank = tank;
            }
        });

        return closestTank;
    }
}
