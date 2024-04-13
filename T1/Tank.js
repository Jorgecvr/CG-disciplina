import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

export function CreateTank(type) {
  // Criando o Tanque

  // Cor do Tanque
  let materialTank;
  if(type === 0) {
    materialTank = setDefaultMaterial('#ab071d');
  }
  else {
    materialTank = setDefaultMaterial('#0000FF');
  }

  // Base do tank
  let geometryTank = new THREE.BoxGeometry( 3, 0.85, 5 );
  let base = new THREE.Mesh( geometryTank, materialTank );

  // Base2
  let materialBase2 = setDefaultMaterial('#c90620');
  let geometryBase2 = new THREE.BoxGeometry( 2, 0.8, 3 );
  let base2 = new THREE.Mesh( geometryBase2, materialBase2 );
  base.add( base2 );
  base2.position.set(0.0, 0.4, 0.25);

  // Criando o Domo
  let materialDomo = setDefaultMaterial('#de0421');
  let geometryDomo = new THREE.SphereGeometry( 1, 32, 16 );
  let domo = new THREE.Mesh( geometryDomo, materialDomo );
  base2.add( domo );
  domo.position.set(0.0, 0.15, 0.0);
  domo.rotateY(THREE.MathUtils.degToRad(-90))

  // Criando o Cano
  let materialCano = setDefaultMaterial('#bec2c2');
  let geometryCano = new THREE.CylinderGeometry( 0.15, 0.2, 3, 32 );
  let cano = new THREE.Mesh( geometryCano, materialCano );
  domo.add( cano );
  cano.rotateZ(THREE.MathUtils.degToRad(80));
  cano.position.set(-1.0, 0.55, 0.0);

  // Criando as Rodas
  let materialRodas = setDefaultMaterial('#260d14');
  for( let i = 0; i < 2; i++ ) {
    for( let j = 0; j < 3; j++ ) {
      let geometryRodas = new THREE.CylinderGeometry( 0.65, 0.65, 0.8, 32 );
      let rodas = new THREE.Mesh( geometryRodas, materialRodas );
      base.add( rodas );
      rodas.rotateZ(THREE.MathUtils.degToRad(90));
      rodas.position.set(1.8*i-(0.90), -0.5, (1.8*j)-1.8);
    }
  }
  return base;
};

export function TankMove(tank, type) {
    var keyboard = new KeyboardState();
    keyboard.update();
    if(type === 0) {
      if( keyboard.pressed("up") )    tank.translateZ( -0.1 );
      if( keyboard.pressed("down") )  tank.translateZ( 0.1 );
  
      let angulo = THREE.MathUtils.degToRad(1);
      if( keyboard.pressed("left") )  tank.rotateY( angulo );
      if( keyboard.pressed("right") ) tank.rotateY( -angulo );
    }
    else {
      if( keyboard.pressed("W") )    tank.translateZ( -0.1 );
      if( keyboard.pressed("S") )  tank.translateZ( 0.1 );
  
      let angulo = THREE.MathUtils.degToRad(1);
      if( keyboard.pressed("A") )  tank.rotateY( angulo );
      if( keyboard.pressed("D") ) tank.rotateY( -angulo );
    }

};