// Importações básicas.
import * as THREE from 'three';
import { initRenderer } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
import { Light } from './src/Light.js';
import { CriaBala , BalaAnda } from './src/Bullet.js';


// Declaração de variáveis úteis.
var scene = new THREE.Scene();                      // Criando a main scene.
var renderer = initRenderer("rgb(30, 30, 42)");     // Iniciando o renderer básico.

// Adicionando a skybox.
const textureLoader = new THREE.TextureLoader();
let textureEquirec = textureLoader.load('./assets/textures/skybox.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec;

var level1 = CreateLevel(1);                        // Criando o nível 1.
var level2 = CreateLevel(2);                        // Criando o nível 2.
var level3 = CreateLevel(3);                        // Criando o nível 3.
var levelType = 1;                                  // Armazena o tipo do nível atual (começa em 1).

// Adicionando os níveis a cena.
scene.add(level1);
scene.add(level2);
scene.add(level3);

var player;                                         // Criando o player.
player = new Tank(1, 2, scene);
player.object.position.set(20, 0, 10);
scene.add(player.object);

// Luz ambiente geral.
var ambientLight = new THREE.AmbientLight("rgb(20, 20, 20)");   
    ambientLight.castShadow = false;
    scene.add(ambientLight);

// Luz direcional do nível 1.
var directionalLightLevel1 = new THREE.DirectionalLight("white", 0.4);
    directionalLightLevel1.position.set(64, 30, 0);
    scene.add(directionalLightLevel1);
    scene.add(directionalLightLevel1.target);
    directionalLightLevel1.target.position.set(50, 5, 16);
    directionalLightLevel1.castShadow = true;

// Definindo o mapa de sombras do primeiro nível.
const shadow1 = directionalLightLevel1.shadow;
    shadow1.mapSize.width = 2048;
    shadow1.mapSize.height = 2048;
    shadow1.camera.near = 1;
    shadow1.camera.far = 100;
    shadow1.camera.left = -28;
    shadow1.camera.right = 46;
    shadow1.camera.bottom = -18;
    shadow1.camera.top = 36;

// Luz direcional no nível 3.
var directionalLightLevel3 = new THREE.DirectionalLight("white", 0.4);
    directionalLightLevel3.position.set(164, 40, -8);
    scene.add(directionalLightLevel3);
    scene.add(directionalLightLevel3.target);
    directionalLightLevel3.target.position.set(190, 5, 16);
    directionalLightLevel3.castShadow = true;

// Definindo o mapa de sombras do terceiro nível.
const shadow3 = directionalLightLevel3.shadow;
    shadow3.mapSize.width = 2048;
    shadow3.mapSize.height = 2048;
    shadow3.camera.near = 1;
    shadow3.camera.far = 100;
    shadow3.camera.left = -55;
    shadow3.camera.right = 40;
    shadow3.camera.bottom = -27;
    shadow3.camera.top = 50;

// Array para as luminárias.
var spotLights = [];

// Inserindo os spotLights.
// Luminária 1.
let spotLight1 = new Light();
spotLight1.object.position.set(146, 0.2, 42);
spotLight1.object.rotateY(THREE.MathUtils.degToRad(135));
spotLight1.spotLight.position.set(143.3, 21.8, 39.3);
spotLight1.spotLight.target.position.set(137, 0.2, 32);
spotLight1.spotLight.target.updateMatrixWorld();
scene.add(spotLight1.object);
scene.add(spotLight1.spotLight);
spotLights.push(spotLight1);

// Luminária 2.
let spotLight2 = new Light();
spotLight2.object.position.set(82, 0.2, 2);
spotLight2.object.rotateY(THREE.MathUtils.degToRad(-45));
spotLight2.spotLight.position.set(84.8, 21.8, 4.8);
spotLight2.spotLight.target.position.set(91, 0.2, 11);
spotLight2.spotLight.target.updateMatrixWorld();
scene.add(spotLight2.object);
scene.add(spotLight2.spotLight);
spotLights.push(spotLight2);

// Luminária 3.
let spotLight3 = new Light();
spotLight3.object.position.set(114, 0.2, 42.7);
spotLight3.object.rotateY(THREE.MathUtils.degToRad(90));
spotLight3.spotLight.position.set(114, 21.8, 38.9);
spotLight3.spotLight.target.position.set(114, 0.2, 34.5);
spotLight3.spotLight.target.updateMatrixWorld();
spotLight3.spotLight.angle = THREE.MathUtils.degToRad(24);
scene.add(spotLight3.object);
scene.add(spotLight3.spotLight);
spotLights.push(spotLight3);

// Luminária 4.
let spotLight4 = new Light();
spotLight4.object.position.set(144, 0.2, 1.3);
spotLight4.object.rotateY(THREE.MathUtils.degToRad(-90));
spotLight4.spotLight.position.set(114, 21.8, 5.2);
spotLight4.spotLight.target.position.set(114, 0.2, 9.5)
spotLight4.spotLight.target.updateMatrixWorld();
spotLight4.spotLight.angle = THREE.MathUtils.degToRad(24);
scene.add(spotLight4.object);
scene.add(spotLight4.spotLight);
spotLights.push(spotLight4);

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

var camera = new Camera(renderer);                  // Criando a câmera.
    scene.add(camera.holder);                       // Adicionando o câmera holder.           
    camera.holder.add(camera.camera);

camera.init(player.object.getWorldPosition(new THREE.Vector3));

// Função para verificar o pressionamento de teclas.
function keyboardPress() {
    let keyboard = new KeyboardState();
    keyboard.update();

    // Mudaça do OrbitControls da Câmera.
    if(keyboard.down("space")) {
        //camera.swapOrbitControls();
        console.log(player.object.getWorldPosition(new THREE.Vector3));
    }
};
    
// Função play chamada na render atualiza a lógica do jogo.
function play() {
    keyboardPress();
    player.movePlayer(0, level1, 1);
    camera.update(player.object.getWorldPosition(new THREE.Vector3));
    updateMovingWalls();
};

// Função de atualização das paredes móveis.
var wallsDirections = [0, 0, 0];
function updateMovingWalls() {
    // Definindo as velocidades das paredes móveis.
    let velMovingWall1 = 0.1;
    let velMovingWall2 = -0.05;
    let velMovingWall3 = 0.15;

    if(wallsDirections[0] == 1) {
        velMovingWall1 *= -1;
    }
    if(wallsDirections[1] == 1) {
        velMovingWall2 *= -1;
    }
    if(wallsDirections[2] == 1) {
        velMovingWall3 *= -1;
    }

    // Definindo constantes para as paredes móveis.
    const movingWall1 = level3.children[4];
    const movingWall2 = level3.children[5];
    const movingWall3 = level3.children[6];

    movingWall1.position.z += velMovingWall1;
    movingWall2.position.z += velMovingWall2;
    movingWall3.position.z += velMovingWall3;

    // Limita o movimento das paredes.
    if(movingWall1.position.z > 16) {
        wallsDirections[0] = 1;
    }
    if(movingWall1.position.z < -0.1) {
        wallsDirections[0] = 0;
    }
    if(movingWall2.position.z > 0.1) {
        wallsDirections[1] = 0;
    }
    if(movingWall2.position.z < -16) {
        wallsDirections[1] = 1;
    }
    if(movingWall3.position.z > 16) {
        wallsDirections[2] = 1;
    }
    if(movingWall3.position.z < -0.1) {
        wallsDirections[2] = 0;
    }
};

render();
function render() {
    play();
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};