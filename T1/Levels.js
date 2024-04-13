import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export function CreateLevel(nivel) {
    let base = new THREE.Object3D;
    let floorMaterial;
    let floorGeometry = new THREE.BoxGeometry(4, 0.1, 4);

    let wallMaterial = setDefaultMaterial('darkgreen');
    let wallGeometry = new THREE.BoxGeometry( 4, 4, 4);

    for(let i = 0; i < nivel.length; i++) {
        for(let j = 0; j < nivel[i].length; j++) {
            if( j % 2 === 0 ) {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('green');
                else floorMaterial = setDefaultMaterial('gray');
            }
            else {
                if( i % 2 === 0 ) floorMaterial = setDefaultMaterial('gray');
                else floorMaterial = setDefaultMaterial('green');
            }
            let floor = new THREE.Mesh( floorGeometry, floorMaterial );
            base.add(floor);
            floor.position.set((-4*i)+13, 0.0, (-4*j)+13);
            console.log(nivel[i][j]);
        }
    }
    return base;
}