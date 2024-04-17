import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import { Tank } from './Tank.js';

// Criação da geometria e material da bala
export function CriaBala(tank, tankInimigo){
    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = setDefaultMaterial('white')
    const geometryBullet = new THREE.SphereGeometry( 0.3, 32, 32, 50 );  
    const bullet = new THREE.Mesh( geometryBullet, materialBullet );
    // Define a posição inicial da bala na posição do tanque
    var p = new THREE.Vector3(); 
    let speed = -0.3;
    tank.children[0].children[0].children[0].getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do tanque
    var direction = new THREE.Vector3(); 
    var tankRotationMatrix = new THREE.Matrix4();
    tank.matrixWorld.decompose(new THREE.Vector3(), tank.quaternion, new THREE.Vector3());
    tankRotationMatrix.makeRotationFromQuaternion(tank.quaternion);
    // Define a direção inicial da bala no espaço local do tanque (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do tanque
    var globalDirection = localDirection.applyMatrix4(tankRotationMatrix).normalize();
    // Define a direção da bala como a direção global
    direction.copy(globalDirection);

    // Objeto que representa a bala
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

// Esta função faz a bala se mover e verifica colisões
export function balaAnda(Bullet){ 
    if (Bullet.removed) return 0;

     // Move a bala na direção definida pela sua velocidade
    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);   
    Bullet.obj.position.add(step);
    checkCollisions(Bullet);

     // Verifica se a bala acertou um inimigo ou uma parede
    if( Bullet.AcertouInimigo == 1){ 
        Bullet.inimigo.setLife(Bullet.inimigo.getLife()-1);
        Bullet.removed = true;
        return 1;
    } else {
        // Verifica se a bala colidiu com uma parede e remove-a se necessário
        if( Bullet.WallCollision == 3){ 
            Bullet.removed = true;
            return 1;
        }
        else{
            return 0;
        }
    }
    
}
// Esta função verifica colisões da bala com paredes e inimigos
function checkCollisions(Bullet){ 
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbTankInimigo = new THREE.Box3().setFromObject(Bullet.inimigo.object);
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
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    else if(bulletPosition.x < -42) {
        collisionPlane = new THREE.Vector3(1, 0, 0);
    }
    else if(bulletPosition.z > -2.2) {
        collisionPlane = new THREE.Vector3(0, 0, -1);
    }
    else if(bulletPosition.z < -62) {
        collisionPlane = new THREE.Vector3(0, 0, 1); // Parede cima
    }
    else if(bulletPosition.z <= -29.5 && bulletPosition.z >= -34.5 && (bulletPosition.x >= -14.0)) {
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    else if(bulletPosition.z <= -29.5 && bulletPosition.z >= -34.5 && (bulletPosition.x <= -30.0)) {
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Se houver colisão com uma parede, reflete a direção da bala
    if(collisionPlane != null){
        Bullet.direction.reflect(collisionPlane).normalize();
        Bullet.WallCollision++;
    }
}