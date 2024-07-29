import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js';
// Importação do Loader para o utilizar o modelo do tank.
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

// Criação da classe Tank para montar e exportar o tanque.
export class Tank {
    // Construtor da classe.
    constructor(type) {
        this.width = 1.2;
        this.height = 1.3
        this.depth = 1.3;
        this.mesh = this.create(type);
    };

    // Método que importa o modelo e cria o tanque.
    create(type) {
        let loader = new GLTFLoader();
        let mesh = new THREE.Object3D();
        loader.load('assets/tankModel.glb', function(glb) {
            let obj = glb.scene;
            obj.traverse((child) => {
                child.material = new THREE.MeshPhongMaterial({
                    color: type === 1 ? 'rgb(205, 50, 50)' : 'rgb(50, 50, 205)',
                    shininess: "200",
                    specular: "rgb(255, 255, 255)"
                });
                if(child.userData.name == "Tank_Tower") mesh.add(child);
                console.log(child);
            });
            obj.scale.set(1.2, 1.3, 1.3);
            mesh.add(glb.scene);
        });
        return mesh;
    };

    // Método que controla a movimentação do tanque.
    move(type) {
        let keyboard = new KeyboardState();
        keyboard.update();
        let angle = THREE.MathUtils.degToRad(1);
        if(type == 1) {
            if(keyboard.pressed("W")) this.mesh.translateZ(0.25);
            if(keyboard.pressed("S")) this.mesh.translateZ(-0.25);

            if(keyboard.pressed("A")) this.mesh.rotateY(angle);
            if(keyboard.pressed("D")) this.mesh.rotateY(-angle);
        } else {
            if(keyboard.pressed("up")) this.mesh.translateZ(0.25);
            if(keyboard.pressed("down")) this.mesh.translateZ(-0.25);

            let angle = THREE.MathUtils.degToRad(1);
            if(keyboard.pressed("left")) this.mesh.rotateY(angle);
            if(keyboard.pressed("right")) this.mesh.rotateY(-angle);
        }
    };
};