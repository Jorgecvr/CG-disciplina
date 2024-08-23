import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js';
import { UpdateTankPositionLevel1, UpdateTankPositionLevel2 } from './Enemies.js';

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
        this.base = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2, 4.3));
            this.object.add(this.base);
            this.base.position.y += 1;
            this.base.position.z -= 0.24;
            this.base.visible = false;
        this.cannon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2));
            this.object.add(this.cannon);
            this.cannon.position.y += 2.7;
            this.cannon.position.z += 2.5;
            this.cannon.visible = false;

        // Criando a vida de cada tanque.
        this.life = 1000;
        this.lifeBar = this.createLifeBar();

        // Criando atributos para a morte do tanque.
        this.isDead = false;
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
                // child.receiveShadow = true;
            });
            obj.scale.set(1.3, 1.3, 1.3);
            object.add(obj);
        });
        return object;
    };

    // Método para criar a geometria da vida do tanque.
    createLifeBar() {
        let lifeBar = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 0.3), new THREE.MeshBasicMaterial({color: "rgb(205, 50, 50)"}));
        return lifeBar;
    };

    // Método para "matar" o tanque.
    kill(scene) {
        this.life = 0;
        scene.remove(this.object);
        scene.remove(this.lifeBar);
        this.object.position.set(100, 100, 100);
        this.isDead = true;
    };

    // Método que controla a movimentação do tanque.
    move(type, level, levelType, player = null, shoot = false, scene = null) {
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
                if(keyboard.pressed("A")) {
                    this.object.rotateY(rotationSpeed);
                    this.lifeBar.rotateY(-rotationSpeed);
                } 
                if(keyboard.pressed("D")) {
                    this.object.rotateY(-rotationSpeed);
                    this.lifeBar.rotateY(rotationSpeed);
                }
            
                if(keyboard.pressed("up")) {
                    this.object.translateZ(movementSpeed);
                    if(this.lastDirection != 0) this.lastDirection = 0;
                } 
                if(keyboard.pressed("down")) {
                    this.object.translateZ(-movementSpeed);
                    if(this.lastDirection != 1) this.lastDirection = 1;
                } 
                if(keyboard.pressed("left"))  {
                    this.object.rotateY(rotationSpeed);
                    this.lifeBar.rotateY(-rotationSpeed);
                }
                if(keyboard.pressed("right")) {
                    this.object.rotateY(-rotationSpeed);
                    this.lifeBar.rotateY(rotationSpeed);
                }
            } else if(type == 2) {
                UpdateTankPositionLevel1(player, this, shoot, type, level, scene);
            }

            // Pega as coordenadas x e z do tanque em relação ao mundo.
            let x = this.object.getWorldPosition(new THREE.Vector3()).x;
            let z = this.object.getWorldPosition(new THREE.Vector3()).z;
            
            // Tratamento de colisões.
            const levelLimits = { // Definição dos limites inicias do primeiro nível.
                minX: 5,
                maxX: 59,
                minZ: 5,
                maxZ: 39,
            };
            let {collisionBlock, collisionType} = CheckCollisionsWithWall(this, level);
            if(this.lastDirection == 0) {
                if(collisionBlock) {
                    if(collisionBlock.position.x == 32 && collisionBlock.position.z == 12) {
                        if(z <= 15.5) {
                            if(collisionType == 1) {
                                levelLimits.minX = x <= 32 ? 5 : 37;
                                levelLimits.maxX = x <= 32 ? 27 : 39;
                            } else {
                                levelLimits.minX = x <= 32 ? 5 : 36;
                                levelLimits.maxX = x <= 32 ? 28 : 39;
                            }
                        } else {
                            if(collisionType == 1) {
                                levelLimits.minZ = 17;
                            } else {
                                levelLimits.minZ = 16;
                            }
                        }
                    }
                    else if(collisionBlock.position.x == 32 && collisionBlock.position.z == 32) {
                        if(z >= 28.5) {
                            if(collisionType == 1) {
                                levelLimits.minX = x <= 32 ? 5 : 37;
                                levelLimits.maxX = x <= 32 ? 27 : 39;
                            } else {
                                levelLimits.minX = x <= 32 ? 5 : 36;
                                levelLimits.maxX = x <= 32 ? 28 : 39;
                            }
                        } else {
                            if(collisionType == 1) {
                                levelLimits.maxZ = 27;
                            } else {
                                levelLimits.maxZ = 28;
                            }
                        }
                    }
                    else if(collisionBlock.position.x == 32 || collisionBlock.position.x == 28 || collisionBlock.position.x == 36) {
                        if(z <= 15.5) {
                            levelLimits.minX = x <= 32 ? 5 : 37;
                            levelLimits.maxX = x <= 32 ? 27 : 39;
                        }
                        else if(z >= 28.5) {
                            levelLimits.minX = x <= 32 ? 5 : 37;
                            levelLimits.maxX = x <= 32 ? 27 : 39;
                        }
                    }
                }
            } else {
                levelLimits.minX -= 0.5
                levelLimits.maxX += 0.5
                levelLimits.minZ -= 0.5
                levelLimits.maxZ += 0.5

                if(collisionBlock) {
                    if(collisionBlock.position.x == 32 || collisionBlock.position.x == 28 || collisionBlock.position.x == 36) {
                        if(z <= 15.5 || z >= 28.5) {
                            levelLimits.minX = x <= 32 ? 5 : 36.5;
                            levelLimits.maxX = x <= 32 ? 27.5 : 39;
                        } else {
                            levelLimits.minZ = 16.5;
                            levelLimits.maxZ = 27.5;
                        }
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
                if(keyboard.pressed("A")) {
                    this.object.rotateY(rotationSpeed);
                    this.lifeBar.rotateY(-rotationSpeed);
                }
                if(keyboard.pressed("D")) {
                    this.object.rotateY(-rotationSpeed);
                    this.lifeBar.rotateY(rotationSpeed);
                }
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
            } else if(type == 2 || type == 3) {
                UpdateTankPositionLevel2(player, this, shoot, type, level, scene);
            }

            // Pega as coordenadas x e z do tanque em relação ao mundo.
            let x = this.object.getWorldPosition(new THREE.Vector3()).x;
            let z = this.object.getWorldPosition(new THREE.Vector3()).z;
    
            // Tratamento de colisões para o segundo nível..
            let levelLimits = { // Definição dos limites inicias do segundo nível.
                minX: 5,
                maxX: 63,
                minZ: 5,
                maxZ: 39,
            };
            let {collisionBlock, collisionType} = CheckCollisionsWithWall(this, level);

            if(this.lastDirection == 0) {
                // Se há colisão.
                if(collisionBlock) {
                    if(collisionBlock.position.x == 16 && collisionBlock.position.z == 16) {
                        if(z <= 19.5) {
                            if(collisionType == 1) {
                                levelLimits.minX = x <= 16 ? 4.6 : 21;
                                levelLimits.maxX = x <= 16 ? 11 : 63.4;
                            } else {
                                levelLimits.minX = x <= 16 ? 4.6 : 20;
                                levelLimits.maxX = x <= 16 ? 12 : 63.4;
                            }
                        } else {
                            if(collisionType == 1) {
                                levelLimits.minZ = 21;
                            } else {
                                levelLimits.minZ = 20;
                            }
                        }
                    }
                    else if(collisionBlock.position.x == 16) {
                        if(z <= 19.5) {
                            levelLimits.minX = x <= 16 ? 5 : 21;
                            levelLimits.maxX = x <= 16 ? 11 : 63;
                        }
                    }
                    else if(collisionBlock.position.x == 52 && collisionBlock.position.z == 28) {
                        if(z >= 24.5) {
                            if(collisionType == 1) {
                                levelLimits.minX = x <= 52 ? 4.6 : 57;
                                levelLimits.maxX = x <= 52 ? 47 : 63.4;
                            } else {
                                levelLimits.minX = x <= 52 ? 4.6 : 56;
                                levelLimits.maxX = x <= 52 ? 48 : 63.4;
                            }
                        } else {
                            if(collisionType == 1) {
                                levelLimits.maxZ = 23;
                            } else {
                                levelLimits.maxZ = 24;
                            }
                        }
                    }
                    else if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56) {
                        if(z >= 24.5) {
                            levelLimits.minX = x <= 52 ? 5 : 57;
                            levelLimits.maxX = x <= 52 ? 47 : 63;
                        }
                    }
                    else if((collisionBlock.position.x == 32 && collisionBlock.position.z == 20)) {
                        if(z >= 16.5) {
                            levelLimits.maxX = 28;
                        } else {
                            levelLimits.maxZ = 16;
                        }
                    }
                    else if((collisionBlock.position.x == 32 && collisionBlock.position.z == 24)) {
                        if(z <= 27.5) {
                            levelLimits.maxX = 28;
                        } else {
                            levelLimits.minZ = 28;
                        }
                    }
                    else if((collisionBlock.position.x == 36 && collisionBlock.position.z == 24)) {
                        if(z <= 27.5) {
                            levelLimits.minX = 40;
                        } else {
                            levelLimits.minZ = 28;
                        }
                    }
                    else if((collisionBlock.position.x == 36 && collisionBlock.position.z == 20 )) {
                        if(z >= 16.5) {
                            levelLimits.minX = 40;
                        } else {
                            levelLimits.maxZ = 16;
                        }
                    }
                    
                }
            } else {
                levelLimits.minX -= 0.5;
                levelLimits.maxX +- 0.5;
                levelLimits.minZ -= 0.5;
                levelLimits.maxZ += 0.5;

                if(collisionBlock) {
                    if(collisionBlock.position.x == 16) {
                        if(z <= 19.5) {
                            levelLimits.minX = x <= 16 ? 5 : 20.5;
                            levelLimits.maxX = x <= 16 ? 11.5 : 63;
                        } else {
                            levelLimits.minZ = 20.5;
                        }
                    }
                    else if(collisionBlock.position.x == 52 || collisionBlock.position.x == 48 || collisionBlock.position.x == 56) {
                        if(z >= 24.5) {
                            levelLimits.minX = x <= 52 ? 5 : 56.5;
                            levelLimits.maxX = x <= 52 ? 47.5 : 63;
                        } else {
                            levelLimits.maxZ = 23.5;
                        }
                    }
                }
            }
            
            // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
            this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
            this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);
        }
    };
};