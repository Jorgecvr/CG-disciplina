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
import { Light } from './src/Light.js';
// import { directionTankWithCollision } from './Collisions.js';
// import { CriaBala, balaAnda } from './Bullet.js';

// Declaração de variáveis úteis.
var scene = new THREE.Scene();                                  // Criando a main scene.
var renderer = initRenderer();                                  // Iniciando o renderer basico.
    renderer.setClearColor("rgb(30, 30, 42)");
// var light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.

// Adição da luz ambiente.
let ambientColor = "rgb(50, 50, 50)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

var level;                                                      // Criando o nível.
var tank1;                                                      // Criando o primeiro tanque.
var tank2;                                                      // Criando o segundo tanque.    
var tank3;                                                      // Criando o terceiro tanque.
var camera;                                                     // Criando a câmera.
var message = new SecondaryBox();                               // Criando as mensagens de vida.
var levelType = 2;                                              // Armazena o tipo do nível atual (começa em 1).
var spotLights = [];                                            // Array para as luminárias.

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
    if(levelType == 1) {
        // Renderizando o nível 1.
        level = CreateLevel(1);
        scene.add(level.wall);
        scene.add(level.floor);

        // Inserindo os tanques em cena.
        tank1 = new Tank(1, 1);
        tank1.object.position.set(54, 0, 10);
        scene.add(tank1.object);
        tank2 = new Tank(2, 1);
        tank2.object.position.set(10, 0, 10);
        scene.add(tank2.object);
    } 
    else if(levelType == 2) {
        // Renderizando o nível 2.
        level = CreateLevel(2);
        scene.add(level.wall);
        scene.add(level.floor);

        // Inserindo os tanques em cena.
        tank1 = new Tank(1, 2);
        tank1.object.position.set(60, 0, 36);
        tank1.object.rotateY(THREE.MathUtils.degToRad(180));
        scene.add(tank1.object);
        tank2 = new Tank(1, 1);
        tank2.object.position.set(8, 0, 10);
        scene.add(tank2.object);
        tank3 = new Tank(2, 1);
        tank3.object.position.set(8, 0, 36);
        tank3.object.rotateY(THREE.MathUtils.degToRad(90));
        scene.add(tank3.object);

        // Inserindo os spotLights.
        // Luminária 1.
        let spotLight1 = new Light();
        spotLight1.object.position.set(66, 0.2, 42);
        spotLight1.object.rotateY(THREE.MathUtils.degToRad(135));
        spotLight1.spotLight.position.set(63.3, 21.8, 39.3);
        spotLight1.spotLight.target.position.set(57, 0.2, 32);
        spotLight1.spotLight.target.updateMatrixWorld();
        scene.add(spotLight1.object);
        scene.add(spotLight1.spotLight);
        spotLights.push(spotLight1);

        // Luminária 2.
        let spotLight2 = new Light();
        spotLight2.object.position.set(2, 0.2, 2);
        spotLight2.object.rotateY(THREE.MathUtils.degToRad(-45));
        spotLight2.spotLight.position.set(4.8, 21.8, 4.8);
        spotLight2.spotLight.target.position.set(11, 0.2, 11);
        spotLight2.spotLight.target.updateMatrixWorld();
        scene.add(spotLight2.object);
        scene.add(spotLight2.spotLight);
        spotLights.push(spotLight2);

        // Luminária 3.
        let spotLight3 = new Light();
        spotLight3.object.position.set(34, 0.2, 42.7);
        spotLight3.object.rotateY(THREE.MathUtils.degToRad(90));
        spotLight3.spotLight.position.set(34, 21.8, 38.9);
        spotLight3.spotLight.target.position.set(34, 0.2, 34.5);
        spotLight3.spotLight.target.updateMatrixWorld();
        spotLight3.spotLight.angle = THREE.MathUtils.degToRad(24);
        scene.add(spotLight3.object);
        scene.add(spotLight3.spotLight);
        spotLights.push(spotLight3);

        // Luminária 4.
        let spotLight4 = new Light();
        spotLight4.object.position.set(34, 0.2, 1.3);
        spotLight4.object.rotateY(THREE.MathUtils.degToRad(-90));
        spotLight4.spotLight.position.set(34, 21.8, 5.2);
        spotLight4.spotLight.target.position.set(34, 0.2, 9.5)
        spotLight4.spotLight.target.updateMatrixWorld();
        spotLight4.spotLight.angle = THREE.MathUtils.degToRad(24);
        scene.add(spotLight4.object);
        scene.add(spotLight4.spotLight);
        spotLights.push(spotLight4);
    }
    

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
        tank1.move(1, level, levelType);
        tank2.move(2, level, levelType);
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

    // Muda para o nível 1.
    if(keyboard.down(1)) {
        // Apenas reinicia se o nível anterior era o 2.
        if(levelType === 2) {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);
            scene.remove(tank3.object);

            spotLights.forEach((spotLight) => {
                scene.remove(spotLight.object);
                scene.remove(spotLight.spotLight);
            });
    
            // Chamando a função que inicia o jogo com o tipo do nível 1.
            levelType = 1;
            init();
        }
    }
    // Muda para o nível 2.
    if(keyboard.down(2)) {
        // Apenas reinicia se o nível anterior era o 1.
        if(levelType === 1) {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);
    
            // Chamando a função que inicia o jogo com o tipo do nível 2.
            levelType = 2;
            init();
        }
    }
    // Mudaça do OrbitControls da Câmera.
    if(keyboard.down("O")) {
        camera.swapOrbitControls();
    }
    if(keyboard.down("space")) {
        console.log(tank1.object.getWorldPosition(new THREE.Vector3()));
        console.log(spotLights[0].object.getWorldPosition(new THREE.Vector3()));
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