import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Classe Tank para ser utilizada na App
export class Tank {
  // Construtor da classe Tank
  constructor(type) {
    this.object = this.createTank(type);

    this.life = 10;
    this.speed = -0.2;
    this.speedCollsion = -0.15;

    this.width = 3;
    this.height = 0.85;
    this.depth = 5;

    this.direction = new THREE.Vector3(0, 0, 0).normalize();
  }

  getLife(){
    return this.life;
  }

  setLife(life){
    this.life = life;
  }
  // Funções de get e set para a direção do tanque
  getDirection() {
    return this.direction.normalize().clone();
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }

  // Funções de set para velocidade
  setSpeedCollision(speed) {
    this.speedCollsion = speed;
  }

  moveTank(type) {
    var keyboard = new KeyboardState();
    keyboard.update();

    if(type == 0) {
      if(keyboard.pressed("W"))          this.object.translateZ(this.speed);
      if(keyboard.pressed("S"))        this.object.translateZ(-this.speed);

      let angulo = THREE.MathUtils.degToRad(1);
      if(keyboard.pressed("A")) {
        this.object.rotateY(angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }      
      if(keyboard.pressed("D")) {
        this.object.rotateY(-angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }
    } 
    else {
      if(keyboard.pressed("up"))         this.object.translateZ(this.speed); 
      if(keyboard.pressed("down"))         this.object.translateZ(-this.speed);  
  
      let angulo = THREE.MathUtils.degToRad(1);
      if(keyboard.pressed("left")) {
        this.object.rotateY(angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }      
      if(keyboard.pressed("right")) {
        this.object.rotateY(-angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }
    }
  }

  moveTankWithCollision(type, direction) {
    var keyboard = new KeyboardState();
    keyboard.update();

    if(type == 0) {
      if(keyboard.pressed("W")) {
        this.object.translateOnAxis(direction, this.speedCollsion);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }
      if(keyboard.pressed("S")) {
        this.object.translateOnAxis(direction, this.speedCollsion);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }

      let angulo = THREE.MathUtils.degToRad(1);
      if(keyboard.pressed("A")) {
        this.object.rotateY(angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }      
      if(keyboard.pressed("D")) {
        this.object.rotateY(-angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }
    } 
    else {
      if(keyboard.pressed("up")) {
        this.object.translateOnAxis(direction, this.speedCollsion);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }
      if(keyboard.pressed("down")) {
        this.object.translateOnAxis(direction, this.speedCollsion);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3()));
      }  
  
      let angulo = THREE.MathUtils.degToRad(1);
      if(keyboard.pressed("left")) {
        this.object.rotateY(angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3().normalize()));
      }      
      if(keyboard.pressed("right")) {
        this.object.rotateY(-angulo);
        this.setDirection(this.object.getWorldDirection(new THREE.Vector3().normalize()));
      }
    }
  }

  // Função que cria o objeto tanque
  createTank(type) {
    // Base do tanque / type0 = vermelho / type1 = azul
    let tankBase;
    let tankBase_two;
    let tower;
    if(type == 0) {
      tankBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.85, 5), setDefaultMaterial('#ab071d'));
      tankBase_two = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 3), setDefaultMaterial('#c90620'));
      tower = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), setDefaultMaterial('#de0421'));
    }
    else {
      tankBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.85, 5), setDefaultMaterial('#100dbf'));
      tankBase_two = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 3), setDefaultMaterial('#0d22bf'));
      tower = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), setDefaultMaterial('#0d37bf'));
    }

    // Base 2
    tankBase.add(tankBase_two);
    tankBase_two.position.set(0.0, 0.4, 0.25);

    // Criando a torre
    tankBase_two.add(tower);
    tower.position.set(0.0, 0.15, 0.0);
    tower.rotateY(THREE.MathUtils.degToRad(-90));

    // Criando o canhão
    let cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 3, 32));
    tower.add(cannon);
    cannon.rotateZ(THREE.MathUtils.degToRad(90));
    cannon.position.set(-1.0, 0.55, 0.0);

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