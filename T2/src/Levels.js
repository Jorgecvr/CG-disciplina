import * as THREE from 'three';

// Função para criar blocos com base nos níveis.
function createBlock(x, z, type, level) {
    // Tipo 1 é bloco e tipo 2 é piso.

    const geometry = new THREE.BoxGeometry(4, type === 1 ? 4 : 0.1, 4);
    const material = level === 1 ? // Se o nível é 1 utiliza BasicMaterial.
                     type === 1 ? new THREE.MeshLambertMaterial({color: 0x3D3D3D}) : new THREE.MeshLambertMaterial({color: 0x808080})
                     : // Se o nível é 2 utiliza LambertMaterial.
                     type === 1 ? new THREE.MeshLambertMaterial({color: 0x328f62}) : new THREE.MeshLambertMaterial({color: 0x808080});
    const block = new THREE.Mesh(geometry, material);

    block.position.set(x*4, type === 1 ? 1.55 : 0.0, z*4);
    block.receiveShadow = true;
    block.castShadow = true;
    return block;
};

// Função que cria o nível com base na matriz fornecida.
function createLevel(levelMatrix, levelType) {
    // O nível será um objeto com dois grupos de blocos (parede e chão).
    const level = {
        wall: new THREE.Group,
        floor: new THREE.Group,
    };
    for(let i = 0; i < levelMatrix.length; i++) {
        for(let j = 0; j < levelMatrix[i].length; j++) {
            const block = createBlock(j, i, levelMatrix[i][j], levelType);

            if(levelMatrix[i][j] === 1) {
                // Adicionando o bloco ao grupo da parede.
                level.wall.add(block);
            } else {
                // Adicionando o bloco ao grupo do chão.
                level.floor.add(block);
            }
        }
    }
    return level;
};

// Função para criar os níveis na App.
export function CreateLevel(level) {
        let level1 = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    let level2 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    if(level == 1) return createLevel(level1, 1);
    else return createLevel(level2, 2);
};