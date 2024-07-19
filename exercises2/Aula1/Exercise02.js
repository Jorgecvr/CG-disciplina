import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from '../../libs/util/util.js';

let scene = new THREE.Scene();                              // Cria uma cena principal.
let renderer = initRenderer();                              // Veja a função em utils/utils.
let camera = initCamera(new THREE.Vector3(0, 15, 30));      // Inicia a câmera nessa posição.
let material = setDefaultMaterial();                        // Cria um material básico.
let light = initDefaultBasicLight(scene);                   // Cria uma luz básica apra iluminar a cena.
let orbit = new OrbitControls(camera, renderer.domElement); // Permite rotação do mouse, panorâmica, zoom etc.

// Ouça as alterações no tamanho da janela.
window.addEventListener('resize', function(){onWindowResize(camera, renderer)}, false);

// Mostra os eixos (o parâmetro é o tamanho de cada eixo).
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// Cria o plano de chão.
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

let material1 = setDefaultMaterial('lightgreen');
let material2 = setDefaultMaterial('lightblue');
let material3 = setDefaultMaterial('darkred');

// Cria o cubo.
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cube = new THREE.Mesh(cubeGeometry, material1);
cube.position.set(0.0, 2.0, 0.0);
scene.add(cube);

// Cria a esfera.
let sphereGeometry = new THREE.SphereGeometry(1.5, 32, 16);
let sphere = new THREE.Mesh(sphereGeometry, material2);
sphere.position.set(6.0, 1.5, 0.0);
scene.add(sphere);

// Cria o cilindro.
let cylinderGeometry = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
let cylinder = new THREE.Mesh(cylinderGeometry, material3);
cylinder.position.set(-6.0, 3.0, 0.0);
scene.add(cylinder);

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Renderizador da cena.
}