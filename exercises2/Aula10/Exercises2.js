import * as THREE from  'three';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import {initRenderer,
        onWindowResize} from "../../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(112,128,144)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(0, 10, 25);
    camera.up.set( 0, 1, 0 );

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

let ambientLight = new THREE.AmbientLight("rgb(60, 60, 60)");
ambientLight.castShadow = false;
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight("rgb(255, 255, 255)", 3);
directionalLight.position.set(-5, 7, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Function to set a texture.
function setMaterial(file, repeatU = 1, repeatV = 1, offsetx = 0, offsety = 0, color = 'rgb(255,255,255)',){
    let loader = new THREE.TextureLoader();
    let mat = new THREE.MeshStandardMaterial({ map: loader.load(file), color:color});
       mat.map.colorSpace = THREE.SRGBColorSpace;
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
    mat.map.repeat.set(repeatU,repeatV);
    mat.map.offset.x = offsetx;
    mat.map.offset.y = offsety;
    return mat;
};

let groundMaterials = [
    setMaterial("../../assets/textures/floorWood.jpg"),
    setMaterial("../../assets/textures/floorWood.jpg"),
    setMaterial("../../assets/textures/floorWood.jpg"),
    setMaterial("../../assets/textures/floorWood.jpg"),
    setMaterial("../../assets/textures/floorWood.jpg"),
    setMaterial("../../assets/textures/floorWood.jpg"),
];
let groundPlane = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 20), groundMaterials);
groundPlane.receiveShadow = true;
scene.add(groundPlane);

let colormap = new THREE.TextureLoader().load("../../assets/textures/displacement/rockWall.jpg");
    colormap.colorSpace = THREE.SRGBColorSpace;
let normalmap = new THREE.TextureLoader().load("../../assets/textures/displacement/rockWall_Normal.jpg");
let dismap = new THREE.TextureLoader().load("../../assets/textures/displacement/rockWall_Height.jpg");

let mat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: "white",
    map: colormap,
    normalMap: normalmap,
    displacementMap: dismap,
    displacementScale: 0.15
});
mat.normalScale.set(0.7, 0.7);
mat.map.wrapS = mat.displacementMap.wrapS = mat.normalMap.wrapS = THREE.RepeatWrapping;
mat.map.wrapT = mat.displacementMap.wrapT = mat.normalMap.wrapT = THREE.RepeatWrapping;	
mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
mat.map.repeat.set(4, 3);
mat.displacementMap.repeat.set(4, 3);
mat.normalMap.repeat.set(4, 3);

let sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), mat);
sphere.castShadow = true;
sphere.position.set(0, 3, 0);
scene.add(sphere);

render();
function render()
{
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};