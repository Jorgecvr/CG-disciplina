// Importações básicas.
import * as THREE from 'three';
import { initRenderer,
         initDefaultBasicLight } from '../../libs/util/util.js';
import { SecondaryBox } from '../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
// import { directionTankWithCollision } from './Collisions.js';
// import { CriaBala, balaAnda } from './Bullet.js';

// Declaração de variáveis úteis.
var scene = new THREE.Scene();                                  // Criando a main scene.
var renderer = initRenderer();                                  // Iniciando o renderer basico.
var light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.
var level;                                                      // Criando o nível.
var tank1;                                                      // Criando o primeiro tanque.
var tank2;                                                      // Criando o segundo tanque.    
var tank3;                                                      // Criando o terceiro tanque.
var camera;                                                     // Criando a câmera.
var message = new SecondaryBox();                               // Criando as mensagens de vida.

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
function init() {
    // Renderizando o nível.
    level = CreateLevel(1);
    scene.add(level.wall);
    scene.add(level.floor);

    
    // Inserindo os tanques em cena.
    tank1 = new Tank(1);
    tank1.object.position.set(54, 0, 10);
    scene.add(tank1.object);
    tank2 = new Tank(2);
    tank2.object.position.set(10, 0, 10);
    scene.add(tank2.object);

    // Criando a câmera.
    camera = new Camera(tank1.object.getWorldPosition(new THREE.Vector3()), tank2.object.getWorldPosition(new THREE.Vector3), renderer);

    // Criando as propriedades da câmera.
    var camPosition = new THREE.Vector3(32, 40, -30);
    var camUpPosition = new THREE.Vector3(0.0, 0.1, 0.0);
    
    // Setando a posição da câmera principal.
    camera.setPosition(camPosition);
    camera.setUpPosition(camUpPosition);
};


// Função play chamada na render atualiza toda a lógica do jogo.
function play(end, camera) {
    if(!end) {
        camera.update(tank1.object.getWorldPosition(new THREE.Vector3()), tank2.object.getWorldPosition(new THREE.Vector3));
        tank1.move(1, level);
        tank2.move(2, level);
    }
};

// Função que constrola a lógica de gameover.
function end() {
    message.changeMessage("To Do");
    return false;
};

// Função que altera o nível e reseta o jogo.
function swapLevel() {
    let keyboard = new KeyboardState();
    keyboard.update();

    if(keyboard.down(1)) {
        scene.remove(level.wall);
        scene.remove(level.floor);
        level = CreateLevel(1);
        scene.add(level.wall);
        scene.add(level.floor);
    }
    if(keyboard.down(2)) {
        scene.remove(level.wall);
        scene.remove(level.floor);
        level = CreateLevel(2);
        scene.add(level.wall);
        scene.add(level.floor);
    }
};

init();
render();
function render() {
    swapLevel();
    play(end(), camera);
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};