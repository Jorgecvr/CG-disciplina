import * as THREE from 'three';

// Importação do Loader para o utilizar o modelo da luminária.
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

// Criação da classe Light para montar e exportar o SpotLight.
export class Light {
    constructor() {
        this.object = this.create();
        this.spotLight = this.createSpotLight();
    }

    // Método que importa o modelo da luminária.
    create() {
        let loader = new GLTFLoader();
        let object = new THREE.Object3D();
        loader.load('assets/lightModel.glb', function(glb) {
            let obj = glb.scene;
            
            obj.traverse((child) => {
                child.material = new THREE.MeshLambertMaterial({color: 'rgb(54, 54, 54)'});
            });
            
            obj.scale.set(0.7, 0.7, 0.7);
            
            object.add(obj);

            // // Lâmpada 0:
            // object0.position.set(66, 0.2, 42);
            // object0.rotateY(THREE.MathUtils.degToRad(130));
            
            // // Lâmpada 1:
            // // obj.position.set(0, 0.2, 42);
        });
        return object;
    };

    // Método que cria o SpotLight.
    createSpotLight() {
        let spotLight = new THREE.SpotLight("rgb(255,255,255)", 1.0);
            spotLight.position.set(67, 10, 43);
            spotLight.angle = THREE.MathUtils.degToRad(45);
            spotLight.castShadow = true;
            spotLight.target.position.set(60, 1, 36);
            spotLight.target.updateMatrixWorld();
            spotLight.intensity = 20;
            spotLight.penumbra = 0.6;
        return spotLight;
    };
}