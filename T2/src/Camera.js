import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../../libs/util/KeyboardState.js';

export class Camera {
    // Construtor da classe.
    constructor(position_tank1, position_tank2, renderer) {
        // Iniciando a câmera perspectiva.
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

        // Iniciando o cameraHolder.
        this.holder = new THREE.Object3D();
            this.holder.add(this.camera);

        // Atributos para a posição da câmera e do holder.
        this.camPosition;
        this.holderPosition;

        // Iniciando e configurando o OrbitControls.
        this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
            this.orbitControls.enabled = false;

        // Últimas distância e posições entre os dois tanques.
        this.lastDist = Math.sqrt(
            (position_tank2.x - position_tank1.x)*(position_tank2.x - position_tank1.x) + 
            (position_tank2.z - position_tank1.z)*(position_tank2.z - position_tank1.z)
        );
        this.lastPositionX = (position_tank1.x + position_tank2.x) / 2;
        this.lastPositionZ = (position_tank1.z + position_tank2.z) / 2;
    };

    // Métodos para setar as propriedades da câmera.
    setPosition(position) {
        this.camera.position.copy(position);
    }
    setUpPosition(upPosition) {
        this.camera.up.copy(upPosition);
    };
    setLookAt(lookAt) {
        this.camera.lookAt(lookAt);
    };

    // Métodos para setar os atributos da câmera e holder.
    setCamPosition(position) {
        this.camPosition = new THREE.Vector3().copy(position);
    };

    // Método para alterar o OrbitControls.
    swapOrbitControls() {
        this.orbitControls.enabled = !this.orbitControls.enabled;
    };

    // Método para atualizar a câmera.
    update(position_tank1, position_tank2) {
        let keyboard = new KeyboardState();
        keyboard.update();
        if(keyboard.down("O")) {
            // Atualização do OrbitControls.
            this.swapOrbitControls();
            if(this.orbitControls.enabled) {
                // Salva as posições da camera e retira a câmera do holder para evitar vibrações.
                this.setCamPosition(this.camera.position.clone());
                this.holder.remove(this.camera);
            }
            else {
                this.camera.position.copy(this.camPosition);
                this.holder.add(this.camera);
            }
        }
        if(keyboard.down("space")) {
            console.log(position_tank1);
        }

        // Câmera atualiza apenas quando orbitControls está desligado.
        if(!this.orbitControls.enabled) {
            // Calculando a posição média entre os tanques e a distância entre eles.
            let midX = (position_tank1.x + position_tank2.x) / 2;
            let midZ = (position_tank1.z + position_tank2.z) / 2;
            let dist =  Math.sqrt(
                (position_tank2.x - position_tank1.x)*(position_tank2.x - position_tank1.x) + 
                (position_tank2.z - position_tank1.z)*(position_tank2.z - position_tank1.z)
            );
            if(midX != this.lastPositionX) {
                this.holder.translateX((midX - this.lastPositionX));
                this.lastPositionX = midX;
            }
            if(midZ != this.lastPositionZ) {
                this.holder.translateZ((midZ - this.lastPositionZ));
                this.lastPositionZ = midZ;
            }
            if(dist != this.lastDist) {
                this.camera.translateZ((dist - this.lastDist)/1.6);
                this.lastDist = dist;
            }
            this.setLookAt(new THREE.Vector3(midX, 5, midZ));
        }
    };
};