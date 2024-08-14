import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// To use the keyboard.
let keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Adição da luz ambiente.
let ambientColor = "rgb(80, 80, 80)";
let ambientLight = new THREE.AmbientLight(ambientColor);
ambientLight.visible = false;
scene.add(ambientLight);

// Adição da luz direcional.
const directionalLight = new THREE.DirectionalLight('white', 0.2);
directionalLight.position.set(2, 2, 4);
directionalLight.castShadow = true;
directionalLight.visible = false;
scene.add(directionalLight);

// Adição do spotlight.
let spotLight = new THREE.SpotLight("rgb(255,255,255)", 1.0);
    spotLight.position.set(1.3, 3, 0.0);
    spotLight.angle = THREE.MathUtils.degToRad(45);
    spotLight.castShadow = true;
    spotLight.target.position.set(2.4, 0, 0);
    spotLight.target.updateMatrixWorld();
    spotLight.intensity = 20;
    spotLight.penumbra = 0.6;
scene.add(spotLight);

// Criando os itens da cena.
let retangulo1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), setDefaultMaterial('red'));
retangulo1.position.set(3.5, 0, 0);
retangulo1.castShadow = true;
scene.add(retangulo1);
let retangulo2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), setDefaultMaterial('green'));
retangulo2.position.set(3.5, 0, 1.8);
retangulo2.castShadow = true;
scene.add(retangulo2);
let cilindro1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 32), setDefaultMaterial('yellow'));
cilindro1.position.set(1.7, 0, -1.6);
cilindro1.castShadow = true;
scene.add(cilindro1);
let cilindro2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 32), setDefaultMaterial('purple'));
cilindro2.position.set(1.1, 0, 3.0);
cilindro2.castShadow = true;
scene.add(cilindro2);

// Load default scene
loadLightPostScene(scene);

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
// initDefaultBasicLight(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  let controls = new function() {
    this.ambientLight = false;
    this.spotLight = true;
    this.directionalLight = false;
  
    this.onEnableAmbientLight = function() {
      ambientLight.visible = this.ambientLight;
    };
    this.onEnableSpotLight = function() {
      spotLight.visible = this.spotLight;
    };
    this.onEnableDirectionalLight = function() {
      directionalLight.visible = this.directionalLight;
    }
  };

  let gui = new GUI();
  gui.add(controls, 'ambientLight', true)
    .name("Ambient Light")
    .onChange(function(e) { controls.onEnableAmbientLight() });
  gui.add(controls, 'spotLight', true)
    .name("SpotLight")
    .onChange(function(e) { controls.onEnableSpotLight() });
  gui.add(controls, 'directionalLight', true)
    .name("Directional Light")
    .onChange(function(e) { controls.onEnableDirectionalLight() });
}

function keyboardUpdate()
{
  keyboard.update();
  if(keyboard.down("up"))
  {
    cilindro2.position.set(cilindro2.position.x + 0.1, cilindro2.position.y, cilindro2.position.z);
  }
  if(keyboard.down("down"))
  {
    cilindro2.position.set(cilindro2.position.x - 0.1, cilindro2.position.y, cilindro2.position.z);
  }
  if(keyboard.pressed("right"))
  {
    cilindro2.position.set(cilindro2.position.x, cilindro2.position.y, cilindro2.position.z + 0.1);
  }
  if(keyboard.pressed("left"))
  {
    cilindro2.position.set(cilindro2.position.x, cilindro2.position.y, cilindro2.position.z - 0.1);
  }
  if(keyboard.pressed("pageup"))
  {
    cilindro2.position.set(cilindro2.position.x, cilindro2.position.y + 0.1, cilindro2.position.z);
  }
  if(keyboard.pressed("pagedown"))
  {
    cilindro2.position.set(cilindro2.position.x, cilindro2.position.y - 0.1, cilindro2.position.z);
  }
  if(keyboard.down("space"))
  {
    console.log(cilindro2.position);
  }
}

function render()
{
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}