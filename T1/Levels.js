import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export function CreateLevel(nivel) {
    let base = new THREE.Object3D;
    let floorMaterial;
    let floorGeometry = new THREE.BoxGeometry(4, 0.1, 4);

    let wallMaterial = setDefaultMaterial('darkgreen');
    let wallGeometry = new THREE.BoxGeometry(4, 3, 4);

    for(let i = 0; i < nivel.length; i++) {
        for(let j = 0; j < nivel[i].length; j++) {
            if( j % 2 === 0 ) {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('white');
                else floorMaterial = setDefaultMaterial('gray');
            }
            else {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('grey');
                else floorMaterial = setDefaultMaterial('white');
            }
            let floor = new THREE.Mesh( floorGeometry, floorMaterial );
            base.add(floor);
            floor.position.set((-4*i), 0.0, (-4*j));
            if( nivel[i][j] === 1) {
                let wall = new THREE.Mesh( wallGeometry, wallMaterial );
                base.add(wall);
                wall.position.set((-4*i), 1.55, (-4*j))
            }
        }
    }
    return base;
}