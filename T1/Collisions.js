import * as THREE from 'three';

export function CheckCollisions(TankVermelho, TankAzul, Parede) {
    // Criano HitBox dos objetos
    let bbTankVermelho = new THREE.Box3().setFromObject(TankVermelho);
    let bbTankAzul = new THREE.Box3().setFromObject(TankAzul);
    let bbParede = new THREE.Box3().setFromObject(Parede);

    // Verificando Colisão e retornando resultados
    let collisionVermelho = bbTankVermelho.intersectsBox(bbParede);
    let collisionAzul = bbTankAzul.intersectsBox(bbParede);
    if( collisionVermelho == true && collisionAzul == true) return 3;
    else{
        if(collisionAzul == true) return 2;
        else{
            if(collisionVermelho == true) return 1;
            else
                return 0;
        }
    }
}