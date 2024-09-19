import * as THREE from  'three';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../../libs/util/KeyboardState.js';
import {initRenderer, 
        initDefaultBasicLight,
        onWindowResize} from "../../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 30)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(0, 0, 10);
    camera.up.set( 0, 1, 0 );

var light = new THREE.DirectionalLight("rgb(255, 255, 255)", 2);
light.position.set(5, -4, 10);
let directionalLightTarget = new THREE.Object3D();
    directionalLightTarget.position.set(0, 0, 0);
light.target = directionalLightTarget;
scene.add(light);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Função para setar a textura.
function setMaterial(file, nmap = null) {
    let tex = new THREE.TextureLoader().load(file);
    let mat = new THREE.MeshPhongMaterial({
        map: tex,
        normalMap: nmap,
        normalScale: new THREE.Vector3(1.5, 1.5)
    });
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.colorSpace = THREE.SRGBColorSpace;
    return mat;
};

// Adicionando o Normal Map.
let nmap = new THREE.TextureLoader().load("../../assets/textures/NormalMapping/crossNormal.png");
let boxMaterials = [
    setMaterial("../../assets/textures/NormalMapping/crossSide.png"),
    setMaterial("../../assets/textures/NormalMapping/crossSide.png"),
    setMaterial("../../assets/textures/NormalMapping/crossTop.png"),
    setMaterial("../../assets/textures/NormalMapping/crossTop.png"),
    setMaterial("../../assets/textures/NormalMapping/cross.png", nmap),
    setMaterial("../../assets/textures/NormalMapping/cross.png", nmap),
];

// Criando a geometria.
let box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 0.5), boxMaterials);
scene.add(box);

function key() {
    let keyboard = new KeyboardState();
    keyboard.update();

    if(keyboard.pressed("D")) box.rotateY(0.05);
    if(keyboard.pressed("A")) box.rotateY(-0.05);
    if(keyboard.pressed("W")) box.rotateX(-0.05);
    if(keyboard.pressed("S")) box.rotateX(0.05);
};

render();
function render()
{   
    key();
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};