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

        this.box = new THREE.Mesh(new THREE.BoxGeometry(4.7, 3.2, 5.1));
            this.object.add(this.box);
            this.box.position.y += 1.7;
            this.box.position.z += 0.3
            this.box.visible = false;

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
            else if(type === 4) color = 'rgb(50, 110, 240)';

            obj.traverse((child) => {
                if(!isPlayer) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: color,
                        shininess: "30",
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

    // Método que controla a movimentação do tanque.
    movePlayer(type, levels, player = null, Bullet = [], scene = null, oTank = null, oTank2 = null, cannon = null) {
        let keyboard = new KeyboardState();
        keyboard.update();

        const movementSpeed = 0.7;
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
        // console.log(collisions[0]);

        // Definição dos limites inicias do primeiro nível.
        const levelLimits = {
            minX: -400,
            maxX: 400,
            minZ: -400,
            maxZ: 400,
        };

        // Tratamento de colisões.
        if(collisions.length > 0) {
            console.log(collisions[0].position);
            // Atualiza levelLimits com base na posição do bloco e direção do tanque.
            collisions.forEach((collisionBlock) => {
                this.updateLimits(collisionBlock, levelLimits);
            });

            // Verifica se o tanque está de ré.
            if(this.lastDirection == 1) {
                levelLimits.minX -= 0.5;
                levelLimits.maxX += 0.5;
                levelLimits.minZ -= 0.5;
                levelLimits.maxZ += 0.5;
            }
        }

        // Aplica a restrição com base nos limites do nível (método clamp restrige o valor da posição).
        this.object.position.x = THREE.MathUtils.clamp(x, levelLimits.minX, levelLimits.maxX);
        this.object.position.z = THREE.MathUtils.clamp(z, levelLimits.minZ, levelLimits.maxZ);       
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