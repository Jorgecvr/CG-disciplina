import * as THREE from 'three';

// Função para criar os blocos do chão.
function createFloor(larg, comp, level, textures) {
    let geometry = new THREE.BoxGeometry(4, 0.1, 4);
    let material = new THREE.MeshLambertMaterial();

    if(level === 1) material.map = textures.ground1;
    else if(level === 2) material.map = textures.ground2;
    else if(level === 3) material.map = textures.ground3;

    const floor = new THREE.Mesh(geometry, material);

    floor.position.set(larg, 0, comp);

    floor.receiveShadow = true;
    floor.castShadow = true;

    return floor;
};

// Função para criar os blocos da parede.
function createWall(larg, comp, level, textures) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial();

    if(level === 1) material.map = textures.wall1;
    else if(level === 2) material.map = textures.wall2;
    else if(level === 3) material.map = textures.wall3;

    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;

    return block;
};

// Função para criar os blocos do portão.
function createGate(larg, comp, level, textures) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial();

    material.map = textures.metal;

    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;

    return block;
};

// Função para criar os blocos do corredor.
function createHall(larg, comp, level, textures) {
    const geometry = new THREE.BoxGeometry(4, 0.1, 4);
    const material = new THREE.MeshLambertMaterial();

    material.map = textures.hall;

    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 0, comp);
    block.receiveShadow = true;
    block.castShadow = true;

    return block;
};

// Função para criar os blocos das paredes móveis.
function createMovingWalls(larg, comp, level, textures) {
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshLambertMaterial();

    material.map = textures.wall4;

    const block = new THREE.Mesh(geometry, material);

    block.position.set(larg, 1.55, comp);
    block.receiveShadow = true;
    block.castShadow = true;

    return block;
};

// Função que cria o nível com base na matriz fornecida.
function createLevel(levelMatrix, levelType, textures) {
    // O nível será um grupo com 8 grupos de blocos (parede, chão, portões, corredores e paredes móveis).
    const level = new THREE.Group;
    const floor = new THREE.Group;
    const wall = new THREE.Group;
    const gate1 = new THREE.Group;
    const gate2 = new THREE.Group;
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
        larg = 76;
        comp = 0;
    }
    else if(levelType === 3) {
        larg = 164;
        comp = -8;
    }

    for(let i = 0; i < levelMatrix.length; i++) {
        for(let j = 0; j < levelMatrix[i].length; j++) {
            if(levelMatrix[i][j] === 0 || levelMatrix[i][j] === 4 || levelMatrix[i][j] === 5 || levelMatrix[i][j] === 6 || levelMatrix[i][j] === 7) {
                // Cria o bloco do chão.
                const block = createFloor(j*4 + larg, i*4 + comp, levelType, textures);
                floor.add(block);
            }
            if(levelMatrix[i][j] === 1) {
                // Cria o bloco da parede.
                const block = createWall(j*4 + larg, i*4 + comp, levelType, textures);
                wall.add(block);
            }
            else if(levelMatrix[i][j] === 2) {
                // Cria o bloco do portão.
                const block = createGate(j*4 + larg, i*4 + comp, levelType, textures);
                gate1.add(block);
            }
            else if(levelMatrix[i][j] === 3) {
                // Cria o bloco do corredor.
                const block = createHall(j*4 + larg, i*4 + comp, levelType, textures);
                hall.add(block);
            }
            else if(levelMatrix[i][j] === 4) {
                // Cria bloco de apoio à colisão do canhão.
                const block = createWall(j*4 + larg, i*4 + comp, levelType, textures);
                block.visible = false;
                wall.add(block);
            }

            if(levelType === 2 || levelType === 3) {
                if(levelMatrix[i][j] === 8) {
                    // Cria o bloco do portão.
                    const block = createGate(j*4 + larg, i*4 + comp, levelType, textures);
                    gate2.add(block);
                }
            }

            if(levelType === 3) {
                if(levelMatrix[i][j] === 5) {
                    // Cria bloco da primeira parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType, textures);
                    movingWall1.add(block);
                }
                else if(levelMatrix[i][j] === 6) {
                    // Cria bloco da segunda parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType, textures);
                    movingWall2.add(block);
                }
                else if(levelMatrix[i][j] === 7) {
                    // Cria bloco da terceira parede móvel.
                    const block = createMovingWalls(j*4 + larg, i*4 + comp, levelType, textures);
                    movingWall3.add(block);
                }
            }
        }
    }

    level.add(floor, wall, gate1, gate2, hall, movingWall1, movingWall2, movingWall3);
    return level;
};

// Função para criar os níveis na App.
export function CreateLevel(level) {

    const loadTexture = (file) => {
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(file);

        texture.colorSpace = THREE.SRGBColorSpace;

        return texture;
    };

    const textures = {
        ground1: loadTexture('assets/textures/ground1.jpg'),
        ground2: loadTexture('assets/textures/ground2.jpg'),
        ground3: loadTexture('assets/textures/ground3.jpg'),
        wall1: loadTexture('assets/textures/wall1.png'),
        wall2: loadTexture('assets/textures/wall2.jpg'),
        wall3: loadTexture('assets/textures/wall3.jpg'),
        wall4: loadTexture('assets/textures/wall4.jpg'),
        metal: loadTexture('assets/textures/metal.jpg'),
        hall: loadTexture('assets/textures/hall.jpg'),
    };

    let level1 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1],
    ];

    let level2 = [
        [-1,-1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1],
        [-1,-1,1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,-1,-1],
        [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [3, 3, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 3, 3],
        [3, 3, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 3, 3],
        [3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 8, 3, 3],
        [3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 8, 3, 3],
        [3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 8, 3, 3],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,-1,-1],
        [-1,-1,1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,-1,-1],
        [-1,-1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1],
    ];

    let level3 = [
        [-1,-1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [3, 3, 8, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [3, 3, 8, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
        [3, 3, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [3, 3, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [3, 3, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [-1,-1,1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [-1,-1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    if(level == 1) return createLevel(level1, 1, textures);
    else if(level == 2) return createLevel(level2, 2, textures);
    else if(level == 3) return createLevel(level3, 3, textures);
};