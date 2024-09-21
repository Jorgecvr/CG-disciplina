import * as THREE from 'three';

// Função para criar os blocos do chão.
function createFloor(larg, comp, level) {
    const geometry = new THREE.BoxGeometry(4, 0.1, 4);
    const material = new THREE.MeshLambertMaterial({color: 0x808080});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 0, comp);
    block.receiveShadow = true;
    block.castShadow = true;
    return block;
};

// Função para criar os blocos da parede.
function createWall(larg, comp, level) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial({color: 0x328f62});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;
    return block;
};

// Função para criar os blocos do portão.
function createGate(larg, comp, level) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial({color: 0xffd700});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;
    return block;
};

// Função para criar os blocos do corredor.
function createHall(larg, comp, level) {
    const geometry = new THREE.BoxGeometry(4, 0.1, 4);
    const material = new THREE.MeshLambertMaterial({color: 0x303030});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 0, comp);
    block.receiveShadow = true;
    block.castShadow = true;
    return block;
};

// Função para criar os blocos das paredes móveis.
function createMovingWalls(larg, comp, level) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial({color: 0xff6400});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;

    return block;
};

// Função que cria o nível com base na matriz fornecida.
function createLevel(levelMatrix, levelType) {
    // O nível será um grupo com 7 grupos de blocos (chão, parede, portão, corredor e paredes móveis).
    const level = new THREE.Group;
    const floor = new THREE.Group;
    const wall = new THREE.Group;
    const gate = new THREE.Group;
    const hall = new THREE.Group;
    const movingWall1 = new THREE.Group;
    const movingWall2 = new THREE.Group;
    const movingWall3 = new THREE.Group;

    let larg, comp;
    if(levelType === 1) {
        larg = 0;
        comp = 0
    }
    else if(levelType === 2) {
        larg = 80;
        comp = 0;
    }
    else if(levelType === 3) {
        larg = 164;
        comp = -8;
    }

    for(let i = 0; i < levelMatrix.length; i++) {
        for(let j = 0; j < levelMatrix[i].length; j++) {
            if(levelMatrix[i][j] === 0 || levelMatrix[i][j] === 5 || levelMatrix[i][j] === 6 || levelMatrix[i][j] === 7) {
                // Cria o bloco do chão.
                const block = createFloor(j*4 + larg, i*4 + comp, levelType);
                floor.add(block);
            }
            else if(levelMatrix[i][j] === 1) {
                // Cria o bloco da parede.
                const block = createWall(j*4 + larg, i*4 + comp, levelType);
                wall.add(block);
            }
            else if(levelMatrix[i][j] === 2) {
                // Cria o bloco do portão.
                const block = createGate(j*4 + larg, i*4 + comp, levelType);
                gate.add(block);
            }
            else if(levelMatrix[i][j] === 3) {
                // Cria o bloco do corredor.
                const block = createHall(j*4 + larg, i*4 + comp, levelType);
                gate.add(block);
            }

            if(levelType === 3) {
                if(levelMatrix[i][j] === 5) {
                    // Cria bloco da primeira parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType);
                    movingWall1.add(block);
                }
                else if(levelMatrix[i][j] === 6) {
                    // Cria bloco da segunda parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType);
                    movingWall2.add(block);
                }
                else if(levelMatrix[i][j] === 7) {
                    // Cria bloco da terceira parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType);
                    movingWall3.add(block);
                }
            }
        }
    }

    level.add(floor, wall, gate, hall, movingWall1, movingWall2, movingWall3);
    return level;
};

// Função para criar os níveis na App.
export function CreateLevel(level) {
    let level1 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1,-1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
    ];

    let level2 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1,-1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 3, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,-1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,-1,-1,-1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1],
    ];

    let level3 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    if(level == 1) return createLevel(level1, 1);
    else if(level == 2) return createLevel(level2, 2);
    else if(level == 3) return createLevel(level3, 3);
};