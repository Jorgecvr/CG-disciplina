import * as THREE from  'three';
import Stats from '../../build/jsm/libs/stats.module.js';
import GUI from '../../libs/util/dat.gui.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initDefaultBasicLight,
        createGroundPlane,
        onWindowResize, 
        lightFollowingCamera} from "../../libs/util/util.js";

import {ConvexGeometry} from '../../build/jsm/geometries/ConvexGeometry.js';
import {GLTFLoader} from '../../build/jsm/loaders/GLTFLoader.js';
import { CSG } from '../../libs/other/CSGMesh.js';

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

var groundPlane = createGroundPlane(40, 35); // width and height
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Criando o poliedro convexo.
var vertices = [
    new THREE.Vector3(0.0, 0.0, 0.0),   // p0: base 1 frente
    new THREE.Vector3(0.0, 0.0, -8.0),  // p1: base 1 tras
    new THREE.Vector3(18.0, 0.0, 0.0),  // p2: base 2 frente
    new THREE.Vector3(18.0, 0.0, -8.0), // p3: base 2 tras
    new THREE.Vector3(0.0, 8.0, 0.0),   // p4: cima 1 frente
    new THREE.Vector3(0.0, 8.0, -8.0),  // p5: cima 1 tras
    new THREE.Vector3(8.0, 8.0, 0.0),   // p6: cima 2 frente
    new THREE.Vector3(8.0, 8.0, -8.0),  // p7: cima 2 tras
];
var pointCloud = new THREE.Object3D();
vertices.forEach((v) => {
    var spGeom = new THREE.SphereGeometry(0.2);
    var spMesh = new THREE.Mesh(spGeom, new THREE.MeshLambertMaterial({color: "rgb(255, 255, 0)"}));
    spMesh.position.set(v.x, v.y, v.z);
    pointCloud.add(spMesh);
})
var material = new THREE.MeshLambertMaterial({color:"rgb(100, 255, 100)"});
var convexGeometry = new ConvexGeometry(vertices);
var convexObject = new THREE.Mesh(convexGeometry, material);
convexObject.castShadow = true;
convexObject.translateX(-20);
convexObject.translateZ(10);
pointCloud.translateX(-20);
pointCloud.translateZ(10);
scene.add(convexObject);
scene.add(pointCloud);

// Criando o tank com objeto externo.
var loader = new GLTFLoader();
loader.load('../assets/uploads_files_2449357_toon_tank.glb', function(glb) {
    var obj = glb.scene;
    obj.traverse( function (child) {
        if(child.isMesh) child.castShadow = true;
    });
    scene.add(obj);
});

// Criando a caneca com CSG.
let auxMat = new THREE.Matrix4();

let material1 = new THREE.MeshPhongMaterial({
    color: 'rgb(68, 255, 250)',
    shininess: "200",
    specular: "rgb(255, 255, 255)"
});

let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), material1);
let cylinderBigMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 5.5, 32), material1);
let cylinderSmallMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 5, 32), material1);
let torusMesh = new THREE.Mesh(new THREE.TorusGeometry(2, 0.4, 20, 20), material1);

let csgObject, cubeCSG, cylinderBigCSG, cylinderSmallCSG, torusCSG;

// Object1: Torus SUBTRACT Cube
torusMesh.position.set(1, 10, 0);
// scene.add(torusMesh);
cubeMesh.position.set(3, 10, 0);
// scene.add(cubeMesh);

torusMesh.matrixAutoUpdate = false;
torusMesh.updateMatrix();
cubeMesh.matrixAutoUpdate = false;
cubeMesh.updateMatrix();
torusCSG = CSG.fromMesh(torusMesh);
cubeCSG = CSG.fromMesh(cubeMesh);
csgObject = torusCSG.subtract(cubeCSG);
let mesh1 = CSG.toMesh(csgObject, auxMat);
mesh1.material = material1;
mesh1.position.set(1, 0.1, 0);
// scene.add(mesh1);

// Object2: CylinderBig SUBTRACT CylinderSmall
cylinderBigMesh.position.set(4, 10, 0);
// scene.add(cylinderBigMesh);
cylinderSmallMesh.position.set(4, 10.3, 0);
// scene.add(cylinderSmallMesh);

cylinderBigMesh.matrixAutoUpdate = false;
cylinderBigMesh.updateMatrix();
cylinderSmallMesh.matrixAutoUpdate = false;
cylinderSmallMesh.updateMatrix();
cylinderBigCSG = CSG.fromMesh(cylinderBigMesh);
cylinderSmallCSG = CSG.fromMesh(cylinderSmallMesh);
csgObject = cylinderBigCSG.subtract(cylinderSmallCSG);
let mesh2 = CSG.toMesh(csgObject, auxMat);
mesh2.material = material1;
mesh2.position.set(-0.4, 0, 0);
// scene.add(mesh2);

// Object3: mesh1 UNION mesh2
let mesh1CSG, mesh2CSG;
mesh1.matrixAutoUpdate = false;
mesh1.updateMatrix();
mesh2.matrixAutoUpdate = false;
mesh2.updateMatrix();
mesh1CSG = CSG.fromMesh(mesh1);
mesh2CSG = CSG.fromMesh(mesh2);
csgObject = mesh1CSG.union(mesh2CSG);
let caneca = CSG.toMesh(csgObject, auxMat);
caneca.material = material1;
caneca.position.set(5, -7.25, 0);
scene.add(caneca);

render();
function render()
{
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};