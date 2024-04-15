import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Classe Tank para ser utilizada na App
export class Tank {
  // Construtor da classe Tank
  constructor(type) {
    this.object = this.createTank(type);
    this.vida = 10;
    this.speed = 0.12;
  }

  // Função que cria o objeto tanque
  createTank(type) {
    // Base do tanque / type0 = vermelho / type1 = azul
    let tankBase;
    if(type == 0) {
      tankBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.85, 5), setDefaultMaterial('#ab071d'));
    }
    else {
      tankBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.85, 5), setDefaultMaterial('#0000FF'));
    }

    // Base 2
    let tankBase_two = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 3), setDefaultMaterial('#c90620'));
    tankBase.add(tankBase_two);
    tankBase_two.position.set(0.0, 0.4, 0.25);

    // Criando a torre
    let tower = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), setDefaultMaterial('#de0421'));
    tankBase_two.add(tower);
    tower.position.set(0.0, 0.15, 0.0);
    tower.rotateY(THREE.MathUtils.degToRad(-90));

    // Criando o canhão
    let cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 3, 32));
    tower.add(cannon);
    cannon.rotateZ(THREE.MathUtils.degToRad(80));
    cannon.position.set(-1.0, 0.55, -0.1);

    // Criando as rodas
    for(let i = 0; i < 2; i++) {
      for(let j = 0; j < 3; j++) {
        let wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 32), setDefaultMaterial('#260d14'));
        tankBase.add(wheel);
        wheel.rotateZ(THREE.MathUtils.degToRad(90));
        wheel.position.set(1.8*i-(0.90), -0.5, (1.8*j)-1.8);
      }
    }
    return tankBase;
  }
}

export function moveTank(type, tankBase, speed) {
  var keyboard = new KeyboardState();
  keyboard.update();
  if(type == 0) {
    if( keyboard.pressed("up") )      tankBase.translateZ( -speed );
    if( keyboard.pressed("down") )    tankBase.translateZ(  speed );

    let angulo = THREE.MathUtils.degToRad(1);
    if( keyboard.pressed("left") )    tankBase.rotateY(  angulo );
    if( keyboard.pressed("right") )   tankBase.rotateY( -angulo );
  } else {
    if( keyboard.pressed("W") )       tankBase.translateZ( -speed );
    if( keyboard.pressed("S") )       tankBase.translateZ(  speed );

    let angulo = THREE.MathUtils.degToRad(1);
    if( keyboard.pressed("A") )       tankBase.rotateY(  angulo );
    if( keyboard.pressed("D") )       tankBase.rotateY( -angulo );
  }
}