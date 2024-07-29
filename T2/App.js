// Importações básicas.
import * as THREE from 'three';
import { initRenderer,
         initDefaultBasicLight,
         onWindowResize } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { SecondaryBox } from '../libs/util/util.js';

import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
import { CheckCollisionsWithWall } from './src/Collisions.js';
// import { directionTankWithCollision } from './Collisions.js';
// import { CriaBala, balaAnda } from './Bullet.js';

// Declaração de variáveis úteis.
let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.
var message = new SecondaryBox();                               // Criando as mensagens de vida.
var keyboard = new KeyboardState();                             // Criando o KeyboardState.

// Renderizando o primeiro nível nível.
let level = CreateLevel(1);
scene.add(level.wall);
scene.add(level.floor);

// Inserindo os tanques em cena.
let tank1 = new Tank(1);
tank1.mesh.position.set(54, 0, 10);
scene.add(tank1.mesh);
let tank2 = new Tank(2);
tank2.mesh.position.set(10, 0, 10);
scene.add(tank2.mesh);

// Criando a câmera.
let camera = new Camera(tank1.mesh.getWorldPosition(new THREE.Vector3()), tank2.mesh.getWorldPosition(new THREE.Vector3));

// Iniciando e configurando o OrbitControls
var orbitControls = new OrbitControls(camera.camera, renderer.domElement);
orbitControls.enabled = true;

// Função utilizada para redimensionar a tela do navegador caso haja alterações.
let zoomWidth = window.innerWidth;
window.addEventListener('resize', function(){
    camera.camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);

    // Adicionar ou remover zoom da camera para o redimensionamento.
    camera.holder.translateZ((this.window.innerWidth-zoomWidth)/15)
    zoomWidth = this.window.innerWidth;
}, false);

// Começando o jogo.
// Função play chamada na render atualiza toda a lógica do jogo.
function play(end) {
    if(!end) {
        tank1.move(1);
        CheckCollisionsWithWall(tank1, level);
        tank2.move(2);
        camera.update(tank1.mesh.getWorldPosition(new THREE.Vector3()), tank2.mesh.getWorldPosition(new THREE.Vector3));
    }
};

// Função que constrola a lógica de gameover.
function end() {
    message.changeMessage("To Do");
    return false;
};

// Criando as propriedades da câmera.
var camPosition = new THREE.Vector3(32, 40, -30);
var camUpPosition = new THREE.Vector3(0.0, 0.1, 0.0);

// Setando a posição da câmera principal.
camera.setPosition(camPosition);
camera.setUpPosition(camUpPosition);

render();
function render() {
    play(end());
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};