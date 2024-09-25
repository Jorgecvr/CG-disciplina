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

        // Atributo para a posição da câmera.
        this.camPosition = this.camera.position.clone();
    };

    init(player_position) {
        this.camera.position.set(player_position.x, 60, 70);
        this.camera.lookAt(player_position.x, 0, 25);
    };

    swapOrbitControls() {
        this.orbitControls.enabled = !this.orbitControls.enabled;

        if(this.orbitControls.enabled) {
            this.camPosition = this.camera.position.clone();
        } else {
            this.camera.position.copy(this.camPosition);
        }
    };

    handleUpdate(event) {
        if(!this.orbitControls.enabled) {
            // Velocidade do zoom.
            const zoomSpeed = 0.01;

            // Ajusta o campo de visão com base no scroll.
            this.camera.fov += event.deltaY * zoomSpeed;

            // Define limites mínimo e máximo para o zoom.
            this.camera.fov = THREE.MathUtils.clamp(this.camera.fov, 20, 70);

            // Atualiza a projeção da câmera.
            this.camera.updateProjectionMatrix();  

        }
    };

    update(player_position) {
        // Câmera atualiza apenas quando o orbitControls está desligado.
        if(!this.orbitControls.enabled) {
            this.camera.position.x = player_position.x;
            this.camera.lookAt(player_position.x, 0, 25);
        }
    };
};