import * as THREE from 'three';
import { initRenderer,
         initDefaultBasicLight,
         setDefaultMaterial,
         onWindowResize } from '../../libs/util/util.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { SecondaryBox } from '../libs/util/util.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './Tank.js';
import { CreateLevel } from './Levels.js';
import { directionTankWithCollision } from './Collisions.js';
import { CriaBala, balaAnda } from './Bullet.js';

// Declaração de variáveis úteis.
let scene = new THREE.Scene();                                  // Criando a main scene.
let renderer = initRenderer();                                  // Iniciando o renderer basico.
var camera = new THREE.PerspectiveCamera                        // Iniciando a câmera.
    (45, window.innerWidth / window.innerHeight, 0.1, 200);
let light = initDefaultBasicLight(scene);                       // Criando luz básica para iluminar a scene.
var message = new SecondaryBox();                               // Criando as mensagens de vida.
var keyboard = new KeyboardState();                             // Criando o KeyboardState.

// Iniciando e configurando o OrbitControls
var orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;

// Função utilizada para redimensionar a tela do navegador caso haja alterações.
window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
}, false);

// Começando o jogo.
// Função play chamada na render atualiza toda a lógica do jogo.
function play(end) {
    if(!end) {
        message.changeMessage("Camera Position: " + position[0]+ " " + position[1]);
        swapOrbitControls();
        InitBullet();
        BulletControl(Bullet);
        movement();
        updateCamera();
    }
}

// Função que constrola a lógica de gameover.
function end() {
    let end = true;
    if(tank_player1.getLife() != 0 && tank_player2.getLife() != 0) {
        message.changeMessage("Player_1 - Tiros Acertados: " + (10 - tank_player2.getLife()) + " " + "Player_2 - Tiros Acertados: " + (10 - tank_player1.getLife()));
        end = false;
    }
    else {
        if(tank_player1.getLife() == 0) message.changeMessage("Taque Azul Ganhou! Aperte 'R' para recomeçar!");
        else message.changeMessage("Taque Vermelho Ganhou! Aperte 'R' para recomeçar!");
           
        keyboard.update()
        if(keyboard.down("R")) {
            scene.remove(tank_player1.object);
            scene.remove(tank_player2.object);
            createTanks();

            Bullet.forEach((bullet) => {
                scene.remove(bullet.obj);
            });

            Bullet = [];
            end = false;        
        }
    }
    return end;
}

// Criando o player1.
var tank_player1;
var tank_player2;

function createTanks() {
    tank_player1 = new Tank(0);
    tank_player1.object.position.set(-8.0, 1.1, -8.0);
    tank_player1.object.rotateY(THREE.MathUtils.degToRad(90));
    tank_player1.setDirection(tank_player1.object.getWorldDirection(new THREE.Vector3()));
    scene.add(tank_player1.object);

    // Criando o player2.
    tank_player2 = new Tank(1);
    tank_player2.object.position.set(-8.0, 1.1, -56.0);
    tank_player2.object.rotateY(THREE.MathUtils.degToRad(90));
    tank_player2.setDirection(tank_player2.object.getWorldDirection(new THREE.Vector3()));
    scene.add(tank_player2.object); 
}
createTanks();


// Função que constrola o movimento dos tanques baseado em se há ou não colisões.
function movement() {
    let direction1 = directionTankWithCollision(tank_player1, wall);
    if(direction1 == null) tank_player1.moveTank(0);
    else tank_player1.moveTankWithCollision(0, direction1);

    let direction2 = directionTankWithCollision(tank_player2, wall);
    if(direction2 == null) tank_player2.moveTank(1);
    else tank_player2.moveTankWithCollision(1, direction2);
}

// Criando o vetor de projéteis.
var Bullet = [];

// Função que chama a criação de bala.
function InitBullet(){
    var keyboard = new KeyboardState();
    if(keyboard.down("space") || keyboard.down('Q')){
        Bullet.push(CriaBala(tank_player1.object, tank_player2));
        scene.add(Bullet[Bullet.length-1].obj);
        BulletControl(Bullet);
    }
    if(keyboard.down("/") || keyboard.down(",")){
        Bullet.push(CriaBala(tank_player2.object, tank_player1));
        scene.add(Bullet[Bullet.length-1].obj);
        BulletControl(Bullet);
    }
}

// Função que controla a existência da bala.
function BulletControl(Bullet) {
    if (Bullet.length === 0){
        return 0;
    }
    else{
        Bullet.forEach((bullet, index) => {
            let remove = balaAnda(bullet);
            if(remove) { 
                scene.remove(bullet.obj);
                Bullet.splice(index, 1);
            };
        });
    }
}

// Criando o nível 1.
let nivel1 = [
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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],];
var [floor, wall] = CreateLevel(nivel1);
scene.add(floor);
scene.add(wall);

// Criando as propriedades da câmera.
let position = midPosition();
var camPosition = new THREE.Vector3(15, 40, -32);
var camUpPosition = new THREE.Vector3(0.0, 1.0, 0.0);
var camLookPosition = new THREE.Vector3(position[0], 5, position[1]);

// Setando a posição da câmera principal.
camera.position.copy(camPosition);
camera.up.copy(camUpPosition);
camera.lookAt(camLookPosition);

// Habilitando e desabilitando o OrbitControls.
function swapOrbitControls() {
    keyboard.update();
    if( keyboard.down("O") ) {
        orbitControls.enabled = !orbitControls.enabled;
        if(orbitControls.enabled) {
            camPosition = camera.position.clone();
        }
        if(!orbitControls.enabled) {
            console.log(camUpPosition);
            camera.position.copy(camPosition);
            camera.lookAt(camLookPosition);
        }
    }
}

// Calculando a posição média entre os tanques e a distância entre eles.
function midPosition() {
    let position1 = new THREE.Vector3();
    let position2 = new THREE.Vector3();
    tank_player1.object.getWorldPosition(position1);
    tank_player2.object.getWorldPosition(position2);
    let midX = (position1.x + position2.x)/2;
    let midZ = (position1.z + position2.z)/2;
    let dist = Math.sqrt(
            (position2.x - position1.x)*(position2.x - position1.x) + 
            (position2.z - position1.z)*(position2.z - position1.z)
        );
    return [midX, midZ, dist];
}

// Função de atualização da câmera.
function updateCamera() {
    let initView = window.innerWidth / window.innerHeight;
    if(!orbitControls.enabled) {
        let position = midPosition();
        camLookPosition.set(position[0], 5, position[1]);
        camPosition.set(position[0] + (63 / initView), position[2]/3 + (21 / initView), position[1]);

        camera.position.copy(camPosition);
        camera.lookAt(camLookPosition);
    }
};

render();
function render() {
    play(end());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};