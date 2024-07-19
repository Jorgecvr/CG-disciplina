import * as THREE from  'three';
import GUI from '../../libs/util/dat.gui.module.js';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        initDefaultSpotlight,
        createGroundPlane,
        createLightSphere,        
        onWindowResize} from "../../libs/util/util.js";

let scene, renderer, camera, light, lightSphere, lightPosition, orbit;
scene = new THREE.Scene();
renderer = initRenderer("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(2.18, 1.62, 3.31);
    camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement );

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Adição da luz ambiente.
let ambientColor = "rgb(100, 100, 100)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

lightPosition = new THREE.Vector3(1.5, 0.7, 1.1);
light = new THREE.DirectionalLight('white', 5);
light.position.copy(lightPosition);
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 6;
light.shadow.camera.left = -2.5;
light.shadow.camera.right = 2.5;
light.shadow.camera.bottom = -2.5;
light.shadow.camera.top = 2.5;

lightSphere = createLightSphere(scene, 0.06, 10, 10, lightPosition);
scene.add(light);

var groundPlane = createGroundPlane(4.0, 2.5, 50, 50);
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Criando o Cilindro
let phongMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(53, 246, 255)",
    flatShading: true
});
let cilindro = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.4, 1.5, 20), phongMaterial);
cilindro.position.set(0.8, 0.75, 0.6);
scene.add(cilindro);

// Criando o Teapot
let phongMaterial2 = new THREE.MeshPhongMaterial({
    color: 'rgb(255, 20, 20)',
    shininess: "200",
    specular: "rgb(255, 255, 255)"
});
let teapot = new THREE.Mesh(new TeapotGeometry(0.3), phongMaterial2);
teapot.position.set(-0.3, 0.3, 0.0);
scene.add(teapot);

// Criando a Esfera
let lambertMaterial = new THREE.MeshLambertMaterial({
    color: 'rgb(96, 233, 105)',
});
let phongMaterial3 = new THREE.MeshPhongMaterial({
    color: 'rgb(96, 233, 105)',
    shininess: "200",
});
let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), lambertMaterial);
sphere.position.set(-1.2, 0.3, -0.6);
scene.add(sphere);

function buildInterface()
{
    let controls = new function() {
        this.shadow = false;

        this.onEnableShadows = function() {
            light.castShadow = this.shadow;
            groundPlane.receiveShadow = this.shadow;
            cilindro.castShadow = this.shadow;
            cilindro.receiveShadow = this.shadow;
            teapot.castShadow = this.shadow;
            teapot.receiveShadow = this.shadow;
            sphere.castShadow = this.shadow;
            sphere.receiveShadow = this.shadow;
        };
    };

    let gui = new GUI();
    gui.add(controls, 'shadow', true)
    .name("Enable Shadows")
    .onChange(function(e) { controls.onEnableShadows() });
};

buildInterface();
render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
