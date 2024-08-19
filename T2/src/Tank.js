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

        // Objetos de apoio à colisão.
        this.base = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2, 4.2));
            this.object.add(this.base);
            this.base.position.y += 1;
            this.base.position.z -= 0.25;
            // this.base.visible = false;
        this.cannon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2));
            this.object.add(this.cannon);
            this.cannon.position.y += 2.7;
            this.cannon.position.z += 2.5;
            // this.cannon.visible = false;

        // Criando a vida de cada tanque.
        this.life = 1000;
        this.lifeBar = this.createLifeBar();
    };

    // Método que importa o modelo e cria o tanque.
    create(type, levelType) {
        let loader = new GLTFLoader();
        let object = new THREE.Object3D();
        loader.load('assets/tankModel.glb', function(glb) { 
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

            // Define os limites iniciais do nível.
            const levelLimits = {
                minX: 5,
                maxX: 63,
                minZ: 5,
                maxZ: 39,
            };
            // Pega as coordenadas x e z do tanque em relação ao mundo.
            let x = this.object.getWorldPosition(new THREE.Vector3()).x;
            let z = this.object.getWorldPosition(new THREE.Vector3()).z;
            if(this.lastDirection === 1) {
                levelLimits.minX -= 0.5;
                levelLimits.maxX += 0.5;
                levelLimits.minZ -= 0.5;
                levelLimits.maxZ += 0.5;
            }
    
            // Tratamento de colisões.
            let collisionBlock, collisionType = CheckCollisionsWithWall(this, level);
            
            console.log(collisionBlock, collisionType);

            // Se há colisão.
            if(collisionType != -1) {
                console.log(collisionBlock.position.x, collisionBlock.position.z);
            }

            // Se há colisão as restrições de movimento são alteradas.
            // if(collisionBlock) {
            //     if(this.lastDirection === 0) {
            //         if(collisionBlock.position.x == 16) {
            //             if(z <= 20) {
            //                 levelLimits.minX = x <= 16 ? 5 : 21;
            //                 levelLimits.maxX = x <= 16 ? 11 : 63;
            //             } else if(z > 21) {
            //                 // levelLimits.minZ = 21.5;
            //             }
            //         } 
                //     if(collisionBlock.position.x == 32) {
                //         if(x >= 27.4 && x <= 36.4) {
                //             levelLimits.minZ = 16;
                //             levelLimits.maxZ = 27;
                //         }
                //         else {
                //             levelLimits.minX = x <= 32 ? 5 : 37;
                //             levelLimits.maxX = x <= 32 ? 27 : 59; 
                //         }
                //     }
                //     else if(collisionBlock.position.z == 44 || collisionBlock.position.z == 0) {
                //         levelLimits.minX = x <= 32 ? 5 : 37;
                //         levelLimits.maxX = x <= 32 ? 27 : 59;
                //    }
                // } else {
                    // levelLimits.mixX -= 2;
                //     if(collisionBlock.position.x == 32) {
                //         if(x >= 27.4 && x <= 36.2) {
                //             levelLimits.minZ = 16.5;
                //             levelLimits.maxZ = 27.5;
                //         }
                //         else {
                //             levelLimits.maxX = x <= 32 ? 27.5 : 59; 
                //             levelLimits.minX = x <= 32 ? 5 : 36.5;
                //         }
                //     }
                //     else if(collisionBlock.position.z == 44) {
                //         levelLimits.maxX = x <= 32 ? 27.5 : 59; 
                //         levelLimits.minX = x <= 32 ? 5 : 36.5;
                //     }
            //     }
            // }
    
            // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
            this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
            this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);
        }
    };
};