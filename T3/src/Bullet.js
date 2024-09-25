import * as THREE from 'three';
import { PlayAudio } from './Audio.js';

export function CriaBala(Atirador, inimigo1, inimigo2, inimigo3, mapa, identificador){

    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.2
    });
    const geometryBullet = new THREE.SphereGeometry( 0.3, 32, 32, 50 );  
    const bullet = new THREE.Mesh( geometryBullet, materialBullet );
    // Define a posição inicial da bala na posição do tanque
    var p = new THREE.Vector3(); 
    let speed = 0.5;
    Atirador.getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do Atirador
    var direction = new THREE.Vector3(); 
    var AtiradorRotationMatrix = new THREE.Matrix4();
    Atirador.matrixWorld.decompose(new THREE.Vector3(), Atirador.quaternion, new THREE.Vector3());
    AtiradorRotationMatrix.makeRotationFromQuaternion(Atirador.quaternion);
    // Define a direção inicial da bala no espaço local do Atirador (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do Atirador
    var globalDirection = localDirection.applyMatrix4(AtiradorRotationMatrix).normalize();
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
        inimigo1: inimigo1,
        inimigo2: inimigo2,
        inimigo3: inimigo3,
        mapa: mapa,
        identificador: identificador,
        p: p
    }
    return Bullet;
}

export function BalaAnda(Bullet){
    if (Bullet.removed) return 1;

    // Move a bala na direção definida pela sua velocidade
    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);   
    Bullet.obj.position.add(step);
    checkCollisions(Bullet);
    
    // Verifica se a bala colidiu com uma parede e remove-a se necessário
        if (Bullet.WallCollision === 3) { 
            Bullet.removed = true;
            return 1;
        } else {
            return 0;
        }
}

function checkCollisions(Bullet){
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbInimigo1 = new THREE.Box3().setFromObject(Bullet.inimigo1.object);
    const bbInimigo2 = new THREE.Box3().setFromObject(Bullet.inimigo2.object);
    const bbInimigo3 = new THREE.Box3().setFromObject(Bullet.inimigo3.object);

    
    const Inimigo1Collision = bbBullet.intersectsBox(bbInimigo1);
    const Inimigo2Collision = bbBullet.intersectsBox(bbInimigo2);
    const Inimigo3Collision = bbBullet.intersectsBox(bbInimigo3);

    if(Bullet.mapa == 1){                       // Mapa 1
        if(Bullet.identificador == 0){          // Player é o Atirador
            if(Inimigo1Collision){
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                return 1;
            }
        }
        else if( Bullet.identificador == 1){    // TankInimigo é o atirador
            if(Inimigo1Collision){
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                return 1;
            }
        }
        
        // Cima
        if(bulletPosition.z < 4.5){
            collisionPlane = new THREE.Vector3(0,0,1);
        }
        // Baixo
        else if(bulletPosition.z >= 42.0) {
            collisionPlane = new THREE.Vector3(0, 0, 1);
        }
        // Esquerda
        else if(bulletPosition.x < 3.0) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }
        //Direita
        else if(bulletPosition.x > 61.5) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }

        // Retangulo
        // Baixo Lados
        else if(bulletPosition.x > 30.0 && bulletPosition.x < 34.3 && bulletPosition.z > 29 && bulletPosition.z < 42.0) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }
        // Baixo Ponta
        else if(bulletPosition.z > 28.5 && bulletPosition.x > 30.0 && bulletPosition.x < 34.3) {
            collisionPlane = new THREE.Vector3(0, 0, 1);
        }

        // Cima Lados
        else if(bulletPosition.x > 29.5 && bulletPosition.x < 34.3 && bulletPosition.z > 4.5 && bulletPosition.z < 16) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }
        // Cima Ponta
        else if(bulletPosition.z < 16.5 && bulletPosition.x > 29.5 && bulletPosition.x < 34.3) {
            collisionPlane = new THREE.Vector3(0, 0, 1);
        }

        // // Se houver colisão com uma parede, reflete a direção da bala
        if(collisionPlane != null){
            Bullet.direction.reflect(collisionPlane).normalize();
            Bullet.WallCollision++;
        }


    }

    else if(Bullet.mapa == 2){                      // Mapa 2

        if(Bullet.identificador == 0){              // Player é o Atirador
            if(Inimigo1Collision){                  // Acertou o inimigo
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo2Collision){             // Acertou o outro Inimigo
                Bullet.inimigo2.setLife(Bullet.inimigo2.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo3Collision){             // Acertou o Cannon  
                WallCollision = 3;
                return 1;
            }
        }

        else if(Bullet.identificador == 1){         // TankInimigo é o Atirador
            if(Inimigo1Collision){                  // Acertou o player
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo2Collision){             // Acertou o outro inimigo
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo3Collision){             // Acertou o Cannon
                Bullet.removed = true;
                return 1;
            }
        }
        
        else if(Bullet.identificador == 2){         // Cannon é o atirador
            if(Inimigo1Collision){                  // Acertou o player
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo2Collision){             // Acertou o outro inimigo
                Bullet.inimigo2.setLife(Bullet.inimigo2.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo3Collision){             // Acertou o outro inimigo
                Bullet.inimigo3.setLife(Bullet.inimigo3.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
        }

        // Cima
        if(bulletPosition.z < 4.5){
            collisionPlane = new THREE.Vector3(0,0,1);
        }
        // Baixo
        else if(bulletPosition.z >= 42.0) {
            collisionPlane = new THREE.Vector3(0, 0, 1);
        }
        // Esquerda
        else if(bulletPosition.x < 86.0) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }
        //Direita
        else if(bulletPosition.x > 149.5) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }

        //Lados
        if(bulletPosition.x > 98.0 && bulletPosition.x < 103.5 && bulletPosition.z > 3.0 && bulletPosition.z < 19.5) {
            collisionPlane = new THREE.Vector3(-1, 0, 0);
        }
        // Frente
        else if( bulletPosition.z < 21 && bulletPosition.x > 99 && bulletPosition.x <103.5){
            collisionPlane = new THREE.Vector3(0,0,1);
        }

        // Retangulo Direita
        else if(bulletPosition.x > 133.5 && bulletPosition.x < 138.5 && bulletPosition.z > 26.0 && bulletPosition.z < 45) {
            collisionPlane = new THREE.Vector3(-1, 0, 0);
        }
        // Frente
        else if( bulletPosition.z > 25.0 && bulletPosition.x > 133.6 && bulletPosition.x < 138.4){
            collisionPlane = new THREE.Vector3(0,0,1);
        }

        // Se houver colisão com uma parede, reflete a direção da bala
        if(collisionPlane != null){
            Bullet.direction.reflect(collisionPlane).normalize();
            Bullet.WallCollision++;
        }

    }

    else if(Bullet.mapa == 3){

        if(Bullet.identificador == 0){              // Player é o atirador
            if(Inimigo1Collision){                  // Acertou o Inimigo
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo2Collision){             // Acertou o Inimigo
                Bullet.inimigo2.setLife(Bullet.inimigo2.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if(Inimigo3Collision){             // Acertou o Inimigo
                Bullet.inimigo3.setLife(Bullet.inimigo3.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
        }

        else if(Bullet.identificador == 1){         // TankInimigo é o atirador 
            if(Inimigo1Collision){                  // Acertou o Player
                Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
                Bullet.removed = true;
                PlayAudio(3), 0.5;
                return 1;
            }
            else if( Inimigo2Collision){            // Acertou o outro Inimigo
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
            else if( Inimigo3Collision){            // Acertou o outro Inimigo
                Bullet.removed = true;
                PlayAudio(3, 0.5);
                return 1;
            }
        }

        // Cima
        if(bulletPosition.z < -4.0){
            collisionPlane = new THREE.Vector3(0,0,1);
        }
        // Baixo
        else if(bulletPosition.z >= 46.0) {
            collisionPlane = new THREE.Vector3(0, 0, 1);
        }
        // Esquerda
        else if(bulletPosition.x < 174.0) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }
        //Direita
        else if(bulletPosition.x > 254.0) {
            collisionPlane = new THREE.Vector3(1, 0, 0);
        }


        // Falta os Piruzinho
        
        // Retangulo de Baixo
        else if(bulletPosition.x > 194 && bulletPosition.x < 198 && bulletPosition.z > 34){
            collisionPlane = new THREE.Vector3(1,0,0);
        }
        else if(bulletPosition.z > 30 && bulletPosition.x > 195 && bulletPosition.x < 197){
            collisionPlane - new THREE.Vector3(0,0,1);
        }
        
        // // Se houver colisão com uma parede, reflete a direção da bala
        if(collisionPlane != null){
            Bullet.direction.reflect(collisionPlane).normalize();
            Bullet.WallCollision++;
        }

    }
}