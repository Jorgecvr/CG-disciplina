// Importações básicas.
import * as THREE from 'three';
import { initRenderer } from '../../libs/util/util.js';
import { initDefaultBasicLight, SecondaryBox } from '../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
import { Light } from './src/Light.js';
// import { directionTankWithCollision } from './Collisions.js';
// import { CriaBala, balaAnda } from './Bullet.js';
import { Cannon } from './src/Cannon.js';
import { CannonControl } from './src/CannonControl.js';
import { UpdateEnemies } from './src/Enemies.js';

// Declaração de variáveis úteis.
var scene = new THREE.Scene();                                  // Criando a main scene.
var renderer = initRenderer("rgb(30, 30, 42)");                 // Iniciando o renderer basico.

var ambientLight;                                               // Iniciando o controle da luz ambiente.
var directionalLight;                                           // Iniciando o controle da luz direcional.

var level;                                                      // Criando o nível.

var tank1;                                                      // Criando o primeiro tanque.
var tank2;                                                      // Criando o segundo tanque.    
var tank3;                                                      // Criando o terceiro tanque.

var camera = new Camera(renderer);                              // Criando a câmera.
    scene.add(camera.holder);                                   // Adicionando o câmera holder.
    camera.holder.add(camera.camera);

var message = new SecondaryBox();                               // Criando as mensagens de vida.
var levelType = 1;                                              // Armazena o tipo do nível atual (começa em 1).
var spotLights = [];                                            // Array para as luminárias.
var cannon;                                                     // Criando o canhão.
var cannonControl;                                              // Iniciando o controle do canhão.

// Redimensionamento da câmera utilizando zoom.
var zoom = 1;
var lastWidth = window.innerWidth;
window.addEventListener('resize', function() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.camera.aspect = aspect;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(lastWidth < window.innerWidth) {
        zoom += (window.innerWidth - lastWidth)*0.0007;
    } else if(lastWidth > window.innerWidth) {
        zoom -= (lastWidth - window.innerWidth)*0.0007;
    }
    camera.camera.zoom = zoom;
    camera.camera.updateProjectionMatrix();
    lastWidth = window.innerWidth;
});

// Começando o jogo.
function init() {
    if(levelType == 1) {
        // Renderizando o nível 1.
        level = CreateLevel(1);
        scene.add(level.wall);
        scene.add(level.floor);

        // Inserindo os tanques em cena.
        // Tanque 1.
        tank1 = new Tank(1, 1);
        tank1.object.rotateY(THREE.MathUtils.degToRad(180));
        tank1.object.position.set(10, 0, 36);
        tank1.object.add(tank1.lifeBar);
        tank1.lifeBar.position.y += 5;
        tank1.lifeBar.scale.set(tank1.life / 1000, tank1.lifeBar.scale.y, tank1.lifeBar.scale.z);
        scene.add(tank1.object);
        
        // Tanque 2.
        tank2 = new Tank(2, 1);
        tank2.object.rotateY(THREE.MathUtils.degToRad(180));
        tank2.object.position.set(54, 0, 36);
        tank2.lifeBar.position.set(tank2.object.position.x, tank2.object.position.y + 5, tank2.object.position.z);
        tank2.lifeBar.scale.set(tank2.life / 1000, tank2.lifeBar.scale.y, tank2.lifeBar.scale.z);
        scene.add(tank2.lifeBar);
        scene.add(tank2.object);
        
        // Iniciando a câmera e a orbitCamera do nível 1.
        camera.initCamera(1, tank1.object.getWorldPosition(new THREE.Vector3), tank2.object.getWorldPosition(new THREE.Vector3));

        // Criando luz básica para iluminar a cena do nível 1.
        let power = 4; 
        directionalLight = new THREE.DirectionalLight("white", 0.7 * power);
        directionalLight.position.copy(new THREE.Vector3(32, 100, 22));
        directionalLight.castShadow = true;

        // Definindo o mapa de sombras do primeiro nível (apenas luz direcional).
        const shadow = directionalLight.shadow;
        shadow.mapSize.width = 512;
        shadow.mapSize.height = 512;
        shadow.camera.near = 0.5;
        shadow.camera.far = 500;
        shadow.camera.left = -5;
        shadow.camera.right = 5;
        shadow.camera.bottom = -5;
        shadow.camera.top = 5;

        scene.add(directionalLight);

    } 
    else if(levelType == 2) {
        // Renderizando o nível 2.
        level = CreateLevel(2);
        scene.add(level.wall);
        scene.add(level.floor);

        // Inserindo os tanques em cena.
        // Tanque 1.
        tank1 = new Tank(1, 2);
        tank1.object.name = "Player";
        tank1.object.position.set(8, 0, 10);
        tank1.object.add(tank1.lifeBar);
        tank1.lifeBar.position.y += 5;
        tank1.lifeBar.scale.set(tank1.life / 1000, tank1.lifeBar.scale.y, tank1.lifeBar.scale.z);
        scene.add(tank1.object);

        console.log(tank1.object);

        // Tanque 2.
        tank2 = new Tank(1, 1);
        tank2.object.position.set(60, 0, 36);
        tank2.lifeBar.position.set(tank2.object.position.x, tank2.object.position.y + 5, tank2.object.position.z);
        tank2.lifeBar.scale.set(tank2.life / 1000, tank2.lifeBar.scale.y, tank2.lifeBar.scale.z);
        tank2.object.rotation.set(0, THREE.MathUtils.degToRad(-180), 0);
        scene.add(tank2.lifeBar);
        scene.add(tank2.object);

        // Tanque 3.
        tank3 = new Tank(2, 1);
        tank3.object.position.set(60, 0, 10);
        tank3.lifeBar.position.set(tank3.object.position.x, tank3.object.position.y + 5, tank3.object.position.z);
        tank3.lifeBar.scale.set(tank3.life / 1000, tank3.lifeBar.scale.y, tank3.lifeBar.scale.z);
        tank3.object.rotateY(THREE.MathUtils.degToRad(270));
        scene.add(tank3.lifeBar);
        scene.add(tank3.object);

        // Inserindo Canhão em cena.
        cannon = new Cannon();
        cannon.object.scale.multiplyScalar(1.5);
        cannon.object.position.set(34, 3, 22);
        scene.add(cannon.object);

        // Inicializando o controle do canhão após a definição do canhão.
        cannonControl = new CannonControl(cannon, [tank1, tank2, tank3]);

        // Iniciando a câmera e a orbitCamera do nível 2.
        camera.initCamera(2, tank1.object.getWorldPosition(new THREE.Vector3), tank2.object.getWorldPosition(new THREE.Vector3), tank3.object.getWorldPosition(new THREE.Vector3));

        // Inseriando a luz ambiente.
        ambientLight = new THREE.AmbientLight("rgb(40, 40, 40)");
        ambientLight.castShadow = false;
        scene.add(ambientLight);

        // Inserindo a luz direcional
        directionalLight = new THREE.DirectionalLight("rgb(255, 255, 255)", 3);
        directionalLight.position.copy(new THREE.Vector3(2, 1, 1));
        directionalLight.castShadow = false;
        scene.add(directionalLight);

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
};

// Função que altera o nível e reseta o jogo.
function swapLevel() {
    let keyboard = new KeyboardState();
    keyboard.update();

    // Muda para o nível 1.
    if(keyboard.down(1)) {
        // Nível anterior era o 2.
        if(levelType === 2) {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);
            scene.remove(tank3.object);

            scene.remove(tank2.lifeBar);
            scene.remove(tank3.lifeBar);

            spotLights.forEach((spotLight) => {
                scene.remove(spotLight.object);
                scene.remove(spotLight.spotLight);
            });

            scene.remove(ambientLight);
            scene.remove(directionalLight);

            scene.remove(cannon.object);

            // Atualiza os valores inicias da função que movimente os tanques adversários.
            UpdateEnemies();
    
            // Chamando a função que inicia o jogo com o tipo do nível 1.
            levelType = 1;
            init();
        } else {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);

            scene.remove(tank2.lifeBar);

            scene.remove(directionalLight);

            scene.remove(cannon.object);
    
            // Chamando a função que inicia o jogo com o tipo do nível 2.
            levelType = 1;
            init();
        }
    }
    // Muda para o nível 2.
    if(keyboard.down(2)) {
        // Nível anterior era o 1.
        if(levelType === 1) {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);

            scene.remove(tank2.lifeBar);

            scene.remove(directionalLight);
    
            // Chamando a função que inicia o jogo com o tipo do nível 2.
            levelType = 2;
            init();
        } else {
            // Removendo os elementos da cena.
            scene.remove(level.wall);
            scene.remove(level.floor);
            scene.remove(tank1.object);
            scene.remove(tank2.object);
            scene.remove(tank3.object);

            scene.remove(tank2.lifeBar);
            scene.remove(tank3.lifeBar);

            spotLights.forEach((spotLight) => {
                scene.remove(spotLight.object);
                scene.remove(spotLight.spotLight);
            });

            scene.remove(ambientLight);
            scene.remove(directionalLight);

            scene.remove(cannon.object);

            // Atualiza os valores inicias da função que movimente os tanques adversários.
            UpdateEnemies();
    
            // Chamando a função que inicia o jogo com o tipo do nível 1.
            levelType = 2;
            init();
        }
    }
    // Mudaça do OrbitControls da Câmera.
    if(keyboard.down("O")) {
        camera.swapOrbitControls();
    }
    if(keyboard.down("space")) {
        console.log(tank1.object.getWorldPosition(new THREE.Vector3));
        // console.log(spotLights[0].object.getWorldPosition(new THREE.Vector3));
    }
};

// Função play chamada na render atualiza toda a lógica do jogo.
function play(end) {
    if(!end) {
        if(levelType == 1) {
            camera.update1(tank1.object.getWorldPosition(new THREE.Vector3), tank2.object.getWorldPosition(new THREE.Vector3));
            tank1.move(1, level, levelType);
            tank2.move(2, level, levelType, tank1.object);
        } else {
            if(tank2.isDead) {
                // Tanque 2 morto.
                camera.update1(tank1.object.getWorldPosition(new THREE.Vector3), tank3.object.getWorldPosition(new THREE.Vector3));
                tank3.move(3, level, levelType, tank1.object);
            } else if(tank3.isDead) {
                // Tanque 3 morto.
                camera.update1(tank1.object.getWorldPosition(new THREE.Vector3), tank2.object.getWorldPosition(new THREE.Vector3));
                tank2.move(2, level, levelType, tank1.object);
            } else {
                // Nenhum tanque adversário morto.
                camera.update2(tank1.object.getWorldPosition(new THREE.Vector3), tank2.object.getWorldPosition(new THREE.Vector3), tank3.object.getWorldPosition(new THREE.Vector3));
                // tank2.move(2, level, levelType, tank1.object);
                // tank3.move(3, level, levelType, tank1.object);
            }
            tank1.move(1, level, levelType);
            cannonControl.updateCannonRotation();  // Atualizando a rotação do canhão.
            
        }
        tank2.lifeBar.position.set(tank2.object.position.x, tank2.object.position.y + 5, tank2.object.position.z);
        // tank3.lifeBar.position.set(tank3.object.position.x, tank3.object.position.y + 5, tank3.object.position.z);
         
        tank1.life -= 5;
        if(tank1.lifeBar.scale.x > 0) tank1.lifeBar.scale.set(tank1.life / 1000, tank1.lifeBar.scale.y, tank1.lifeBar.scale.z);
    }
};

// Função que constrola a lógica de gameover.
function end() {
    message.changeMessage("To Do");
    return false;
};

init();
render();
function render() {
    swapLevel();
    play(end());
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};