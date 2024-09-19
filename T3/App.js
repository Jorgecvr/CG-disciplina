// Importações básicas.
import * as THREE from 'three';
import { initRenderer } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
import { Light } from './src/Light.js';

// Declaração de variáveis úteis.
var scene = new THREE.Scene();                      // Criando a main scene.
var renderer = initRenderer("rgb(30, 30, 42)");     // Iniciando o renderer básico.

// Adicionando a skybox.
const textureLoader = new THREE.TextureLoader();
let textureEquirec = textureLoader.load('./assets/textures/skybox.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec;

var level1;                                         // Criando o nível 1.
var level2;                                         // Criando o nível 2.
var level3;                                         // Criando o nível 3.
var levelType = 1;                                  // Armazena o tipo do nível atual (começa em 1).

var player;                                         // Criando o player.
player = new Tank(1, 2);
player.object.position.set(200, 0, 10);
scene.add(player.object);

// Luz ambiente geral.
var ambientLight = new THREE.AmbientLight("rgb(30, 30, 30)");   
    ambientLight.castShadow = false;
    scene.add(ambientLight);

// Luz direcional do nível 1.
var directionalLightLevel1 = new THREE.DirectionalLight("white", 0.3);
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
var directionalLightLevel3 = new THREE.DirectionalLight("white", 0.3);
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

var directionalLightLevel3                          // Luz direcional do nível 3.

var camera = new Camera(renderer);                  // Criando a câmera.
    scene.add(camera.holder);                       // Adicionando o câmera holder.           
    camera.holder.add(camera.camera);

camera.init(player.object.getWorldPosition(new THREE.Vector3));

let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16));
sphere.position.set(190, 5, 16);
scene.add(sphere);

// Função para verificar o pressionamento de teclas.
function keyboardPress() {
    let keyboard = new KeyboardState();
    keyboard.update();

    // Mudaça do OrbitControls da Câmera.
    if(keyboard.down("O")) {
        console.log("AQUII");
        camera.swapOrbitControls();
    }
};
    
// Função play chamada na render atualiza a lógica do jogo.
function play() {
    keyboardPress();
    player.movePlayer(levelType);
    camera.update(player.object.getWorldPosition(new THREE.Vector3));
};

render();
function render() {
    play();
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};

level1 = CreateLevel(1);
scene.add(level1);
level2 = CreateLevel(2);
scene.add(level2);
level3 = CreateLevel(3);
scene.add(level3);