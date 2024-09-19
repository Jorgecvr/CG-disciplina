import * as THREE from 'three';

// // Função para criar blocos com base nos níveis.
// function createBlock(x, z, type, level) {
//     // Tipo 1 é bloco da parede e tipo 0 é bloco do piso.

//     const geometry = new THREE.BoxGeometry(4, type === 1 ? 4 : 0.1, 4);
//     const material = level === 1 ?
//                         type === 1 ? new THREE.MeshLambertMaterial({color: 0x3D3D3D}) : new THREE.MeshLambertMaterial({color: 0x808080})
//                         :
//                         type === 1 ? new THREE.MeshLambertMaterial({color: 0x328f62}) : new THREE.MeshLambertMaterial({color: 0x808080});
//     const block = new THREE.Mesh(geometry, material);

//     block.position.set(x*4, type === 1 ? 1.55 : -0.1, z*4);
//     block.receiveShadow = true;
//     block.castShadow = true;
//     return block;
// };

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

// Função que cria o nível com base na matriz fornecida.
function createLevel(levelMatrix, levelType) {
    // O nível será um grupo com 4 grupos de blocos (chão, parede, portão e corredor).
    const level = new THREE.Group;
    const floor = new THREE.Group;
    const wall = new THREE.Group;
    const gate = new THREE.Group;
    const hall = new THREE.Group;

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
            if(levelMatrix[i][j] === 0) {
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
        }
    }

    level.add(floor, wall, gate, hall);
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
        [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    if(level == 1) return createLevel(level1, 1);
    else if(level == 2) return createLevel(level2, 2);
    else if(level == 3) return createLevel(level3, 3);
};