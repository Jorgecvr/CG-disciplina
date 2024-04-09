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
import { CreateTankEnemy, TankEnemyMove } from './TankEnemy.js';

let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
let camera = initCamera(new THREE.Vector3(0, 15, 30));          // Iniciando a câmera nessa posição.
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.  
let orbit = new OrbitControls( camera, renderer.domElement );   // Permitindo rotação de mouse, pan, zoom etc.

// Função utilizada para redimensionar a tela do navegador caso haja alterações
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// // Show axes (parameter is size of each axis)
// let axesHelper = new THREE.AxesHelper( 12 );
// scene.add( axesHelper );

// Criando o plano
let plane = createGroundPlaneXZ(30, 30)
scene.add(plane);

// Criando o player1
let tank_player1 = CreateTank(2.0);
scene.add(tank_player1);

// Criando o player2
let tank_player2 = CreateTankEnemy(2.0);
scene.add(tank_player2);

render();
function render()
{
    TankMove(tank_player1);
    TankEnemyMove(tank_player2);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}