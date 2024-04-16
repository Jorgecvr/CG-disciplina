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
import { Tank } from './Tank.js';
import { CreateLevel } from './Levels.js';
import { moveTankWithCollision } from './Collisions.js';
import { CriaBala, balaAnda } from './Bullet.js';

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
    //console.log(tank_player1.getDirection());
    swapOrbitControls();
    collisions();
    InitBullet();
    BulletControl(Bullet);
    tank_player1.moveTank(0);
    tank_player2.moveTank(1);
    // moveTank(0, tank_player1.object, tank_player1.speed);
    // moveTank(1, tank_player2.object, tank_player2.speed);
    updateCamera();
}

function collisions() {
    moveTankWithCollision(tank_player1, tank_player2, wall);
}

function InitBullet(){
    var keyboard = new KeyboardState();
    if(keyboard.down('space') || keyboard.down('Q')){
    Bullet.push(CriaBala(tank_player1.object, tank_player2.object));
    scene.add(Bullet[Bullet.length-1].obj);
    BulletControl(Bullet);
    }
    if(keyboard.down("/") || keyboard.down(",")){
        Bullet.push(CriaBala(tank_player2.object, tank_player1.object));
        scene.add(Bullet[Bullet.length-1].obj);
        BulletControl(Bullet);
    }
}

function BulletControl(Bullet) {
    if (Bullet.length === 0){
        return 0;
    }
    else{
        Bullet.forEach((bullet) => {
            let remove = balaAnda(bullet);
            if(remove) { scene.remove(bullet.obj)};
        });
    }
}

// Criando o player1
var tank_player1 = new Tank(0);
tank_player1.object.position.set(-8.0, 1.1, -8.0);
tank_player1.object.rotateY(THREE.MathUtils.degToRad(90));
scene.add(tank_player1.object);

// Criando o player2
var tank_player2 = new Tank(1);
tank_player2.object.position.set(-8.0, 1.1, -52.0);
tank_player2.object.rotateY(THREE.MathUtils.degToRad(90));
scene.add(tank_player2.object);

// Criando o vetor de projéteis
var Bullet = [];

///////////////////////////////////////////////////

///////////////////////////////////////////////////

// Criando as propriedades da câmera
var camPosition = new THREE.Vector3(0, 0, 0);
var camUpPosition = new THREE.Vector3(0.0, 1.0, 0.0);
var camLookPosition = new THREE.Vector3(0.0, 0.0, 0.0);

// Setando a posição da a câmera principal
camera.position.copy(camPosition);
camera.up.copy(camUpPosition);
camera.lookAt(camLookPosition);

// Criando um Holder para a camera
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

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
scene.add(wall);

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
        camPosition.set(20, 40, -30);

        camera.position.copy(camPosition);
        camera.up.copy(camUpPosition);
        camera.lookAt(camLookPosition);

        cameraHolder.position.x = position[2]/2 - 20;
        cameraHolder.position.y = position[2]/2 - 20;
    }
}

render();
function render()
{
    play();
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}