import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js';

// Importação do Loader para o utilizar o modelo do tank.
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

// Importação do Verificador de Colisões.
import { CheckCollisionsWithWall } from './Collisions.js';

// Criação da classe Tank para montar e exportar o tanque.
export class Tank {
    // Construtor da classe.
    constructor(type, levelType) {
        this.object = this.create(type, levelType);
        // Salva a última direção do tanque (0 para frente e 1 para ré);
        this.lastDirection = 0;

        // Criando a vida de cada tanque.
        this.life = 1000;
        this.lifeBar = this.createLifeBar();
    };

    // Método que importa o modelo e cria o tanque.
    create(type, levelType) {
        let loader = new GLTFLoader();
        let object = new THREE.Object3D();
        loader.load('assets/tankModel.glb', function(glb) {
            let bbTank = new THREE.Box3().setFromObject(glb.scene);
            let bbHelper = new THREE.Box3Helper(bbTank, 'yellow');
            glb.scene.add(bbHelper);

            let obj = glb.scene;

            obj.traverse((child) => {
                if(levelType === 1) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: type === 1 ? 'rgb(205, 50, 50)' : 'rgb(50, 50, 205)',
                        shininess: "200",
                        specular: "rgb(255, 255, 255)"
                    });
                } 
                child.castShadow = true;
            });
            obj.scale.set(1.3, 1.3, 1.3);
            object.add(obj);
        });
        return object;
    };

    // Cria a geometria da vida do tanque.
    createLifeBar() {
        let lifeBar = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 0.3), new THREE.MeshBasicMaterial({color: "rgb(205, 50, 50)"}));
        return lifeBar;
    };

    // Método que controla a movimentação do tanque.
    move(type, level, levelType) {
        let keyboard = new KeyboardState();
        keyboard.update();

        const movementSpeed = 0.25;
        const rotationSpeed = 0.025;

        // Define as condições de movimento para o primeiro nível.
        if(levelType === 1) {
            if(type == 1) {
                if(keyboard.pressed("W")) {
                    this.object.translateZ(movementSpeed);
                    if(this.lastDirection != 0) this.lastDirection = 0;
                } 
                if(keyboard.pressed("S")) {
                    this.object.translateZ(-movementSpeed);
                    if(this.lastDirection != 1) this.lastDirection = 1;
                }
                if(keyboard.pressed("A")) this.object.rotateY(rotationSpeed);
                if(keyboard.pressed("D")) this.object.rotateY(-rotationSpeed);
            
                if(keyboard.pressed("up")) {
                    this.object.translateZ(movementSpeed);
                    if(this.lastDirection != 0) this.lastDirection = 0;
                } 
                if(keyboard.pressed("down")) {
                    this.object.translateZ(-movementSpeed);
                    if(this.lastDirection != 1) this.lastDirection = 1;
                } 
                if(keyboard.pressed("left"))  this.object.rotateY(rotationSpeed);
                if(keyboard.pressed("right")) this.object.rotateY(-rotationSpeed);
            }
            // Define os limites iniciais do nível.
            const levelLimits = {
                minX: 4.5,
                maxX: 59.5,
                minZ: 4.5,
                maxZ: 39.5,
            };
            // Pega as coordenadas x e z do tanque em relação ao mundo.
            let x = this.object.getWorldPosition(new THREE.Vector3()).x;
            let z = this.object.getWorldPosition(new THREE.Vector3()).z;
    
            // Verifica se há colisões.
            let collisionBlock = CheckCollisionsWithWall(this, level);
            // Se há colisão as restrições de movimento são alteradas.
            if(collisionBlock != null) {
                console.log(collisionBlock.position.x, collisionBlock.position.z);
                if(this.lastDirection === 0) {
                    if(collisionBlock.position.x == 32) {
                        if(x >= 27.4 && x <= 36.4) {
                            levelLimits.minZ = 16;
                            levelLimits.maxZ = 27;
                        }
                        else {
                            levelLimits.minX = x <= 32 ? 5 : 37;
                            levelLimits.maxX = x <= 32 ? 27 : 59; 
                        }
                    }
                    else if(collisionBlock.position.z == 44 || collisionBlock.position.z == 0) {
                        levelLimits.minX = x <= 32 ? 5 : 37;
                        levelLimits.maxX = x <= 32 ? 27 : 59;
                    }
                } else {
                    if(collisionBlock.position.x == 32) {
                        if(x >= 27.4 && x <= 36.2) {
                            levelLimits.minZ = 16.5;
                            levelLimits.maxZ = 27.5;
                        }
                        else {
                            levelLimits.maxX = x <= 32 ? 27.5 : 59; 
                            levelLimits.minX = x <= 32 ? 5 : 36.5;
                        }
                    }
                    else if(collisionBlock.position.z == 44) {
                        levelLimits.maxX = x <= 32 ? 27.5 : 59; 
                        levelLimits.minX = x <= 32 ? 5 : 36.5;
                    }
                }
            }
    
            // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
            this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
            this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);
        } 
        // Define as condições de movimento do segundo nível.
        else {
            if(type == 1) {
                if(keyboard.pressed("W")) {
                    this.object.translateZ(movementSpeed);
                    if(this.lastDirection != 0) this.lastDirection = 0;
                } 
                if(keyboard.pressed("S")) {
                    this.object.translateZ(-movementSpeed);
                    if(this.lastDirection != 1) this.lastDirection = 1;
                }
                if(keyboard.pressed("A")) this.object.rotateY(rotationSpeed);
                if(keyboard.pressed("D")) this.object.rotateY(-rotationSpeed);
            
                if(keyboard.pressed("up")) {
                    this.object.translateZ(movementSpeed);
                    if(this.lastDirection != 0) this.lastDirection = 0;
                } 
                if(keyboard.pressed("down")) {
                    this.object.translateZ(-movementSpeed);
                    if(this.lastDirection != 1) this.lastDirection = 1;
                } 
                if(keyboard.pressed("left")) this.object.rotateY(rotationSpeed);
                if(keyboard.pressed("right")) this.object.rotateY(-rotationSpeed);
            }
        }
    };
};