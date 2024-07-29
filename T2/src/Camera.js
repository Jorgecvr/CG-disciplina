import * as THREE from 'three';

export class Camera {
    // Construtor da classe.
    constructor(position_tank1, position_tank2) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200); // Iniciando a câmera.
        this.holder = new THREE.Object3D();
            this.holder.add(this.camera);
        this.lastDist = Math.sqrt(
            (position_tank2.x - position_tank1.x)*(position_tank2.x - position_tank1.x) + 
            (position_tank2.z - position_tank1.z)*(position_tank2.z - position_tank1.z)
        ); // Guarda a última distância entre os dois tanques.
        this.lastPositionX = (position_tank1.x + position_tank2.x) / 2;
        this.lastPositionZ = (position_tank1.z + position_tank2.z) / 2;
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
    };
};