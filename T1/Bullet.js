import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';


export function CriaBala(tank, tankInimigo){
    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = setDefaultMaterial('white')
    const geometryBullet = new THREE.SphereGeometry( 0.5, 32, 32, 50 );  
    const bullet = new THREE.Mesh( geometryBullet, materialBullet );
    var p = new THREE.Vector3();
    let speed = -0.3;
    tank.getWorldPosition(p);
    bullet.position.copy(p);

    var direction = new THREE.Vector3();
    // AtiraBala();

    var tankRotationMatrix = new THREE.Matrix4();
    tank.matrixWorld.decompose(new THREE.Vector3(), tank.quaternion, new THREE.Vector3());
    tankRotationMatrix.makeRotationFromQuaternion(tank.quaternion);
    // Define a direção inicial da bala no espaço local do tanque (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do tanque
    var globalDirection = localDirection.applyMatrix4(tankRotationMatrix).normalize();
    // Define a direção da bala como a direção global
    direction.copy(globalDirection);

    const Bullet = {
        obj: bullet,
        direction: direction,
        WallCollision: WallCollision,
        AcertouInimigo: AcertouInimigo,
        speed: speed,
        removed: false,
        inimigo: tankInimigo,
        p: p
    }
    return Bullet;
}

export function balaAnda(Bullet){
    if (Bullet.removed) return 0;

    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);    
    Bullet.obj.position.add(step);
    checkCollisions(Bullet);

    if( Bullet.AcertouInimigo == 1){
        console.log("Bateu Inimigo");
        Bullet.removed = true;
        return 1;
    } else {
        if( Bullet.WallCollision == 3){
            console.log("Bateu 3 vezes parede");
            Bullet.removed = true;
            return 1;
        }
        else{
            return 0;
        }
    }
    
}

function checkCollisions(Bullet){
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbTankInimigo = new THREE.Box3().setFromObject(Bullet.inimigo);
    const tankInimigoColiision = bbBullet.intersectsBox(bbTankInimigo);
    if(tankInimigoColiision == 1){
        Bullet.AcertouInimigo = 1;
    }

    // Calculando Colisão Bordas
    if(bulletPosition.z >= -34.0 && bulletPosition.z <= -30.0 && bulletPosition.x >= -14.0 ) {
        collisionPlane = new THREE.Vector3(1, 0, 0);
    }
    else if(bulletPosition.z >= -34.0 && bulletPosition.z <= -30.0 && bulletPosition.x <= -30.0) {
        collisionPlane = new THREE.Vector3(1, 0, 0);
    }
    else if(bulletPosition.x > -2.5) {
        console.log("Bateu Parede Direita");
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    else if(bulletPosition.x < -42) {
        console.log("Bateu Parede Esquerda");
        collisionPlane = new THREE.Vector3(1, 0, 0);
    }
    else if(bulletPosition.z > -2.2) {
        console.log("Bateu Parede Baixo");
        collisionPlane = new THREE.Vector3(0, 0, -1);
    }
    else if(bulletPosition.z < -62) {
        console.log("Bateu Parede Cima");
        collisionPlane = new THREE.Vector3(0, 0, 1); // Parede cima
    }
    else if(bulletPosition.z <= -29.5 && bulletPosition.z >= -34.5 && (bulletPosition.x >= -14.0)) {
        console.log("Piruzinho1");
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    else if(bulletPosition.z <= -29.5 && bulletPosition.z >= -34.5 && (bulletPosition.x <= -30.0)) {
        console.log("Piruzinho2");
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }

    if(collisionPlane != null){
        Bullet.direction.reflect(collisionPlane).normalize();
        Bullet.WallCollision++;
    }
}