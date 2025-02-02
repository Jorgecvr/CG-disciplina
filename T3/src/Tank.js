import * as THREE from 'three';
import KeyboardState from '../../libs/util/KeyboardState.js';

// Importação do Loader para o utilizar o modelo do tank.
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

// Importação do Verificador de Colisões.
import { CheckCollisionsWithWall } from './Collisions.js';

// Importação da movimentação dos tanques inimigos.
import { UpdateTankPositionLevel1, UpdateTankPositionLevel2, UpdateTankPositionLevel3 } from './Enemies.js';

// Criação da classe Tank para montar e exportar o tanque.
export class Tank {
    constructor(type, isPlayer) {
        this.object = new THREE.Object3D();
        this.loadModel(type, isPlayer);

        this.isGodMode = false;
        this.originalMaterials = [];

        // Objeto de apoio à colisão.
        this.box = new THREE.Mesh(new THREE.BoxGeometry(4.7, 3.2, 5.1));
            this.object.add(this.box);
            this.box.position.y += 1.7;
            this.box.position.z += 0.3
            this.box.visible = false;
            

        // Criando a vida de cada tanque.
        this.life = 1000;
        this.lifeBar = this.createLifeBar();

        // Criando atributos para a morte do tanque.
        this.isDead = false;

        // Salva a última direção do tanque (0 para frente e 1 para ré);
        this.lastDirection = 0;
    };

    // Método que importa o modelo e cria o tanque.
    loadModel(type, isPlayer) {
        let loader = new GLTFLoader();

        loader.load('assets/objects/tankModel.glb', (glb) => {
            let obj = glb.scene;

            let color;
            if(type === 1) color = 'rgb(205, 50, 50)';
            else if(type === 2) color = 'rgb(50, 50, 205)';
            else if(type === 3) color = 'rgb(130, 7, 5)';
            else if(type === 4) color = 'rgb(105, 150, 150)';

            obj.traverse((child) => {
                if(!isPlayer) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: color,
                        shininess: "200",
                        specular: "rgb(255, 255, 255)"
                    });
                } 
                child.castShadow = true;
                // child.receiveShadow = true;
            });
            obj.scale.set(1.3, 1.3, 1.3);
            this.object.add(obj);
        });
    };

    // Método para criar a geometria da vida do tanque.
    createLifeBar() {
        let lifeBar = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 0.3), new THREE.MeshLambertMaterial({color: "rgb(205, 50, 50)", emissive: "rgb(205, 50, 50)", emissiveIntensity: 0.8}));
        return lifeBar;
    };

    // Métodos para pegar e setar a vida do tanque.
    getLife(){
        return this.life;
    };
    setLife(life){
        this.life = life;
    };

    // Método para habilitar o GodMode.
    godMode() {
        if(!this.isGodMode) {
            this.lifeBar.visible = false;
            this.setLife(1000000000000);
            
            this.object.traverse((child) => {
                if(child instanceof THREE.Mesh) {
                    this.originalMaterials.push(child.material);
                    child.material = new THREE.MeshPhongMaterial({
                        color: "rgb(255, 223, 0)",
                        shininess: 200,
                        specular: "rgb(255, 255, 255)"
                    });
                }
            });
        }
        else {
            this.lifeBar.visible = true;
            this.setLife(1000);
            
            let materialIndex = 0;
            this.object.traverse((child) => {
                if(child instanceof THREE.Mesh && this.originalMaterials[materialIndex]) {
                    child.material = this.originalMaterials[materialIndex];
                    materialIndex++;
                }
            });
        }
        this.isGodMode = !this.isGodMode;
    };

    gotFirstPowerUp(){
        if(this.getLife() < 900){this.setLife(this.getLife() + this.getLife()*0.2)}
        
        this.object.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                this.originalMaterials.push(child.material);
                child.material = new THREE.MeshPhongMaterial({
                    color: "rgb(0, 255, 0)",
                    shininess: 200,
                    specular: "rgb(255, 255, 255)"
                });
            }
        });

        setTimeout(() => {
            let materialIndex = 0;
            this.object.traverse((child) => {
                if (child instanceof THREE.Mesh && this.originalMaterials[materialIndex]) {
                    child.material = this.originalMaterials[materialIndex];
                    materialIndex++;
                }
            });
        }, 500);
    };

    // Método para "matar" o tanque.
    kill(scene) {
        this.life = 1000;
        scene.remove(this.object);
        scene.remove(this.lifeBar);
        this.object.position.set(-200, -200, -200);
        this.isDead = true;
    };

    // Método que controla a movimentação do tanque.
    movePlayer(type, levels, player = null, Bullet = [], scene = null, oTank = null, oTank2 = null, cannon = null) {
        let keyboard = new KeyboardState();
        keyboard.update();

        const movementSpeed = 0.3;
        const rotationSpeed = 0.05;

        // Define as condições de movimento.
        if(type === 0) {
            if(keyboard.pressed("W") || keyboard.pressed("up")) {
                this.object.translateZ(movementSpeed);
                if(this.lastDirection != 0) this.lastDirection = 0;
            } 
            if(keyboard.pressed("S") || keyboard.pressed("down")) {
                this.object.translateZ(-movementSpeed);
                if(this.lastDirection != 1) this.lastDirection = 1;
            }
            if(keyboard.pressed("A") || keyboard.pressed("left")) this.object.rotateY(rotationSpeed);
            if(keyboard.pressed("D") || keyboard.pressed("right")) this.object.rotateY(-rotationSpeed);
        } else if(type === 1) {
            UpdateTankPositionLevel1(player, this, type, levels, Bullet, scene);
        } else if(type === 2 || type === 3) {
            UpdateTankPositionLevel2(player, this, type, levels, Bullet, scene, oTank, cannon);
        } else if(type === 4 || type === 5 || type === 6) {
            UpdateTankPositionLevel3(player, this, type-2, levels, Bullet, scene, oTank, oTank2, cannon);
        }


        // Pega as coordenadas x e z do tanque em relação ao mundo.
        let x = this.object.getWorldPosition(new THREE.Vector3()).x;
        let z = this.object.getWorldPosition(new THREE.Vector3()).z;

        // Verificando colisão.
        let collisions = CheckCollisionsWithWall(this, levels);

        // Definição dos limites inicias do primeiro nível.
        const levelLimits = {
            minX: -400,
            maxX: 400,
            minZ: -400,
            maxZ: 400,
        };

        // Tratamento de colisões.
        if(collisions.length > 0) {
            // Atualiza levelLimits com base na posição do bloco e direção do tanque.
            collisions.forEach((collisionBlock) => {
                this.updateLimits(collisionBlock, levelLimits);
            });

            // Verifica se o tanque está de ré.
            if(this.lastDirection == 1) {
                levelLimits.minX -= 0.5;
                levelLimits.maxX += 0.5;
                levelLimits.minZ -= 0.7;
                levelLimits.maxZ += 0.5;
            }
        }

        // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
        this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
        this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);
        
        // Desliza o tanque se colide com as paredes que mexem.
        if(this.object.position.z > 31 || this.object.position.z < 9) {
            if(this.object.position.x >= 192 && this.object.position.x <= 196
              || this.object.position.x >= 212 && this.object.position.x <= 216
              || this.object.position.x >= 232 && this.object.position.x <= 236) {
                this.object.position.x -= 0.6;
            }
            else if(this.object.position.x > 196 && this.object.position.x <= 200
                || this.object.position.x > 216 && this.object.position.x <= 220
                || this.object.position.x > 236 && this.object.position.x <= 240) {
                this.object.position.x += 0.6;
            }
        }
    };

    // Método que move o player no celular.
    movePlayerMobile(levels, joystickL) {
        const move = (direction) => {
            const movementSpeed = 0.3;
            const rotationSpeed = 0.1;

            // Calcule a direção e rotacione o tanque.
            if (direction.length() > 0) {
                direction.normalize();
    
                // Calcula a rotação alvo com base na direção do joystick.
                const targetRotation = Math.atan2(direction.x, direction.z);
    
                // Corrige a rotação atual (converte para o intervalo de -PI a PI).
                let currentRotation = this.object.rotation.y % (2 * Math.PI);
                if (currentRotation < -Math.PI) currentRotation += 2 * Math.PI;
                if (currentRotation > Math.PI) currentRotation -= 2 * Math.PI;
    
                // Calcula a diferença de ângulo entre a rotação atual e a rotação alvo.
                let angleDiff = targetRotation - currentRotation;
                if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    
                // Gira o tanque na direção do joystick usando o menor ângulo.
                if (Math.abs(angleDiff) > rotationSpeed) {
                    this.object.rotation.y += Math.sign(angleDiff) * rotationSpeed;
                } else {
                    this.object.rotation.y = targetRotation; // Alinha diretamente se próximo.
                }
    
                // Move o tanque para frente na direção atual.
                this.object.translateZ(movementSpeed);
            }

             // Pega as coordenadas x e z do tanque em relação ao mundo.
            let x = this.object.getWorldPosition(new THREE.Vector3()).x;
            let z = this.object.getWorldPosition(new THREE.Vector3()).z;

            // Verificando colisão.
            let collisions = CheckCollisionsWithWall(this, levels);

            // Definição dos limites inicias do primeiro nível.
            const levelLimits = {
                minX: -400,
                maxX: 400,
                minZ: -400,
                maxZ: 400,
            };

            // Tratamento de colisões.
            if(collisions.length > 0) {
                // Atualiza levelLimits com base na posição do bloco e direção do tanque.
                collisions.forEach((collisionBlock) => {
                    this.updateLimits(collisionBlock, levelLimits);
                });

                // Verifica se o tanque está de ré.
                if(this.lastDirection == 1) {
                    levelLimits.minX -= 0.5;
                    levelLimits.maxX += 0.5;
                    levelLimits.minZ -= 0.7;
                    levelLimits.maxZ += 0.5;
                }
            }

            // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
            this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
            this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);
            
            // Desliza o tanque se colide com as paredes que mexem.
            if(this.object.position.z > 31 || this.object.position.z < 9) {
                if(this.object.position.x >= 192 && this.object.position.x <= 196
                || this.object.position.x >= 212 && this.object.position.x <= 216
                || this.object.position.x >= 232 && this.object.position.x <= 236) {
                    this.object.position.x -= 0.6;
                }
                else if(this.object.position.x > 196 && this.object.position.x <= 200
                    || this.object.position.x > 216 && this.object.position.x <= 220
                    || this.object.position.x > 236 && this.object.position.x <= 240) {
                    this.object.position.x += 0.6;
                }
            }
        };

        joystickL.on('move', function (evt, data) {
            // Passa a direção para a função de movimento do tanque.
            const direction = new THREE.Vector3(data.vector.x, 0, data.vector.y);

            move(direction);
        });

        joystickL.on('end', function () {
            // Para a movimentação quando o joystick é solto.
            move(new THREE.Vector3(0, 0, 0));
        });
    };

    // Função que atualiza os limites de movimento baseado na colisão.
    updateLimits(collisionBlock, levelLimits) {
        // Posição do bloco que está colidindo.
        let blockPosition = new THREE.Vector3();
        collisionBlock.getWorldPosition(blockPosition);

        // Posição do tanque.
        let tankPosition = this.object.getWorldPosition(new THREE.Vector3());

        // Diferença entre a posição do tanque e do bloco (no plano XZ).
        let deltaX = tankPosition.x - blockPosition.x;
        let deltaZ = tankPosition.z - blockPosition.z;

        // Definir os limites dependendo da direção da colisão
        const blockSize = 5; // Tamanho ajustado para os limites do bloco.

        // Colisão no eixo X (lado do tanque).
        if(Math.abs(deltaX) > Math.abs(deltaZ)) {
            if(deltaX > 0) levelLimits.minX = blockPosition.x + blockSize;
            else levelLimits.maxX = blockPosition.x - blockSize;
        }
        else { // Colisão no eixo Z (frente/trás do tanque).
            if(deltaZ > 0) levelLimits.minZ = blockPosition.z + blockSize;
            else levelLimits.maxZ = blockPosition.z - blockSize;
        }
    };
};