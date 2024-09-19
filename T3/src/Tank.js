import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js';

// Importação do Loader para o utilizar o modelo do tank.
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

// Criação da classe Tank para montar e exportar o tanque.
export class Tank {
    constructor(type, levelType) {
        this.object = this.create(type, levelType);

        // Salva a última direção do tanque (0 para frente e 1 para ré);
        this.lastDirection = 0;
    };

    // Método que importa o modelo e cria o tanque.
    create(type, levelType) {
        let loader = new GLTFLoader();
        let object = new THREE.Object3D();

        loader.load('assets/objects/tankModel.glb', function(glb) {
            let obj = glb.scene;

            obj.traverse((child) => {
                if(levelType === 1) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: type === 1 ? 'rgb(205, 50, 50)' : 'rgb(50, 50, 205)',
                        shininess: "200",
                        specular: "rgb(255, 255, 255)"
                    });
                } 
                child.castShadow = true;
                // child.receiveShadow = true;
            });
            obj.scale.set(1.3, 1.3, 1.3);
            object.add(obj);
        });
        return object;
    };

    // Método que controla a movimentação do tanque.
    movePlayer(levelType) {
        let keyboard = new KeyboardState();
        keyboard.update();

        const movementSpeed = 0.25;
        const rotationSpeed = 0.025;

        if(levelType === 1) {
            if(keyboard.pressed("W")) {
                this.object.translateZ(movementSpeed);
                if(this.lastDirection != 0) this.lastDirection = 0;
            } 
            if(keyboard.pressed("S")) {
                this.object.translateZ(-movementSpeed);
                if(this.lastDirection != 1) this.lastDirection = 1;
            }
            if(keyboard.pressed("A")) this.object.rotateY(rotationSpeed);
            if(keyboard.pressed("D")) this.object.rotateY(-rotationSpeed);
        
            // if(keyboard.pressed("up")) {
            //     this.object.translateZ(movementSpeed);
            //     if(this.lastDirection != 0) this.lastDirection = 0;
            // } 
            // if(keyboard.pressed("down")) {
            //     this.object.translateZ(-movementSpeed);
            //     if(this.lastDirection != 1) this.lastDirection = 1;
            // } 
            // if(keyboard.pressed("left"))  this.object.rotateY(rotationSpeed);
            // if(keyboard.pressed("right")) this.object.rotateY(-rotationSpeed);
        }
    };
};