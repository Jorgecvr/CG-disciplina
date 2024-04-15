import * as THREE from 'three';
import { OBB } from '../build/jsm/math/OBB.js';

// A função que checa colisões, especialmente com a parede é feita através da classe OBB
export function CheckCollisions(tank1, tank2, objeto) {
    // Obtendo a matrix de rotação dos tanques e do objeto
    tank1.updateMatrixWorld();
    const tank1RotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank1.matrixWorld);
    tank2.updateMatrixWorld();
    const tank2RotationMatrix3 = new THREE.Matrix3().setFromMatrix4(tank2.matrixWorld);
    objeto.obj.updateMatrixWorld();
    const objetoRotationMatrix3 = new THREE.Matrix3().setFromMatrix4(objeto.obj.matrixWorld);

    // Criando a OBB para os objetos
    const tank1OBB = new OBB(tank1.getWorldPosition(new THREE.Vector3()), new THREE.Vector3(1.5, 0.425, 2.5), tank1RotationMatrix3);
    const tank2OBB = new OBB(tank2.getWorldPosition(new THREE.Vector3()), new THREE.Vector3(1.5, 0.425, 2.5), tank2RotationMatrix3);
    // Objeto deve ser uma estrutura que contenha o objeto 3d e seus parâmetros de largura, altura e profundidade
    // Esses parâmetros para os tanques já são conhecidos
    const objetoOBB = new OBB(objeto.obj.children[objeto.children].getWorldPosition(new THREE.Vector3()), 
                              new THREE.Vector3(objeto.width / 2, objeto.height / 2, objeto.depth / 2),
                              objetoRotationMatrix3);
    
    // Verifica se há colisão entre os tanques e o objeto
    if(tank1OBB.intersectsOBB(objetoOBB) && tank2OBB.intersectsOBB(objetoOBB)) return 3;
    else if(tank2OBB.intersectsOBB(objetoOBB)) return 2;
    else if(tank1OBB.intersectsOBB(objetoOBB)) return 1;
    else return 0;

}