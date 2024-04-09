import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

export function CreateTank(size) {
// Criando Tanque
let materialTanque = setDefaultMaterial('#ab071d'); 
const geometryRetangulo = new THREE.BoxGeometry( 5, 0.85, 3 ); 
const RetanguloBase = new THREE.Mesh( geometryRetangulo, materialTanque ); 
RetanguloBase.position.set(-6.0, 1.0, 2.0);

// Criando base 2
let materialBase2 = setDefaultMaterial('#c90620'); 
const geometryRetangulo2 = new THREE.BoxGeometry( 3, 0.8, 2 ); 
const RetanguloBase2 = new THREE.Mesh( geometryRetangulo2, materialBase2 ); 
RetanguloBase.add( RetanguloBase2 );
RetanguloBase2.position.set(0.25, 0.4, 0.0);

// Criando Domo
let materialDomo = setDefaultMaterial('#de0421'); 
const geometryDomo = new THREE.SphereGeometry( 1, 32, 16 ); 
const Domo = new THREE.Mesh( geometryDomo, materialDomo );
RetanguloBase2.add( Domo );
Domo.position.set(0.0, 0.15, 0.0);

// Criando Cano
let materialCano = setDefaultMaterial('#bec2c2'); 
const geometryCano = new THREE.CylinderGeometry( 0.15, 0.2, 3, 32 ); 
const Cano = new THREE.Mesh( geometryCano, materialCano ); 
Domo.add( Cano );
Cano.rotateZ(THREE.MathUtils.degToRad(90));
Cano.position.set(-1.0, 0.55, 0.0);

// Criando Rodas 
let materialRodas = setDefaultMaterial('#260d14');
for( let i = 0; i<2; i++){
  for(let j = 0; j<3; j++){
    const geometryRodas = new THREE.CylinderGeometry( 0.65, 0.65, 0.8, 32 ); 
    const Rodas = new THREE.Mesh( geometryRodas, materialRodas ); 
    RetanguloBase.add( Rodas );
    Rodas.rotateX(THREE.MathUtils.degToRad(90));
    Rodas.position.set(1.8*j -1.9, -0.5, 2.4*i -1.188);
  }
}
return RetanguloBase;
};

export function TankMove(tank) {
    var keyboard = new KeyboardState();
    keyboard.update();
    if( keyboard.pressed("up") )    tank.translateX( -0.1 );
    if( keyboard.pressed("down") )  tank.translateX( 0.1 );

    let angulo = THREE.MathUtils.degToRad(1);
    if( keyboard.pressed("left") )  tank.rotateY( angulo );
    if( keyboard.pressed("right") ) tank.rotateY( -angulo );
};