import * as THREE from 'three';
import { initRenderer,
         initCamera,
         initDefaultBasicLight,
         setDefaultMaterial,
         onWindowResize,
         createGroundPlaneXZ } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { OBB } from '../build/jsm/math/OBB.js';

// Importações de arquivos criados para o trabalho.
import { Tank, moveTank, moveTankWithCollision } from './Tank.js';
import { CreateLevel } from './Levels.js';
import { CheckCollisions } from './Collisions.js';

// Declaração de variáveis úteis.
let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
var camera = new THREE.PerspectiveCamera                        // Iniciando a câmera.
    (45, window.innerWidth / window.innerHeight, 0.1, 1000);    
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.

// Iniciando e configurando o OrbitControls
var orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;

// Função utilizada para redimensionar a tela do navegador caso haja alterações
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Começando o jogo.
function play() {
    swapOrbitControls();
    collisionWithWall();
    updateCamera();
}

// Criando o player1
var tank_player1 = new Tank(0);
tank_player1.object.position.set(-8.0, 1.1, -8.0);
scene.add(tank_player1.object);

// Criando o player2
var tank_player2 = new Tank(1);
tank_player2.object.position.set(-8.0, 1.1, -52.0);
tank_player2.object.rotateY(THREE.MathUtils.degToRad(180))
scene.add(tank_player2.object);

// Criando as propriedades da câmera
let position = midPosition(tank_player1, tank_player2);
var camPosition = new THREE.Vector3(-22.0, 30, 8.0);
var camUpPosition = new THREE.Vector3(0.0, 1.0, 0.0);
var camLookPosition = new THREE.Vector3(position[0], -5.0, position[1]);

// Setando a posição da a câmera principal
camera.position.copy(camPosition);
camera.up.copy(camUpPosition);
camera.lookAt(camLookPosition);

// Criando o nível
let nivel1 = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ];
var [floor, wall] = CreateLevel(nivel1);
scene.add(floor);

// Dividindo a parede para testar colisões
var paredeDireita = new THREE.Object3D();
var paredeTras = new THREE.Object3D();
var paredeEsquerda = new THREE.Object3D();
for(let i = 0; i < 17; i++) {
    paredeDireita.add(wall.children[0]);
}
for(let i = 0; i < 26; i++) {
    paredeTras.add(wall.children[0]);
}
for(let i = 0; i < 17; i++) {
    paredeEsquerda.add(wall.children[0]);
}
scene.add(paredeDireita);
scene.add(paredeTras);
scene.add(paredeEsquerda);

// Definindo e testando as colisões com a parede
function collisionWithWall() {
    // //Pegando a rotação dos tanques em relação ao mundo
    // const tankRotationQuaternion1 = new THREE.Quaternion();
    // tank_player1.object.getWorldQuaternion(tankRotationQuaternion1);

    // const tankRotationQuaternion2 = new THREE.Quaternion();
    // tank_player2.object.getWorldQuaternion(tankRotationQuaternion2);

    // Testando colisão com parede da direita:
    let paredeD = {
        obj: paredeDireita,
        width: 4,
        height: 4,
        depth: 124,
        children: 0,
    }
    let collisionsPD = CheckCollisions(tank_player1.object, tank_player2.object, paredeD);

    // Testando colisão com a parede da esquerda:
    let paredeE = {
        obj: paredeEsquerda,
        width: 4,
        height: 4,
        depth: 124,
        children: 0,
    }
    let collisionsPE = CheckCollisions(tank_player1.object, tank_player2.object, paredeE);

    // Testando colisão com paredes de tras:
    let paredeT1 = {
        obj: paredeTras,
        width: 76,
        height: 4,
        depth: 4,
        children: 0
    }
    let collisionsPT1 = CheckCollisions(tank_player1.object, tank_player2.object, paredeT1);

    let paredeT2 = {
        obj: paredeTras,
        width: 76,
        height: 4,
        depth: 4,
        children: 2
    }
    let collisionsPT2 = CheckCollisions(tank_player1.object, tank_player2.object, paredeT2);

    let paredeT3 = {
        obj: paredeTras,
        width: 20,
        height: 4,
        depth: 4,
        children: 1
    }
    let collisionsPT3 = CheckCollisions(tank_player1.object, tank_player2.object, paredeT3);

    let paredeT4 = {
            obj: paredeTras,
            width: 20,
            height: 4,
            depth: 4,
            children: 24
    }
    let collisionsPT4 = CheckCollisions(tank_player1.object, tank_player2.object, paredeT4);

    // Mudando a movimentação baseado na colisão
    if(collisionsPD == 0 && collisionsPE == 0 && collisionsPT1 == 0 && collisionsPT2 == 0 && collisionsPT3 == 0 && collisionsPT4 == 0) {
        moveTank(0, tank_player1.object, tank_player1.speed);
        moveTank(1, tank_player2.object, tank_player2.speed);
    }
    else if(collisionsPD == 1 || collisionsPE == 1 || collisionsPT1 == 1 || collisionsPT2 == 1 || collisionsPT3 == 1 || collisionsPT4 == 1) {
        moveTankWithCollision(0, tank_player1.object, tank_player1.speed, tank_player1.speed);
        moveTank(1, tank_player2.object, tank_player2.speed);
    }
    else if(collisionsPD == 2 || collisionsPE == 2 || collisionsPT2 == 2 || collisionsPT2 == 2 || collisionsPT3 == 2 || collisionsPT4 == 2) {
        moveTankWithCollision(1, tank_player2.object, tank_player2.speed, tank_player2.speed);
        moveTank(0, tank_player1.object, tank_player1.speed);
    }
    else {
        moveTankWithCollision(0, tank_player1.object, tank_player1.speed, tank_player1.speed);
        moveTankWithCollision(1, tank_player2.object, tank_player2.speed, tank_player2.speed);
    }
}

// Função utilizada para mover o tanque com base na colisão e na rotação do tanque
// function tankMovement(collision) {
//     // Pegando a rotação dos tanques em relação ao mundo
//     const tankRotationQuaternion1 = new THREE.Quaternion();
//     tank_player1.object.getWorldQuaternion(tankRotationQuaternion1);

//     const tankRotationQuaternion2 = new THREE.Quaternion();
//     tank_player2.object.getWorldQuaternion(tankRotationQuaternion2);

//     // Tratando as colisões
//     if( collision == 0 ) {
//         moveTank(0, tank_player1.object, 0, tank_player1.speedZ, -tank_player1.speedZ);
//         moveTank(1, tank_player2.object, 0, tank_player2.speedZ, -tank_player2.speedZ);
//     }
//     else if (collision == 1) { 
//         moveTank(1, tank_player2.object, 0, tank_player2.speedZ, -tank_player2.speedZ);

//         if(tankRotationQuaternion1.y <= -0.69 && tankRotationQuaternion1.y >= -0.72 ) {
//             moveTank(0, tank_player1.object, 0, tank_player1.speedZ, 0);
//         }
//         else if(tankRotationQuaternion1.y > -0.69 && tankRotationQuaternion1.y < 0.0 ) { 
//             moveTank(0, tank_player1.object, -tank_player1.speedX, tank_player1.speedZ, 0);
//         }
//         else if( tankRotationQuaternion1.y < -0.72 ) {
//             moveTank(0, tank_player1.object, tank_player1.speedX, tank_player1.speedZ, 0); 
//         }
//         else if( tankRotationQuaternion1.y >= 0.69 && tankRotationQuaternion1.y <= 0.72 ) {
//             moveTank(0, tank_player1.object, 0, 0, -tank_player1.speedZ);
//         }
//         else if( tankRotationQuaternion1.y > 0.0 && tankRotationQuaternion1.y < 0.69 ) {
//             moveTank(0, tank_player1.object, -tank_player1.speedX, 0, -tank_player1.speedZ); 
//         }
//         else if( tankRotationQuaternion1.y > 0.72 ) {
//             moveTank(0, tank_player1.object, tank_player1.speedX, 0, -tank_player1.speedZ);
//         }
//     }
//     else if (collision == 2) {
//         console.log(tankRotationQuaternion2);
//         moveTank(0, tank_player1.object, 0, tank_player1.speedZ, -tank_player1.speedZ);

//         if(tankRotationQuaternion2.y <= -0.69 && tankRotationQuaternion2.y >= -0.72 ) {
//             moveTank(1, tank_player2.object, 0, tank_player2.speedZ, 0);
//         }
//         else if(tankRotationQuaternion2.y > -0.69 && tankRotationQuaternion2.y < 0.0 ) { 
//             moveTank(1, tank_player2.object, -tank_player2.speedX, tank_player2.speedZ, 0);
//         }
//         else if( tankRotationQuaternion2.y < -0.72 ) {
//             moveTank(1, tank_player2.object, tank_player2.speedX, tank_player2.speedZ, 0); 
//         }
//         else if( tankRotationQuaternion2.y >= 0.69 && tankRotationQuaternion2.y <= 0.72 ) {
//             moveTank(1, tank_player2.object, 0, tank_player2.speedZ, 0);
//         }
//         else if( tankRotationQuaternion2.y > 0.0 && tankRotationQuaternion2.y < 0.69 ) {
//             moveTank(1, tank_player2.object, -tank_player2.speedX, 0, -tank_player2.speedZ); 
//         }
//         else if( tankRotationQuaternion2.y > 0.72 ) {
//             moveTank(1, tank_player2.object, tank_player2.speedX, tank_player2.speedZ, 0);
//         }
//     }
//     else {
//         if(tankRotationQuaternion1.y <= -0.69 && tankRotationQuaternion1.y >= -0.72 ) {
//             moveTank(0, tank_player1.object, 0, tank_player1.speedZ, 0);
//         }
//         else if(tankRotationQuaternion1.y > -0.69 && tankRotationQuaternion1.y < 0.0 ) { 
//             moveTank(0, tank_player1.object, -tank_player1.speedX, tank_player1.speedZ, 0);
//         }
//         else if( tankRotationQuaternion1.y < -0.72 ) {
//             moveTank(0, tank_player1.object, tank_player1.speedX, tank_player1.speedZ, 0); 
//         }
//         else if( tankRotationQuaternion1.y >= 0.69 && tankRotationQuaternion1.y <= 0.72 ) {
//             moveTank(0, tank_player1.object, 0, 0, -tank_player1.speedZ);
//         }
//         else if( tankRotationQuaternion1.y > 0.0 && tankRotationQuaternion1.y < 0.69 ) {
//             moveTank(0, tank_player1.object, -tank_player1.speedX, 0, -tank_player1.speedZ); 
//         }
//         else if( tankRotationQuaternion1.y > 0.72 ) {
//             moveTank(0, tank_player1.object, tank_player1.speedX, 0, -tank_player1.speedZ);
//         }

//         if(tankRotationQuaternion2.y <= -0.69 && tankRotationQuaternion2.y >= -0.72 ) {
//             moveTank(1, tank_player2.object, 0, tank_player2.speedZ, 0);
//         }
//         else if(tankRotationQuaternion2.y > -0.69 && tankRotationQuaternion2.y < 0.0 ) { 
//             moveTank(1, tank_player2.object, -tank_player2.speedX, tank_player2.speedZ, 0);
//         }
//         else if( tankRotationQuaternion2.y < -0.72 ) {
//             moveTank(1, tank_player2.object, tank_player2.speedX, tank_player2.speedZ, 0); 
//         }
//         else if( tankRotationQuaternion2.y >= 0.69 && tankRotationQuaternion2.y <= 0.72 ) {
//             moveTank(1, tank_player2.object, 0, 0, -tank_player2.speedZ);
//         }
//         else if( tankRotationQuaternion2.y > 0.0 && tankRotationQuaternion2.y < 0.69 ) {
//             moveTank(1, tank_player2.object, -tank_player2.speedX, 0, -tank_player2.speedZ); 
//         }
//         else if( tankRotationQuaternion2.y > 0.72 ) {
//             moveTank(1, tank_player2.object, tank_player2.speedX, tank_player2.speedZ, 0);
//         }
//     }
// }

// Habilitando e desabilitando o OrbitControls
function swapOrbitControls() {
    var keyboard = new KeyboardState();
    keyboard.update();
    if( keyboard.down("O") ) {
        if(orbitControls.enabled) {
            camera.position.copy(camPosition);
            camera.up.copy(camUpPosition);
            camera.lookAt(camLookPosition);
        }
        orbitControls.enabled = !orbitControls.enabled;
    }
}

// Calculando a posição média entre os tanques e a distância entre eles
function midPosition() {
    const position1 = new THREE.Vector3();
    const position2 = new THREE.Vector3();
    tank_player1.object.getWorldPosition(position1);
    tank_player2.object.getWorldPosition(position2);
    let midX = (position1.x + position2.x)/2;
    let midZ = (position1.z + position2.z)/2;
    let dist = Math.sqrt(
            (position2.x - position1.x)*(position2.x - position1.x) + 
            (position2.z - position1.z)*(position2.z - position1.z)
        );
    return [midX, midZ, dist];
}

// Função de atualização da câmera
function updateCamera() {
    if(!orbitControls.enabled) {
        let position = midPosition();
        camLookPosition.set(position[0], camLookPosition.y, position[1]);
        // camPosition.set(-22.0, 40, 20);
        camPosition.set(-22.0, 25 + position[2]/8, 10 + position[2]/6);

        camera.position.copy(camPosition);
        camera.up.copy(camUpPosition);
        camera.lookAt(camLookPosition);
    }
}

render();
function render()
{
    play();
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}