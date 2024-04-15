import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export function CreateLevel(nivel) {
    let baseFloor = new THREE.Object3D;
    let baseWall = new THREE.Object3D;
    let floorMaterial;
    let floorGeometry = new THREE.BoxGeometry(4, 0.1, 4);

    let wallMaterial = setDefaultMaterial('#929292');
    let wallGeometry = new THREE.BoxGeometry(4, 3, 4);

    for(let i = 0; i < nivel.length; i++) {
        for(let j = 0; j < nivel[i].length; j++) {
            if( nivel[i][j] === 1) {
                let wall = new THREE.Mesh( wallGeometry, wallMaterial );
                baseWall.add(wall);
                wall.position.set((-4*i), 1.55, (-4*j));
            }
            if( j % 2 === 0 ) {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('#6F6F6F');
                else floorMaterial = setDefaultMaterial('#B0B0B0');
            }
            else {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('#B0B0B0');
                else floorMaterial = setDefaultMaterial('#6F6F6F');
            }
            let floor = new THREE.Mesh( floorGeometry, floorMaterial );
            baseFloor.add(floor);
            floor.position.set((-4*i), 0.0, (-4*j));
        }
    }
    return [baseFloor, baseWall];
}