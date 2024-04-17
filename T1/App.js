import * as THREE from 'three';
import { initRenderer,
         initDefaultBasicLight,
         setDefaultMaterial,
         onWindowResize } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './Tank.js';
import { CreateLevel } from './Levels.js';
import { directionTankWithCollision } from './Collisions.js';
import { CriaBala, balaAnda } from './Bullet.js';

// Declaração de variáveis úteis.
let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
var camera = new THREE.PerspectiveCamera                        // Iniciando a câmera.
    (45, window.innerWidth / window.innerHeight, 0.1, 100);
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.

// Iniciando e configurando o OrbitControls
var orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;

// Função utilizada para redimensionar a tela do navegador caso haja alterações
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Começando o jogo.
// Função play chamada na render atualiza toda a lógica do jogo.
function play() {
    swapOrbitControls();
    InitBullet();
    BulletControl(Bullet);
    movement();
    updateCamera();
    atualizaPosition();
}

function movement() {
    let direction1 = directionTankWithCollision(tank_player1, wall);
    if(direction1 == null) tank_player1.moveTank(0);
    else tank_player1.moveTankWithCollision(0, direction1);

    let direction2 = directionTankWithCollision(tank_player2, wall);
    if(direction2 == null) tank_player2.moveTank(1);
    else tank_player2.moveTankWithCollision(1, direction2);
}

function InitBullet(){
    var keyboard = new KeyboardState();
    if(keyboard.down("/") || keyboard.down('Q')){
        Bullet.push(CriaBala(tank_player1.object, tank_player2));
        scene.add(Bullet[Bullet.length-1].obj);
        BulletControl(Bullet);
        console.log(Bullet);
    }
    if(keyboard.down("space") || keyboard.down(",")){
        Bullet.push(CriaBala(tank_player2.object, tank_player1));
        scene.add(Bullet[Bullet.length-1].obj);
        BulletControl(Bullet);
        console.log(tank_player1.getVida());
    }
}

function BulletControl(Bullet) {
    if (Bullet.length === 0){
        return 0;
    }
    else{
        Bullet.forEach((bullet, index) => {
            let remove = balaAnda(bullet);
            if(remove) { 
                scene.remove(bullet.obj);
                Bullet.splice(index, 1);
            };
        });
    }
}

// Criando o player1
var tank_player1 = new Tank(0);
tank_player1.object.position.set(-8.0, 1.1, -8.0);
tank_player1.object.rotateY(THREE.MathUtils.degToRad(90));
tank_player1.setDirection(tank_player1.object.getWorldDirection(new THREE.Vector3()));
scene.add(tank_player1.object);

// Criando o player2
var tank_player2 = new Tank(1);
tank_player2.object.position.set(-8.0, 1.1, -56.0);
tank_player2.object.rotateY(THREE.MathUtils.degToRad(90));
tank_player2.setDirection(tank_player2.object.getWorldDirection(new THREE.Vector3()));
scene.add(tank_player2.object);

// Criando o vetor de projéteis
var Bullet = [];

///////////////////////////////////////////////////
// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Ponto de Visualização
let ponto = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32, 50), setDefaultMaterial('red'));
let position = midPosition();
ponto.position.set(position[0], ponto.position.y, position[1]);
scene.add(ponto);
function atualizaPosition() {
    let position = midPosition();
    ponto.position.set(position[0], ponto.position.y, position[1]);
}

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
    let position1 = new THREE.Vector3();
    let position2 = new THREE.Vector3();
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