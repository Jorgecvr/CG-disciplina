import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from '../../libs/util/util.js';

var scene = new THREE.Scene();                              // Cria uma cena principal.
var renderer = initRenderer();                              // Veja a função em utils/utils.
var camera = initCamera(new THREE.Vector3(15, 15, 15));     // Inicia a câmera nessa posição.
var material = setDefaultMaterial();                        // Cria um material básico.
var light = initDefaultBasicLight(scene);                   // Cria uma luz básica apra iluminar a cena.
var orbit = new OrbitControls(camera, renderer.domElement); // Permite rotação do mouse, panorâmica, zoom etc.

// Ouça as alterações no tamanho da janela.
window.addEventListener('resize', function(){onWindowResize(camera, renderer)}, false);

// Mostra os eixos (o parâmetro é o tamanho de cada eixo).
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// Cria o plano de chão.
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// Carrega um material vermelho padrão.
let material1 = setDefaultMaterial();
// Cria um material verde claro utilizando o padrão de nomenclatura do X11.
let material2 = setDefaultMaterial('lightgreen');
// Cria um material azul passando como parâmetro o código RGB explicitamente.
let material3 = setDefaultMaterial('rgb(0, 0, 255)');

// Cria o primeiro cubo.
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cube = new THREE.Mesh(cubeGeometry, material1);
// Posiciona o cubo.
cube.position.set(0.0, 2.0, 0.0);
// Adiciona o cubo na cena.
scene.add(cube);

// Cria o segundo cubo.
cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
cube = new THREE.Mesh(cubeGeometry, material2);
cube.position.set(-4.0, 1.0, 4.0);
scene.add(cube);

// Cria o terceiro cubo.
cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
cube = new THREE.Mesh(cubeGeometry, material3);
cube.position.set(8.0, 0.5, 0.0);
scene.add(cube);

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Renderizador da cena.
}