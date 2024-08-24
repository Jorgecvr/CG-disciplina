import * as THREE from 'three';

////////////////////////////////////////////////////////////////////////////////
// Caso 0: Nível 1

export function CriaBala(tank, tankInimigo){
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
    let speed = -0.5;
    tank.getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do tanque
    var direction = new THREE.Vector3(); 
    var tankRotationMatrix = new THREE.Matrix4();
    tank.matrixWorld.decompose(new THREE.Vector3(), tank.quaternion, new THREE.Vector3());
    tankRotationMatrix.makeRotationFromQuaternion(tank.quaternion);
    // Define a direção inicial da bala no espaço local do tanque (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, -1);
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
        Bullet.inimigo.setLife(Bullet.inimigo.getLife() - 100);
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

    // Cima
    else if(bulletPosition.z < 4.5){
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

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Caso 1: Player atirando
export function CriaBala1(Qatirou, inimigo1, inimigo2, cannon){
    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.2
    });
    const geometryBullet = new THREE.SphereGeometry(0.3, 32, 32, 50);  
    const bullet = new THREE.Mesh(geometryBullet, materialBullet);

    // Define a posição inicial da bala na posição do Qatirou
    var p = new THREE.Vector3(); 
    let speed = 0.5;
    Qatirou.getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do Qatirou
    var direction = new THREE.Vector3(); 
    var QatirouRotationMatrix = new THREE.Matrix4();
    Qatirou.matrixWorld.decompose(new THREE.Vector3(), Qatirou.quaternion, new THREE.Vector3());
    QatirouRotationMatrix.makeRotationFromQuaternion(Qatirou.quaternion);
    // Define a direção inicial da bala no espaço local do Qatirou (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do Qatirou
    var globalDirection = localDirection.applyMatrix4(QatirouRotationMatrix).normalize();
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
        cannon: cannon,
        p: p
    }
    return Bullet;
}

// Esta função faz a bala se mover e verifica colisões
export function balaAnda1(Bullet){ 
    if (Bullet.removed) return 0;

    // Move a bala na direção definida pela sua velocidade
    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);   
    Bullet.obj.position.add(step);
    checkCollisions1(Bullet);

    // Verifica se a bala acertou um inimigo ou uma parede
    if (Bullet.AcertouInimigo1 === 1) { 
        Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
        Bullet.removed = true;
        return 1;
    }
    else if(Bullet.AcertouInimigo2 === 1) {
        Bullet.inimigo2.setLife(Bullet.inimigo2.getLife() - 100);
        Bullet.removed = true;
        return 1;
    } 
    else if(Bullet.AcertouCannon === 1) {
        Bullet.removed = true;
        return 1;
    }
    else {
        // Verifica se a bala colidiu com uma parede e remove-a se necessário
        if (Bullet.WallCollision === 3) { 
            Bullet.removed = true;
            return 1;
        } else {
            return 0;
        }
    }
}

// Esta função verifica colisões da bala com paredes e inimigos
function checkCollisions1(Bullet){ 
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbTankInimigo1 = new THREE.Box3().setFromObject(Bullet.inimigo1.object);
    const bbTankInimigo2 = new THREE.Box3().setFromObject(Bullet.inimigo2.object);
    const bbCannon = new THREE.Box3().setFromObject(Bullet.cannon);
    const tankInimigo1Collision = bbBullet.intersectsBox(bbTankInimigo1);
    const tankInimigo2Collision = bbBullet.intersectsBox(bbTankInimigo2);
    const CannonCollision = bbBullet.intersectsBox(bbCannon);
    
    if (tankInimigo1Collision) {
        Bullet.AcertouInimigo1 = 1;
    }
    else if(tankInimigo2Collision) {
        Bullet.AcertouInimigo2 = 1;
    }
    else if(CannonCollision) {
        Bullet.AcertouCannon = 1;
    }

    // Calculando Colisão Bordas
    
    // Cima
    if(bulletPosition.z < 3.0) {
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Baixo
    else if(bulletPosition.z > 41.5){
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Esquerda
    else if(bulletPosition.x < 2.0){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Direita 
    else if(bulletPosition.x > 65.5){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }


   // Retangulo Esquerda
   //Lados
    if(bulletPosition.x > 14.0 && bulletPosition.x < 19.5 && bulletPosition.z > 3.0 && bulletPosition.z < 19.5) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z < 21 && bulletPosition.x > 15 && bulletPosition.x <19.5){
        collisionPlane = new THREE.Vector3(0,0,1);
    }

    // Retangulo Direita
    else if(bulletPosition.x > 49.5 && bulletPosition.x < 54.5 && bulletPosition.z > 26.0 && bulletPosition.z < 45) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z > 25.0 && bulletPosition.x > 49.6 && bulletPosition.x < 54.4){
        collisionPlane = new THREE.Vector3(0,0,1);
    }
    
    // Se houver colisão com uma parede, reflete a direção da bala
    if(collisionPlane != null){
        Bullet.direction.reflect(collisionPlane).normalize();
        Bullet.WallCollision++;
    }
}





////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Caso 2: Tank Inimigo atirando

export function CriaBala2(TankInimigo, inimigo1, inimigo2, cannon){
    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.2
    });
    const geometryBullet = new THREE.SphereGeometry(0.3, 32, 32, 50);  
    const bullet = new THREE.Mesh(geometryBullet, materialBullet);

    // Define a posição inicial da bala na posição do TankInimigo
    var p = new THREE.Vector3(); 
    let speed = 0.5;
    TankInimigo.getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do TankInimigo
    var direction = new THREE.Vector3(); 
    var TankInimigoRotationMatrix = new THREE.Matrix4();
    TankInimigo.matrixWorld.decompose(new THREE.Vector3(), TankInimigo.quaternion, new THREE.Vector3());
    TankInimigoRotationMatrix.makeRotationFromQuaternion(TankInimigo.quaternion);
    // Define a direção inicial da bala no espaço local do TankInimigo (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do TankInimigo
    var globalDirection = localDirection.applyMatrix4(TankInimigoRotationMatrix).normalize();
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
        cannon: cannon,
        p: p
    }
    return Bullet;
}

// Esta função faz a bala se mover e verifica colisões
export function balaAnda2(Bullet){ 
    if (Bullet.removed) return 0;

    // Move a bala na direção definida pela sua velocidade
    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);   
    Bullet.obj.position.add(step);
    checkCollisions2(Bullet);

    // Verifica se a bala acertou um inimigo ou uma parede
    if (Bullet.AcertouInimigo1 === 1) { 
        Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
        Bullet.removed = true;
        return 1;
    }
    else if(Bullet.AcertouInimigo2 === 1) {
        Bullet.removed = true;
        return 1;
    }
    else if(Bullet.AcertouCannon === 1) {
        Bullet.removed = true;
        return 1;
    } 
    else {
        // Verifica se a bala colidiu com uma parede e remove-a se necessário
        if (Bullet.WallCollision === 3) { 
            Bullet.removed = true;
            return 1;
        } else {
            return 0;
        }
    }
}

// Esta função verifica colisões da bala com paredes e inimigos
function checkCollisions2(Bullet){ 
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbTankInimigo1 = new THREE.Box3().setFromObject(Bullet.inimigo1.object);
    const bbTankInimigo2 = new THREE.Box3().setFromObject(Bullet.inimigo2.object);
    const bbCannon = new THREE.Box3().setFromObject(Bullet.cannon);
    const tankInimigo1Collision = bbBullet.intersectsBox(bbTankInimigo1);
    const tankInimigo2Collision = bbBullet.intersectsBox(bbTankInimigo2);
    const CannonCollision = bbBullet.intersectsBox(bbCannon);
    
    if (tankInimigo1Collision) {
        Bullet.AcertouInimigo1 = 1;
    }
    else if(tankInimigo2Collision) {
        Bullet.AcertouInimigo2 = 1;
    }
    else if(CannonCollision) {
        Bullet.AcertouCannon = 1;
    }

    // Calculando Colisão Bordas
    
    // Cima
    else if(bulletPosition.z < 3.0) {
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Baixo
    else if(bulletPosition.z > 41.5){
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Esquerda
    else if(bulletPosition.x < 2.0){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Direita 
    else if(bulletPosition.x > 65.5){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }


   // Retangulo Esquerda
   //Lados
    if(bulletPosition.x > 14.0 && bulletPosition.x < 19.5 && bulletPosition.z > 3.0 && bulletPosition.z < 19.5) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z < 21 && bulletPosition.x > 15 && bulletPosition.x <19.5){
        collisionPlane = new THREE.Vector3(0,0,1);
    }

    // Retangulo Direita
    else if(bulletPosition.x > 49.5 && bulletPosition.x < 54.5 && bulletPosition.z > 26.0 && bulletPosition.z < 45) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z > 25.0 && bulletPosition.x > 49.6 && bulletPosition.x < 54.4){
        collisionPlane = new THREE.Vector3(0,0,1);
    }
    
    // Se houver colisão com uma parede, reflete a direção da bala
    if(collisionPlane != null){
        Bullet.direction.reflect(collisionPlane).normalize();
        Bullet.WallCollision++;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Caso 3: Canhão Atirando

export function CriaBala3(Cannon, inimigo1, inimigo2, inimigo3){
    let WallCollision = 0;
    let AcertouInimigo = 0;
    const materialBullet = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.2
    });
    const geometryBullet = new THREE.SphereGeometry(0.3, 32, 32, 50);  
    const bullet = new THREE.Mesh(geometryBullet, materialBullet);

    // Define a posição inicial da bala na posição do Canhão
    var p = new THREE.Vector3(); 
    let speed = 0.5;
    Cannon.children[0].getWorldPosition(p);
    bullet.position.copy(p);
    bullet.position.y = 2.15;

    // Cálculo da direção inicial da bala com base na rotação do Canhão
    var direction = new THREE.Vector3(); 
    var CannonRotationMatrix = new THREE.Matrix4();
    //Cannon.children[0].matrixWorld.decompose(new THREE.Vector3(), Cannon.children[0].quaternion, new THREE.Vector3());
    CannonRotationMatrix.makeRotationFromQuaternion(Cannon.children[0].quaternion);
    // Define a direção inicial da bala no espaço local do Canhão (direção para frente)
    var localDirection = new THREE.Vector3(0, 0, 1);
    // Transforma a direção local da bala em uma direção global usando a rotação do Qatirou
    var globalDirection = localDirection.applyMatrix4(CannonRotationMatrix).normalize();
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
        p: p
    }
    return Bullet;
}

// Esta função faz a bala se mover e verifica colisões
export function balaAnda3(Bullet){ 
    if (Bullet.removed) return 0;

    // Move a bala na direção definida pela sua velocidade
    let step = Bullet.direction.clone().multiplyScalar(Bullet.speed);   
    Bullet.obj.position.add(step);
    checkCollisions3(Bullet);

    // Verifica se a bala acertou um inimigo ou uma parede
    if (Bullet.AcertouInimigo1 === 1) { 
        Bullet.inimigo1.setLife(Bullet.inimigo1.getLife() - 100);
        Bullet.removed = true;
        return 1;
    }
    else if(Bullet.AcertouInimigo2 === 1) {
        Bullet.removed = true;
        Bullet.inimigo2.setLife(Bullet.inimigo2.getLife() - 100);
        return 1;
    } 
    else if(Bullet.AcertouInimigo3 === 1) {
        Bullet.inimigo3.setLife(Bullet.inimigo3.getLife() - 100);
        Bullet.removed = true;
        return 1;
    }
    else {
        // Verifica se a bala colidiu com uma parede e remove-a se necessário
        if (Bullet.WallCollision === 3) { 
            Bullet.removed = true;
            return 1;
        } else {
            return 0;
        }
    }
}

// Esta função verifica colisões da bala com paredes e inimigos
function checkCollisions3(Bullet){ 
    var bulletPosition = Bullet.obj.getWorldPosition(Bullet.p);
    var collisionPlane = null;
    
    // Calculando Colisão Tank
    const bbBullet = new THREE.Box3().setFromObject(Bullet.obj);
    const bbTankInimigo1 = new THREE.Box3().setFromObject(Bullet.inimigo1.object);
    const bbTankInimigo2 = new THREE.Box3().setFromObject(Bullet.inimigo2.object);
    const bbTankInimigo3 = new THREE.Box3().setFromObject(Bullet.inimigo3.object);
    const tankInimigo1Collision = bbBullet.intersectsBox(bbTankInimigo1);
    const tankInimigo2Collision = bbBullet.intersectsBox(bbTankInimigo2);
    const tankInimigo3Collision = bbBullet.intersectsBox(bbTankInimigo3);
    
    if (tankInimigo1Collision) {
        Bullet.AcertouInimigo1 = 1;
    }
    else if(tankInimigo2Collision) {
        Bullet.AcertouInimigo2 = 1;
    }
    else if(tankInimigo3Collision) {
        Bullet.AcertouInimigo3 = 1;
    }
    // Calculando Colisão Bordas
    
    // Cima
    else if(bulletPosition.z < 3.0) {
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Baixo
    else if(bulletPosition.z > 41.5){
        collisionPlane = new THREE.Vector3(0, 0, 1);
    }
    // Esquerda
    else if(bulletPosition.x < 2.0){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Direita 
    else if(bulletPosition.x > 65.5){
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }


   // Retangulo Esquerda
   //Lados
    if(bulletPosition.x > 14.0 && bulletPosition.x < 19.5 && bulletPosition.z > 3.0 && bulletPosition.z < 19.5) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z < 21 && bulletPosition.x > 15 && bulletPosition.x <19.5){
        collisionPlane = new THREE.Vector3(0,0,1);
    }

    // Retangulo Direita
    else if(bulletPosition.x > 49.5 && bulletPosition.x < 54.5 && bulletPosition.z > 26.0 && bulletPosition.z < 45) {
        collisionPlane = new THREE.Vector3(-1, 0, 0);
    }
    // Frente
    else if( bulletPosition.z > 25.0 && bulletPosition.x > 49.6 && bulletPosition.x < 54.4){
        collisionPlane = new THREE.Vector3(0,0,1);
    }
    
    // Se houver colisão com uma parede, reflete a direção da bala
    if(collisionPlane != null){
        Bullet.direction.reflect(collisionPlane).normalize();
        Bullet.WallCollision++;
    }
};