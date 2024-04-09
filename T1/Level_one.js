import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export function CreateLevelOne() {
    let base = new THREE.Object3D;
    let pisoMaterial = setDefaultMaterial('white');
    let pisoGeometry = new THREE.BoxGeometry( 4, 0.1, 4 );
    for( let i = 0; i < 8; i++ ) {
        for( let j = 0; j < 8; j++ ) {
            let piso = new THREE.Mesh( pisoGeometry, pisoMaterial );
            base.add(piso);
            piso.position.set((-4.1*i)+13, 0.0, (-4.1*j)+13);
        }
    }
    return base;
}