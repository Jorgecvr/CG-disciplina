import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { initRenderer,
         initCamera,
         initDefaultBasicLight,
         setDefaultMaterial,
         onWindowResize,
         createGroundPlaneXZ } from '../../libs/util/util.js';

import { CreateTank, TankMove } from './Tank.js';
import { CreateLevelOne } from './Level_one.js';

let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
let camera = initCamera();                                      // Iniciando a câmera.
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.  
let orbit = new OrbitControls( camera, renderer.domElement ); // Permitindo rotação de mouse, pan, zoom etc.

// Função utilizada para redimensionar a tela do navegador caso haja alterações
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Criando as propriedades da câmera
var camPosition = new THREE.Vector3(0.0, 0.0, 0.0);
var camUpPosition = new THREE.Vector3(0.0, 1.0, 0.0);
var camLookPosition = new THREE.Vector3(0.0, 0.0, 0.0);

// Criando a câmera principal
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPosition);
camera.up.copy(camUpPosition);
camera.lookAt(camLookPosition);

function updateCamera(camera, tank_player1, tank_player2) {
    let position = midPosition(tank_player1, tank_player2);
    camLookPosition.set(position[0], camLookPosition.y, position[1]);
    camPosition.set(0.0, (10.0 + position[2]), (10.0 + position[2]));

    camera.position.copy(camPosition);
    camera.up.copy(camUpPosition);
    camera.lookAt(camLookPosition);
}

// // Show axes (parameter is size of each axis)
// let axesHelper = new THREE.AxesHelper( 12 );
// scene.add( axesHelper );

// Criando o plano
let plane = createGroundPlaneXZ(30, 30)
scene.add(plane);

// Criando o chão
let base = CreateLevelOne();
scene.add(base);

// Criando o player1
let tank_player1 = CreateTank(0);
tank_player1.position.set(6.0, 1.1, 8.0);
scene.add(tank_player1);

// Criando o player2
let tank_player2 = CreateTank(1.0);
tank_player2.position.set(-6.0, 1.1, -8.0);
tank_player2.rotateY(THREE.MathUtils.degToRad(180))
scene.add(tank_player2);

// Ponto de visualização
let materialPoint = setDefaultMaterial('red');
let geometryPoint = new THREE.SphereGeometry(1, 32, 16);
let point = new THREE.Mesh(geometryPoint, materialPoint);
let position = midPosition(tank_player1, tank_player2);
point.position.set(position[0], 1.1, position[1]);
scene.add(point);

function alteraPontoVisualizacao(tank_player1, tank_player2) {
    let position = midPosition(tank_player1, tank_player2);
    point.position.set(position[0], 1.1, position[1]);
}




// Calculando a posição média entre os tanques e a distância entre eles
function midPosition(tank_player1, tank_player2) {
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

render();
function render()
{
    TankMove(tank_player1, 0);
    TankMove(tank_player2, 1);
    alteraPontoVisualizacao(tank_player1, tank_player2);
    updateCamera(camera, tank_player1, tank_player2);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}