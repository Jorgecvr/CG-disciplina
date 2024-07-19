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
let material = setDefaultMaterial('chocolate');             // Cria um material básico.
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

let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
        let cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(-6 + 6*i, 2.0, -6 + 6*j);
        scene.add(cube);
    }
}

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Renderizador da cena.
}