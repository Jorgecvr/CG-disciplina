import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import { initRenderer,
         initCamera,
         initDefaultBasicLight,
         setDefaultMaterial,
         InfoBox,
         onWindowResize,
         createGroundPlaneXZ } from '../../libs/util/util.js';

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let material1 = setDefaultMaterial('lightgreen');
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cube = new THREE.Mesh(cubeGeometry, material1);
// position the cube
cube.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cube);

// create a sphere
let material2 = setDefaultMaterial('lightblue');
let sphereGeometry = new THREE.SphereGeometry( 2, 32, 16 );
let sphere = new THREE.Mesh(sphereGeometry, material2);
sphere.position.set(6.0, 2.0, 0.0);
scene.add(sphere);

// create a cylinder
let material3 = setDefaultMaterial('darkred');
let cylinderGeometry = new THREE.CylinderGeometry( 2.5, 2.5, 6, 32 ); 
let cylinder = new THREE.Mesh(cylinderGeometry, material3);
cylinder.position.set(-6.0, 3.0, 0.0);
scene.add(cylinder);

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}