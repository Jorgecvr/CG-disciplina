import * as THREE from  'three';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import GUI from '../../libs/util/dat.gui.module.js';
import {initRenderer, 
        initDefaultBasicLight,
        onWindowResize} from "../../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var light = initDefaultBasicLight(scene, true, new THREE.Vector3(3, 3, 1)); 
var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 30)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(5,15,40);
    camera.up.set( 0, 1, 0 );

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Function to set a texture.
function setMaterial(file, repeatU = 1, repeatV = 1, offsetx = 0, offsety = 1, color = 'rgb(255,255,255)',){
    let loader = new THREE.TextureLoader();
    let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color:color});
       mat.map.colorSpace = THREE.SRGBColorSpace;
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
    mat.map.repeat.set(repeatU,repeatV);
    mat.map.offset.x = offsetx;
    mat.map.offset.y = offsety;
    return mat;
 }

// Exercício 1 - Criando o cilindro com textura.
let cylinderMaterials = [
    setMaterial('../../assets/textures/wood.png', 1, 2),    // Corpo.
    setMaterial('../../assets/textures/woodtop.png', 1, 1), // Calota Superior. 
    setMaterial('../../assets/textures/woodtop.png', 1, 1), // Calota Inferior.
];
let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 9, 16), cylinderMaterials);
// cylinder.visible = false;
scene.add(cylinder);

// Exercício 2 - Criando o cubo com textura.
let cubeMaterials = [
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1, 1.333),        // X+.
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1.666, 1.333),    // X-.
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1, 1.666),        // Y+.
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1, 1),            // Y-.
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1.333, 1.666),    // Z+.
    setMaterial('../../assets/textures/tiles.jpg', 0.333, 0.333, 1.666, 1.666),    // Z-.
];
let cube = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8), cubeMaterials);
cube.visible = false;
scene.add(cube);


function buildInterface()
{
    let controls = new function() {
        this.visibile = false;
        this.onSwitchGeometries = function() {
            cylinder.visible = !cylinder.visible;
            cube.visible = !cube.visible;
        };
    };

    let gui = new GUI();
    gui.add(controls, 'visibile', true)
    .name("Switch Geometries")
    .onChange(function(e) { controls.onSwitchGeometries() });
};

buildInterface();
render();
function render()
{
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};