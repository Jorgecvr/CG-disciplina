import * as THREE from 'three';

export class Camera {
    // Construtor da classe.
    constructor(position_tank1, position_tank2) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200); // Iniciando a câmera.
        this.lastDist = Math.sqrt(
            (position_tank2.x - position_tank1.x)*(position_tank2.x - position_tank1.x) + 
            (position_tank2.z - position_tank1.z)*(position_tank2.z - position_tank1.z)
        ); // Guarda a última distância entre os dois tanques.
    };

    // Métodos para setar as propriedades da câmera.
    setPosition(position) {
        this.camera.position.copy(position);
    };
    setUpPosition(upPosition) {
        this.camera.up.copy(upPosition);
    };
    setLookAt(lookAt) {
        this.camera.lookAt(lookAt);
    };

    // Método para atualizar a câmera.
    update(position_tank1, position_tank2) {
        // Calculando a posição média entre os tanques e a distância entre eles.
        let midX = (position_tank1.x + position_tank2.x) / 2;
        let midZ = (position_tank1.z + position_tank2.z) / 2;
        let dist =  Math.sqrt(
            (position_tank2.x - position_tank1.x)*(position_tank2.x - position_tank1.x) + 
            (position_tank2.z - position_tank1.z)*(position_tank2.z - position_tank1.z)
        );
        this.setLookAt(new THREE.Vector3(midX, 5, midZ));
        if(dist != this.lastDist) {
            this.camera.translateZ((dist - this.lastDist)/1.4);
            this.lastDist = dist;
        }
    };
};