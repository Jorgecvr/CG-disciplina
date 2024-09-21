import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';

export class Camera {
    constructor(renderer) {
        // Iniciando a câmera perspectiva.
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
            this.camera.zoom = 1;
            this.camera.updateProjectionMatrix();

        // Iniciando e configurando o OrbitControls.
        this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
            this.orbitControls.enabled = false;
            this.orbitControls.enableDamping = true; // Movimento mais suave da câmera.
            this.orbitControls.dampingFactor = 0.1;

        // Iniciando o cameraHolder.
        this.holder = new THREE.Object3D();

        // Atributo para a posição da câmera.
        this.camPosition = this.camera.position.clone();

        // Salva a distância inicial entre o player e a câmera
        this.lastDistance;
    };

    init(player_position) {
        this.camera.position.set(10, 60, 70);
        // this.holder.position.set(0, -200, 0);
        this.camera.lookAt(player_position.x, 0, 25);

        this.lastDistance = this.camera.position.z - player_position.z;
    };

    swapOrbitControls() {
        this.orbitControls.enabled = !this.orbitControls.enabled;

        if(this.orbitControls.enabled) {
            this.camPosition = this.camera.position.clone();
        } else {
            this.camera.position.copy(this.camPosition);
        }
    };

    update(player_position) {
        this.holder.position.x = player_position.x - 10;
        // Câmera atualiza apenas quando o orbitControls está desligado.
        if(!this.orbitControls.enabled) {
    
            let dist = this.camera.position.z - player_position.z;
            this.camera.translateZ((dist - this.lastDistance) / 2.5);
            this.lastDistance = dist;

            this.camera.lookAt(player_position.x, 0, 25);
        }
    };
};