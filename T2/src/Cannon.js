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
        // Criando o cano do canhão
        let canoExterno = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 3, 40), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        canoExterno.matrixAutoUpdate = false;
        canoExterno.updateMatrix();
        let canoExternoCSG = CSG.fromMesh(canoExterno);

        // Criando o cilindro interno para o corte (furo do cano)
        let cilindroInterno = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 40), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        cilindroInterno.matrixAutoUpdate = false;
        cilindroInterno.updateMatrix();
        let cilindroInternoCSG = CSG.fromMesh(cilindroInterno);

        // Aplicando o corte no cano
        let canoFuradoCSG = canoExternoCSG.subtract(cilindroInternoCSG);
        let canoFuradoMesh = CSG.toMesh(canoFuradoCSG, new THREE.Matrix4());
        canoFuradoMesh.material = new THREE.MeshPhongMaterial({ color: 'red' });
        canoFuradoMesh.rotation.x = Math.PI / 2; // Rotaciona 90 graus ao redor do eixo X
        canoFuradoMesh.matrixAutoUpdate = false;
        canoFuradoMesh.updateMatrix();

        // Criando a esfera central do canhão
        let esferaCentral = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({ color: 0x505005 }));
        esferaCentral.position.set(0, 0, -1.65);
        esferaCentral.matrixAutoUpdate = false;
        esferaCentral.updateMatrix();
        let esferaCentralCSG = CSG.fromMesh(esferaCentral);

        // Unindo a esfera ao cano
        let canoComEsferaCSG = CSG.fromMesh(canoFuradoMesh).union(esferaCentralCSG);
        let canoComEsferaMesh = CSG.toMesh(canoComEsferaCSG, new THREE.Matrix4());
        canoComEsferaMesh.material = new THREE.MeshPhongMaterial({ color: 0x303003 });
        canoComEsferaMesh.matrixAutoUpdate = false;
        canoComEsferaMesh.updateMatrix();

        // Criando o cilindro do pé
        let cilindroPe = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 40), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        cilindroPe.matrixAutoUpdate = false;
        cilindroPe.updateMatrix();
        let cilindroPeCSG = CSG.fromMesh(cilindroPe);

        // Criando o cubo do pé
        let cuboPe = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 1.6), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        cuboPe.matrixAutoUpdate = false;
        cuboPe.updateMatrix();
        let cuboPeCSG = CSG.fromMesh(cuboPe);

        // Fazendo a interseção para criar o pé
        let peCSG = cuboPeCSG.intersect(cilindroPeCSG);
        let peMesh = CSG.toMesh(peCSG, new THREE.Matrix4());
        peMesh.material = new THREE.MeshPhongMaterial({ color: 0x303030 });
        peMesh.position.set(0, -0.5, -1.61);
        peMesh.matrixAutoUpdate = false;
        peMesh.updateMatrix();

        // Unindo Pe com canoComEsfera
        let cilindroPe1CSG = CSG.fromMesh(canoComEsferaMesh);
        let pe1CSG = CSG.fromMesh(peMesh);
        let ptSuperiorCSG = pe1CSG.union(cilindroPe1CSG);
        let ptSuperiorMesh = CSG.toMesh(ptSuperiorCSG, new THREE.Matrix4());
        ptSuperiorMesh.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

        // Criando a primeira base quadrada do canhão
        let baseQuadrada = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 5), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
        baseQuadrada.matrixAutoUpdate = false;
        baseQuadrada.updateMatrix();
        let baseQuadradaCSG = CSG.fromMesh(baseQuadrada);

        // Criando os cilindros para cortar os cantos da base
        let criarCilindroCorte = (x, z) => {
            let cilindroCorte = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 40), new THREE.MeshBasicMaterial({ color: 0x505005 }));
            cilindroCorte.position.set(x, 0, z);
            cilindroCorte.matrixAutoUpdate = false;
            cilindroCorte.updateMatrix();
            return CSG.fromMesh(cilindroCorte);
        };

        // Aplicando os cortes na primeira base
        let baseCortadaCSG = baseQuadradaCSG
            .subtract(criarCilindroCorte(2.5, 2.5))
            .subtract(criarCilindroCorte(2.5, -2.5))
            .subtract(criarCilindroCorte(-2.5, 2.5))
            .subtract(criarCilindroCorte(-2.5, -2.5));

        let baseCortadaMesh = CSG.toMesh(baseCortadaCSG, new THREE.Matrix4());
        baseCortadaMesh.material = new THREE.MeshPhongMaterial({ color: 'lightblue' });
        baseCortadaMesh.position.set(0, -1, -1.5);
        baseCortadaMesh.matrixAutoUpdate = false;
        baseCortadaMesh.updateMatrix();

        // Criando a segunda base maior
        let baseMaior = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 6), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
        baseMaior.matrixAutoUpdate = false;
        baseMaior.updateMatrix();
        let baseMaiorCSG = CSG.fromMesh(baseMaior);

        // Criando os cilindros para cortar os cantos da base maior
        let baseMaiorCortadaCSG = baseMaiorCSG
            .subtract(criarCilindroCorte(3, 3))
            .subtract(criarCilindroCorte(3, -3))
            .subtract(criarCilindroCorte(-3, 3))
            .subtract(criarCilindroCorte(-3, -3));

        let baseMaiorMesh = CSG.toMesh(baseMaiorCortadaCSG, new THREE.Matrix4());
        baseMaiorMesh.material = new THREE.MeshPhongMaterial({ color: 'darkblue' });
        baseMaiorMesh.position.set(0, -1.5, -1.5);  // Posicionando abaixo da primeira base
        baseMaiorMesh.matrixAutoUpdate = false;
        baseMaiorMesh.updateMatrix();

        // Unindo base maior com base menor
        let baseMaior1CSG = CSG.fromMesh(baseMaiorMesh);
        let baseCortada1CSG = CSG.fromMesh(baseCortadaMesh);
        let ptInferiorCSG = baseMaior1CSG.union(baseCortada1CSG);
        let ptInferiorMesh = CSG.toMesh(ptInferiorCSG, new THREE.Matrix4());
        ptInferiorMesh.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

        // Criando o grupo final do canhão
        let canhaoCompleto = new THREE.Group();
        canhaoCompleto.add(ptSuperiorMesh);
        canhaoCompleto.add(ptInferiorMesh);

        return canhaoCompleto;
    }
}