import * as THREE from 'three';
import { initRenderer,
         initCamera,
         initDefaultBasicLight,
         setDefaultMaterial,
         onWindowResize,
         createGroundPlaneXZ } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { CreateTank, TankMove } from './Tank.js';
import { CreateLevel } from './Levels.js';

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

var speed = 0;
// Começando o jogo.
function play() {
    swapOrbitControls();
    updateCamera();
}

// Criando o player1
var tank_player1 = CreateTank(0);
tank_player1.position.set(-8.0, 1.1, -8.0);
scene.add(tank_player1);

// Criando o player2
var tank_player2 = CreateTank(1.0);
tank_player2.position.set(-8.0, 1.1, -56.0);
tank_player2.rotateY(THREE.MathUtils.degToRad(180))
scene.add(tank_player2);

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
let nivel = [
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
let base = CreateLevel(nivel);
scene.add(base);

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
    tank_player1.getWorldPosition(position1);
    tank_player2.getWorldPosition(position2);
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
    TankMove(tank_player1, 0);
    TankMove(tank_player2, 1);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}