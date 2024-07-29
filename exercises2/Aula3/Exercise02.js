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

for(let i = 0; i < 12; i++) {
    let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32), setDefaultMaterial('red'));
    sphere.translateY(1);
    sphere.rotateY(THREE.MathUtils.degToRad(i*30));
    sphere.translateZ(7.5);
    scene.add(sphere);
}

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Renderizador da cena.
}