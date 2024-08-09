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

        const movementSpeed = 0.25;
        const rotationSpeed = 0.025;
        const forwardVector = new THREE.Vector3(0, 0, 1);
        const backwardVector = new THREE.Vector3(0, 0, -1);

        if(type == 1) {
            if(keyboard.pressed("W")) this.mesh.position.add(forwardVector.clone().applyQuaternion(this.mesh.quaternion).multiplyScalar(movementSpeed));
            if(keyboard.pressed("S")) this.mesh.position.add(backwardVector.clone().applyQuaternion(this.mesh.quaternion).multiplyScalar(movementSpeed));

            if(keyboard.pressed("A")) this.mesh.rotation.y += rotationSpeed;
            if(keyboard.pressed("D")) this.mesh.rotation.y -= rotationSpeed;
        } else {
            if(keyboard.pressed("up")) this.mesh.translateZ(0.25);
            if(keyboard.pressed("down")) this.mesh.translateZ(-0.25);

            if(keyboard.pressed("left")) this.mesh.rotateY(rotationSpeed);
            if(keyboard.pressed("right")) this.mesh.rotateY(-rotationSpeed);
        }
        if(keyboard.down("space")) console.log(this.mesh.getWorldPosition(new THREE.Vector3()));

        // Restrições de movimento em relação a colisão.
        let z = this.mesh.getWorldPosition(new THREE.Vector3()).z;
        let x = this.mesh.getWorldPosition(new THREE.Vector3()).x;

        // Limites do lado esquerdo do nível.
        const roomLeftLimits = {
            minX: (z >= 15.5 && z <= 30.5) ? 5 : 36,
            maxX: 59,
            minZ: 4.5,
            maxZ: 39,
        }; 
        // Limites do lado direito do nível.
        const roomRightLimits = {
            minX: 5,
            maxX: (z >= 15.5 && z <= 30.5) ? 59 : 27,
            minZ: 4.5,
            maxZ: 39,
        };
        // Limites do meio do nível.
        const midRightLimits = {
            
        };

        // Verifica os limites do nível para o lado esquerdo (de quem vê).
        // Utiliza-se o método clamp para restringir o valor da posição em um intervalo específico.
        if(x >= 34) {
            this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, roomLeftLimits.minX, roomLeftLimits.maxX);
            this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, roomLeftLimits.minZ, roomLeftLimits.maxZ);
        }
        else if(x < 28) {
            this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, roomRightLimits.minX, roomRightLimits.maxX);
            this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, roomRightLimits.minZ, roomRightLimits.maxZ);
        }
    };
};