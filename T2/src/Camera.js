import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../../libs/util/KeyboardState.js';

export class Camera {
    // Construtor da classe.
    constructor(renderer) {
        // Iniciando a câmera perspectiva.
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
            this.camera.zoom = 1;
            this.camera.updateProjectionMatrix();

        // Iniciando e configurando o OrbitControls.
        this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
            this.orbitControls.enabled = false;
            this.orbitControls.enableDamping = true; // Movimento mais suave da câmera.
            this.orbitControls.dampingFactor = 0.1;

        // Iniciando o cameraHolder.
        this.holder = new THREE.Object3D();

        // Atributos para a posição da câmera e do holder.
        this.camPosition = this.camera.position.clone();
        this.camLookAt = new THREE.Vector3();
            this.camera.getWorldDirection(this.camLookAt);
        this.holderPosition = this.holder.position.clone();

        // Variáveis para controlar o movimento da câmera.
        this.initMidX;
        this.initMidZ;
        this.lastDistance;
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
        this.camPosition = new THREE.Vector3(position.x, position.y, position.z);
    };
    setHolderPosition(position) {
        this.holderPosition = new THREE.Vector3(position.x, position.y, position.z);
    };

    // Método para cálcular os valores iniciais de distância e posição média.
    initCamera(levelType = 1, position_tank1, position_tank2, position_tank3 = new THREE.Vector3(0, 0, 0)) {
        if(levelType == 1) {
            // Inicia a posição e o lookAt da câmera com base na posição média.
            const midX = (position_tank1.x + position_tank2.x) / 2;
            const midZ = (position_tank1.z + position_tank2.z) / 2;
            this.camera.position.set(midX, 40, 70);
            this.camera.lookAt(midX, 5, midZ);
            this.initMidX = midX;
            this.initMidZ = midZ;

            // Salva a distância inicial entre os dois tanques.
            this.lastDistance = Math.sqrt(
                (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
                (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
            );
        } else if(levelType == 2) {
            const midX = (position_tank1.x + position_tank2.x + position_tank3.x) / 3;
            const midZ = (position_tank1.z + position_tank2.z + position_tank3.z) / 3;
            this.camera.position.set(midX, 40, 70);
            this.camera.lookAt(midX, -5, midZ);
            this.initMidX = midX;
            this.initMidZ = midZ;

            // A distância será calculada utilizando a fórmula da distância euclidiana.
            const dist1 = Math.sqrt(
                (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
                (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
            );
            const dist2 = Math.sqrt(
                (position_tank1.x - position_tank3.x)*(position_tank1.x - position_tank3.x) +
                (position_tank1.z - position_tank3.z)*(position_tank1.z - position_tank3.z)
            );
            const dist3 = Math.sqrt(
                (position_tank2.x - position_tank3.x)*(position_tank2.x - position_tank3.x) +
                (position_tank2.z - position_tank3.z)*(position_tank2.z - position_tank3.z)
            );
            this.lastDistance = dist1 + dist2 + dist3;
        } else {
            // Inicia a câmera quando um dos tanques morre.
            // Inicia a posição e o lookAt da câmera com base na posição média.
            const midX = (position_tank1.x + position_tank2.x) / 2;
            const midZ = (position_tank1.z + position_tank2.z) / 2;
            this.camera.position.set(midX, 40, 70);
            this.camera.lookAt(midX, -10, midZ);
            this.initMidX = midX;
            this.initMidZ = midZ;

            // Salva a distância inicial entre os dois tanques.
            this.lastDistance = Math.sqrt(
                (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
                (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
            );
        }
    };

    // Método para alterar o OrbitControls.
    swapOrbitControls() {
        this.orbitControls.enabled = !this.orbitControls.enabled;
        if(this.orbitControls.enabled) {
            this.setCamPosition(this.camera.position.clone());
            this.camLookAt = new THREE.Vector3();
                this.camera.getWorldDirection(this.camLookAt);
            this.setHolderPosition(this.holder.position.clone());
        } else {
            this.camera.position.copy(this.camPosition);
            this.camera.lookAt(this.camera.position.clone().add(this.camLookAt));
            this.holder.position.copy(this.holderPosition);
        }
    };

    // Método para atualizar a câmera no nível 1.
    update1(position_tank1, position_tank2) {
        // Calculando a posição média entre os tanques e a distância entre eles.
        const midX = (position_tank1.x + position_tank2.x) / 2;
        const midZ = (position_tank1.z + position_tank2.z) / 2;
        const dist = Math.sqrt(
            (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
            (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
        );

        // Câmera atualiza apenas quando o orbitControls está desligado.
        if(!this.orbitControls.enabled) {

            // Atualize a posição do holder com base na posição média.
            this.holder.position.x = midX - this.initMidX;
            this.holder.position.z = midZ - this.initMidZ;

            // Aproxima e afasta a câmera com base na distância entre os tanques.
            const factor = 2;
            this.camera.translateZ((dist - this.lastDistance) / factor);

            // Mantém o lookAt da câmera apontando para a posição média.
            this.setLookAt(new THREE.Vector3(midX, 5, midZ));

            // Atualiza as variáveis de controle.
            this.lastDistance = dist;
        }
    };

    // Método para atualizar a câmera no nível 2.
    update2(position_tank1, position_tank2, position_tank3) {
        // Calcula a posição média e a distância entre os três tanques.
        const midX = (position_tank1.x + position_tank2.x + position_tank3.x) / 3;
        const midZ = (position_tank1.z + position_tank2.z + position_tank3.z) / 3;
        // A distância será calculada utilizando a fórmula da distância euclidiana.
        const dist1 = Math.sqrt(
            (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
            (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
        );
        const dist2 = Math.sqrt(
            (position_tank1.x - position_tank3.x)*(position_tank1.x - position_tank3.x) +
            (position_tank1.z - position_tank3.z)*(position_tank1.z - position_tank3.z)
        );
        const dist3 = Math.sqrt(
            (position_tank2.x - position_tank3.x)*(position_tank2.x - position_tank3.x) +
            (position_tank2.z - position_tank3.z)*(position_tank2.z - position_tank3.z)
        );
        const dist = dist1 + dist2 + dist3;

        // Câmera atualiza apenas quando o orbitControls está desligado.
        if(!this.orbitControls.enabled) {

            // Atualize a posição do holder com base na posição média.
            this.holder.position.x = midX - this.initMidX;
            this.holder.position.z = midZ - this.initMidZ;

            // Aproxima e afasta a câmera com base na distância entre os tanques.
            const factor = 4;
            this.camera.translateZ((dist - this.lastDistance) / factor);

            // Mantém o lookAt da câmera apontando para a posição média.
            this.setLookAt(new THREE.Vector3(midX, -5, midZ));

            // Atualiza as variáveis de controle.
            this.lastDistance = dist;
        }
    };

    // Método para atualizar a câmera no nivel 2 quando tanque morre.
    update3(position_tank1, position_tank2) {
        // Calculando a posição média entre os tanques e a distância entre eles.
        const midX = (position_tank1.x + position_tank2.x) / 2;
        const midZ = (position_tank1.z + position_tank2.z) / 2;
        const dist = Math.sqrt(
            (position_tank1.x - position_tank2.x)*(position_tank1.x - position_tank2.x) +
            (position_tank1.z - position_tank2.z)*(position_tank1.z - position_tank2.z)
        );

        // Câmera atualiza apenas quando o orbitControls está desligado.
        if(!this.orbitControls.enabled) {

            // Atualize a posição do holder com base na posição média.
            this.holder.position.x = midX - this.initMidX;
            this.holder.position.z = midZ - this.initMidZ;

            // Aproxima e afasta a câmera com base na distância entre os tanques.
            const factor = 1.5;
            this.camera.translateZ((dist - this.lastDistance) / factor);

            // Mantém o lookAt da câmera apontando para a posição média.
            this.setLookAt(new THREE.Vector3(midX, -10, midZ));

            // Atualiza as variáveis de controle.
            this.lastDistance = dist;
        }
    };
};