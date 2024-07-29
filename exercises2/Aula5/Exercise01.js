import * as THREE from 'three';
import GUI from '../../libs/util/dat.gui.module.js';
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

// Criando as esferas.
let sphere1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32), setDefaultMaterial('red'));
let sphere2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32), setDefaultMaterial('red'));
sphere1.position.set(-6, 1.0, -5);
sphere2.position.set(-6, 1.0, 5);
scene.add(sphere1);
scene.add(sphere2);

// Criando a animação.
const lerpConfig1 = {
    destination: new THREE.Vector3(6, 1.0, -5),
    alpha: 0.01,
    move: false,
    translate: false
};
const lerpConfig2 = {
    destination: new THREE.Vector3(6, 1.0, 5),
    alpha: 0.01,
    move: false,
    translate: false,
};

let translateSphere1 = function() {
    if(sphere1.position.x < 6.0 ) sphere1.translateX(0.2);
    if(sphere1.position.x > 5.95 && sphere1.position.x < 6.05) lerpConfig1.translate = false;
};
let translateSphere2 = function() {
    if(sphere2.position.x < 6.05 ) sphere2.translateX(0.1);
    if(sphere2.position.x > 5.95 && sphere2.position.x < 6.05) lerpConfig2.translate = false;
};

function buildInterface() {
    let controls = new function() {

        this.moveSphere1 = function() {
            lerpConfig1.move = true;
        };
        this.moveSphere2 = function() {
            lerpConfig2.move = true;
        };
        this.moveSpheres = function() {
            lerpConfig1.move = true;
            lerpConfig2.move = true;
        };

        this.translateSphere1 = function() {
            lerpConfig1.translate = true;
        };
        this.translateSphere2 = function() {
            lerpConfig2.translate = true;
        };
        this.translateSpheres = function() {
            lerpConfig1.translate = true;
            lerpConfig2.translate = true;
        };

        this.resetBallsPosition = function() {
            sphere1.position.set(-6, 1.0, -5);
            sphere2.position.set(-6, 1.0, +5);
            lerpConfig1.move = false;
            lerpConfig2.move = false;
            lerpConfig1.translate = false;
            lerpConfig2. translate = false;
        };
    };

    let gui = new GUI();
    gui.add(controls, 'moveSphere1', true).name('Sphere1');
    gui.add(controls, 'moveSphere2', true).name('Sphere2');
    gui.add(controls, 'moveSpheres', true).name('Spheres');

    gui.add(controls, 'translateSphere1', true).name('Translate Sphere1');
    gui.add(controls, 'translateSphere2', true).name('Translate Sphere2');
    gui.add(controls, 'translateSpheres', true).name('Translate Spheres');

    gui.add(controls, 'resetBallsPosition', true).name("Reset");
}

buildInterface();
render();
function render()
{
  if(lerpConfig1.move) sphere1.position.lerp(new THREE.Vector3(6, 1.0, -5), 0.045);
  if(lerpConfig2.move) sphere2.position.lerp(new THREE.Vector3(6, 1.0, 5), 0.03);

  if(lerpConfig1.translate) translateSphere1();
  if(lerpConfig2.translate) translateSphere2();

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Renderizador da cena.
}