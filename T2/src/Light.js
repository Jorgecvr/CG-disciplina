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
        loader.load('assets/lightPost.glb', function(glb) {
            let obj = glb.scene;
            
            obj.traverse((child) => {
                child.material = new THREE.MeshLambertMaterial({color: 'rgb(80, 80, 80)'});
            });
            
            obj.scale.set(3, 3.6, 3);
            
            object.add(obj);
        });
        return object;
    };

    // Método que cria o SpotLight.
    createSpotLight() {
        let spotLight = new THREE.SpotLight("rgb(255,255,255)", 1.0);
            spotLight.angle = THREE.MathUtils.degToRad(21);
            spotLight.castShadow = true;
            spotLight.intensity = 300;
            spotLight.penumbra = 0.2;
        return spotLight;
    };
}