import * as THREE from 'three';
import { CSG } from '../../libs/other/CSGMesh.js';

export class Cannon {
    constructor() {
        this.object = this.createCannon();
        this.speedRotation = 0.02;
        this.speedShot = -0.2;
        this.direction = new THREE.Vector3(0, 0, 0).normalize();
        
    }

    // Funções de get e set para a direção do Canhão
    getDirection() {
        return this.direction.normalize().clone();
    }

    setDirection(direction) {
        this.direction = direction.normalize();
    }

    createCannon() {

        // Criando a primeira base quadrada do canhão.
        const baseQuadrada = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 5));
        const baseQuadradaCSG = CSG.fromMesh(baseQuadrada);
        
        // Criando os cilindros para cortar os cantos da base.
        const criarCilindroCorte = (x, z) => {
            const cilindroCorte = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 40));
            cilindroCorte.position.set(x, 0, z);
            cilindroCorte.matrixAutoUpdate = false;
            cilindroCorte.updateMatrix();
            return CSG.fromMesh(cilindroCorte);
        };

        // Aplicando os cortes na primeira base (OPERAÇÃO DE SUBTRAÇÃO).
        const baseCortadaCSG = baseQuadradaCSG
            .subtract(criarCilindroCorte(2.5, 2.5))
            .subtract(criarCilindroCorte(2.5, -2.5))
            .subtract(criarCilindroCorte(-2.5, 2.5))
            .subtract(criarCilindroCorte(-2.5, -2.5));
        const baseCortadaMesh = CSG.toMesh(baseCortadaCSG, new THREE.Matrix4);
        baseCortadaMesh.position.set(0, 0.3, 0);
        baseCortadaMesh.matrixAutoUpdate = false;
        baseCortadaMesh.updateMatrix();

        // Criando a segunda base maior.
        const baseMaior = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 6));
        const baseMaiorCSG = CSG.fromMesh(baseMaior);

        // Subtraindo os cilindros dos cantos da base maior.
        const baseMaiorCortadaCSG = baseMaiorCSG
            .subtract(criarCilindroCorte(3, 3))
            .subtract(criarCilindroCorte(3, -3))
            .subtract(criarCilindroCorte(-3, 3))
            .subtract(criarCilindroCorte(-3, -3));

        // Unindo base maior com base menor (OPERAÇÃO DE UNIÃO).
        const ptInferiorMesh = CSG.toMesh(baseMaiorCortadaCSG.union(CSG.fromMesh(baseCortadaMesh)), new THREE.Matrix4);
        ptInferiorMesh.material = new THREE.MeshLambertMaterial({color: 0x328f62});
        ptInferiorMesh.castShadow = true;
        ptInferiorMesh.receiveShadow = true;
        ptInferiorMesh.position.y = -1.8;
        ptInferiorMesh.matrixAutoUpdate = false;
        ptInferiorMesh.updateMatrix();

        // Criando o cano do canhão.
        const canoExterno = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 3.9, 40));
        let canoExternoCSG = CSG.fromMesh(canoExterno);

        // Criando o cilindro interno para o corte (furo do cano).
        const cilindroInterno = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 40));
        let cilindroInternoCSG = CSG.fromMesh(cilindroInterno);

        // Aplicando corte no cano (OPERAÇÃO DE SUBTRAÇÃO).
        const canoFuradoMesh = CSG.toMesh(canoExternoCSG.subtract(cilindroInternoCSG), new THREE.Matrix4);
        canoFuradoMesh.rotation.x = Math.PI / 2; // Rotaciona 90 graus ao redor do eixo X.
        canoFuradoMesh.position.z += 1.9;
        canoFuradoMesh.matrixAutoUpdate = false;
        canoFuradoMesh.updateMatrix();
        canoFuradoMesh.material = new THREE.MeshLambertMaterial({color: 0x84bba0});

        // Criando o cilindro do pé.
        const cilindroPe = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.5, 2, 32));
        cilindroPe.position.y = -1;
        const cilindroPeCSG = CSG.fromMesh(cilindroPe);

        // Criando o cubo do pé;
        const cuboPe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5));
        cuboPe.position.y = -0.5;
        const cuboPeCSG = CSG.fromMesh(cuboPe);

        // Fazendo a interseção para criar o pé (OPERAÇÃO DE INTERSEÇÃO).
        const peCSG = cilindroPeCSG.intersect(cuboPeCSG);
        const peMesh = CSG.toMesh(peCSG, new THREE.Matrix4);
        peMesh.rotation.x = Math.PI; // Rotaciona 180 graus ao redor do eixo X.
        peMesh.position.y -= 0.8;
        peMesh.scale.multiplyScalar(0.8);
        peMesh.matrixAutoUpdate = false;
        peMesh.updateMatrix();

        // Criando a esfera central do canhão.
        const esferaCentralMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32));
        const esferaCentralCSG = CSG.fromMesh(esferaCentralMesh);

        // Unindo o pé com a esfera central do canhão (OPERAÇÃO DE UNIÃO).
        const peCSG2 = CSG.fromMesh(peMesh);
        const peComEsferaCSG = esferaCentralCSG.union(peCSG2);
        const peComEsferaMesh = CSG.toMesh(peComEsferaCSG, new THREE.Matrix4);
        peComEsferaMesh.material = new THREE.MeshLambertMaterial({color: 0x84bba0});
        peComEsferaMesh.castShadow = true;
        peComEsferaMesh.receiveShadow = true;

        // Cano do canhão não é unido na esfera para manter eixo de rotação.
        peComEsferaMesh.add(canoFuradoMesh);

        // Criando o objeto final do canhão.
        const canhaoCompleto = new THREE.Object3D();
        canhaoCompleto.add(peComEsferaMesh);
        canhaoCompleto.add(ptInferiorMesh);

        return canhaoCompleto;
    }
}