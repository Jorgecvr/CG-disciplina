// Importações básicas.
import * as THREE from 'three';
import { initRenderer } from '../libs/util/util.js';
import KeyboardState from '../libs/util/KeyboardState.js';

// Importações de arquivos criados para o trabalho.
import { Tank } from './src/Tank.js';
import { CreateLevel } from './src/Levels.js';
import { Camera } from './src/Camera.js';
import { Light } from './src/Light.js';
import { UpdateEnemies } from './src/Enemies.js';
import { Cannon } from './src/Cannon.js';
import { CannonControl } from './src/CannonControl.js';

import { CriaBala, BalaAnda } from './src/Bullet.js';
import { PlayAudio } from './src/Audio.js';

import { spawnPowerUp, animatePowerUps, checkPlayerCollisionPower } from './src/PowerUp.js';

// Declaração de variáveis úteis.
var scene = new THREE.Scene();                      // Criando a main scene.
var renderer = initRenderer("rgb(30, 30, 42)");     // Iniciando o renderer básico.
var camera = new Camera(renderer);                  // Criando a câmera.
camera.camera.position.set(10, 60, 70);
camera.camera.lookAt(10, 0, 25);

// Variáveis para controlar o estado do jogo.
var gameStarted = false;
var gameEnded = false;

// Funções de ínicio e fim de jogo.
function startGame() {
    gameStarted = true;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('webgl-output').style.display = 'block';
};
function endGame() {
    gameEnded = true;
    document.getElementById('webgl-output').style.display = 'none';
    document.getElementById('end-screen').style.display = 'flex';
};

// Lógicas dos botões "START" e "RESTART".
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});

let spawnZone = null;
 
// Adicionando a skybox.
const textureLoader = new THREE.TextureLoader();
let textureEquirec = textureLoader.load('./assets/textures/skybox.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec;

// Luz ambiente geral.
var ambientLight = new THREE.AmbientLight("rgb(30, 30, 30)");   
    ambientLight.castShadow = false;
    scene.add(ambientLight);

// Vetor Balas.
var Bullet = [];

// Luzes direcionais.
var directionalLight1;
var directionalLight2;
var directionalLight3;

// Array para as luminárias.
var spotLights = [];

// Criando o player.
var player;

// Variáveis para os tanques inimigos.
var enemy1;
var enemy2;
var enemy3;
var enemy4;
var enemy5;
var enemy6;

// Variável para armazenar o canhão.
var cannon;
var cannonControl; // Iniciando o controle do canhão.

// Variáveis para controle de tempo do canhão.
var interval = 3000; // 3 segundos.
var lastTime = 0;
var shoot = false;

// Armazena o tipo do nível atual (começa em 1).
var levelType = 1;                                  
var levelType = 1;                                  
var level1 = CreateLevel(1);     // Criando o nível 1.
var level2 = CreateLevel(2);     // Criando o nível 2.
var level3 = CreateLevel(3);     // Criando o nível 3.

// Armazena os blocos a serem revelados ou retirados gradualmente.
var blocksToReveal = [];
var blocksToRemove = [];

// Função que carrega os níveis.
function loadLevels(level, resetPlayer) {
    if(level === 1) {
        scene.add(level1);
    
        if(resetPlayer) {
            player = new Tank(1, true);
            player.object.position.set(10, 0, 34);
            player.object.rotateY(THREE.MathUtils.degToRad(180));
            player.lifeBar.position.set(player.object.position.x, player.object.position.y + 5, player.object.position.z);
            player.lifeBar.scale.set(player.life/1000, player.lifeBar.scale.y, player.lifeBar.scale.z);
        }

        enemy1 = new Tank(2, false);
        enemy1.object.position.set(54, 0, 34);
        enemy1.object.rotateY(THREE.MathUtils.degToRad(180));
        enemy1.lifeBar.position.set(enemy1.object.position.x, enemy1.object.position.y + 5, enemy1.object.position.z);
        enemy1.lifeBar.scale.set(enemy1.life/1000, enemy1.lifeBar.scale.y, enemy1.lifeBar.scale.z);

        UpdateEnemies();

        // Luz direcional do nível 1.
        directionalLight1 = new THREE.DirectionalLight("white", 0.5);
        directionalLight1.position.set(-10, 50, -10);
        scene.add(directionalLight1);
        scene.add(directionalLight1.target);
        directionalLight1.target.position.set(32, 2, 21);
        directionalLight1.castShadow = true;

        // Definindo o mapa de sombras do primeiro nível.
        const shadow1 = directionalLight1.shadow;
        shadow1.mapSize.width = 1024;
        shadow1.mapSize.height = 1024;
        shadow1.camera.near = 1;
        shadow1.camera.far = 120;
        shadow1.camera.left = -100;
        shadow1.camera.right = 100;
        shadow1.camera.bottom = -100;
        shadow1.camera.top = 100;
        
        if(resetPlayer) {
            scene.add(player.object);
            scene.add(player.lifeBar);
        }
        scene.add(enemy1.object);
        scene.add(enemy1.lifeBar);
    }
    if(level === 2) {
        level2.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.visible = false;
                blocksToReveal.push(child);
            }
        });

        scene.add(level2);
        
        if(resetPlayer) {
            player = new Tank(1, true);
            player.object.position.set(92, 0, 8);
            player.lifeBar.position.set(player.object.position.x, player.object.position.y + 5, player.object.position.z);
            player.lifeBar.scale.set(player.life/1000, player.lifeBar.scale.y, player.lifeBar.scale.z);
        }

        enemy2 = new Tank(1, false);
        enemy2.object.position.set(144, 0, 34);
        enemy2.object.rotateY(THREE.MathUtils.degToRad(180));
        enemy2.lifeBar.position.set(enemy2.object.position.x, enemy2.object.position.y + 5, enemy2.object.position.z);
        enemy2.lifeBar.scale.set(enemy2.life/1000, enemy2.lifeBar.scale.y, enemy2.lifeBar.scale.z);

        enemy3 = new Tank(2, false);
        enemy3.object.position.set(144, 0, 10);
        enemy3.object.rotateY(THREE.MathUtils.degToRad(-90));
        enemy3.lifeBar.position.set(enemy3.object.position.x, enemy3.object.position.y + 5, enemy3.object.position.z);
        enemy3.lifeBar.scale.set(enemy3.life/1000, enemy3.lifeBar.scale.y, enemy3.lifeBar.scale.z);

        // Inserindo a luz direcional
        directionalLight2 = new THREE.DirectionalLight("rgb(80, 80, 80)", 2);
        directionalLight2.position.copy(new THREE.Vector3(2, 1, 1));
        directionalLight2.castShadow = false;
        scene.add(directionalLight2);

        // Inserindo os spotLights.
        // Luminária 1.
        let spotLight1 = new Light();
        spotLight1.object.position.set(150, 0.2, 42);
        spotLight1.object.rotateY(THREE.MathUtils.degToRad(135));
        spotLight1.spotLight.position.set(147.3, 21.8, 39.3);
        spotLight1.spotLight.target.position.set(141, 0.2, 32);
        spotLight1.spotLight.target.updateMatrixWorld();
        scene.add(spotLight1.object);
        scene.add(spotLight1.spotLight);
        spotLights.push(spotLight1);

        // Luminária 2.
        let spotLight2 = new Light();
        spotLight2.object.position.set(86, 0.2, 2);
        spotLight2.object.rotateY(THREE.MathUtils.degToRad(-45));
        spotLight2.spotLight.position.set(88.8, 21.8, 4.8);
        spotLight2.spotLight.target.position.set(95, 0.2, 11);
        spotLight2.spotLight.target.updateMatrixWorld();
        scene.add(spotLight2.object);
        scene.add(spotLight2.spotLight);
        spotLights.push(spotLight2);

        // Luminária 3.
        let spotLight3 = new Light();
        spotLight3.object.position.set(118, 0.2, 42.7);
        spotLight3.object.rotateY(THREE.MathUtils.degToRad(90));
        spotLight3.spotLight.position.set(118, 21.8, 38.9);
        spotLight3.spotLight.target.position.set(118, 0.2, 34.5);
        spotLight3.spotLight.target.updateMatrixWorld();
        spotLight3.spotLight.angle = THREE.MathUtils.degToRad(24);
        scene.add(spotLight3.object);
        scene.add(spotLight3.spotLight);
        spotLights.push(spotLight3);

        // Luminária 4.
        let spotLight4 = new Light();
        spotLight4.object.position.set(118, 0.2, 1.3);
        spotLight4.object.rotateY(THREE.MathUtils.degToRad(-90));
        spotLight4.spotLight.position.set(118, 21.8, 5.2);
        spotLight4.spotLight.target.position.set(118, 0.2, 9.5)
        spotLight4.spotLight.target.updateMatrixWorld();
        spotLight4.spotLight.angle = THREE.MathUtils.degToRad(24);
        scene.add(spotLight4.object);
        scene.add(spotLight4.spotLight);
        spotLights.push(spotLight4);

        // Inserindo Canhão em cena.
        cannon = new Cannon();
        cannon.object.scale.multiplyScalar(1.5);
        cannon.object.position.set(118, 3, 22);
        scene.add(cannon.object);

        // Inicializando o controle do canhão após a definição do canhão.
        cannonControl = new CannonControl(cannon, [player, enemy2, enemy3]);

        UpdateEnemies();

        if(resetPlayer) {
            scene.add(player.object);
            scene.add(player.lifeBar);
        }
        scene.add(enemy2.object);
        scene.add(enemy2.lifeBar);
        scene.add(enemy3.object);
        scene.add(enemy3.lifeBar);
    }
    else if(level === 3) {
        level3.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.visible = false;
                blocksToReveal.push(child);
            }
        });

        scene.add(level3);

        if(resetPlayer) {
            player = new Tank(1, true);
            player.object.position.set(182, 0, 20);
            player.object.rotateY(THREE.MathUtils.degToRad(90));
            player.lifeBar.position.set(player.object.position.x, player.object.position.y + 5, player.object.position.z);
            player.lifeBar.scale.set(player.life/1000, player.lifeBar.scale.y, player.lifeBar.scale.z);
        }

        enemy4 = new Tank(3, false);
        enemy4.object.position.set(208, 0, 0);
        enemy4.lifeBar.position.set(enemy4.object.position.x, enemy4.object.position.y + 5, enemy4.object.position.z);
        enemy4.lifeBar.scale.set(enemy4.life/1000, enemy4.lifeBar.scale.y, enemy4.lifeBar.scale.z);

        enemy5 = new Tank(4, false);
        enemy5.object.position.set(228, 0, 38);
        enemy5.object.rotateY(THREE.MathUtils.degToRad(180));
        enemy5.lifeBar.position.set(enemy5.object.position.x, enemy5.object.position.y + 5, enemy5.object.position.z);
        enemy5.lifeBar.scale.set(enemy5.life/1000, enemy5.lifeBar.scale.y, enemy5.lifeBar.scale.z);
        
        enemy6 = new Tank(2, false);
        enemy6.object.position.set(248, 0, 0);
        enemy6.lifeBar.position.set(enemy6.object.position.x, enemy6.object.position.y + 5, enemy6.object.position.z);
        enemy6.lifeBar.scale.set(enemy6.life/1000, enemy6.lifeBar.scale.y, enemy6.lifeBar.scale.z);

        UpdateEnemies();

        // Luz direcional do nível 3.
        directionalLight3 = new THREE.DirectionalLight("white", 0.6);
        directionalLight3.position.set(160, 50, -16);
        scene.add(directionalLight3);
        scene.add(directionalLight3.target);
        directionalLight3.target.position.set(216, 2, 18);
        directionalLight3.castShadow = true;

        // Definindo o mapa de sombras do primeiro nível.
        const shadow = directionalLight3.shadow;
        shadow.mapSize.width = 1024;
        shadow.mapSize.height = 1024;
        shadow.camera.near = 1;
        shadow.camera.far = 200;
        shadow.camera.left = -200;
        shadow.camera.right = 200;
        shadow.camera.bottom = -200;
        shadow.camera.top = 200;

        if(resetPlayer) {
            scene.add(player.object);
            scene.add(player.lifeBar);
        }

        scene.add(enemy4.object);
        scene.add(enemy4.lifeBar);
        scene.add(enemy5.object);
        scene.add(enemy5.lifeBar);
        scene.add(enemy6.object);
        scene.add(enemy6.lifeBar);
    }
};

// Função que descarrega os níveis.
function unloadLevels(level, loadLevel, resetPlayer, resetLevel) {

    if(resetPlayer) {
        scene.remove(player.object);
        scene.remove(player.lifeBar);
    }
    if(level === 1) {
        level1.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                blocksToRemove.push(child);
            }
        });

        scene.remove(enemy1.object);
        scene.remove(enemy1.lifeBar);

        Bullet.forEach((bullet) => {
            scene.remove(bullet.obj);
        });

        scene.remove(directionalLight1);
    }
    else if(level === 2) {
        level2.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                blocksToRemove.push(child);
            }
        });

        scene.remove(enemy2.object);
        scene.remove(enemy2.lifeBar);
        scene.remove(enemy3.object);
        scene.remove(enemy3.lifeBar);

        Bullet.forEach((bullet) => {
            scene.remove(bullet.obj);
        });

        scene.remove(directionalLight2);

        spotLights.forEach((spot) => {
            scene.remove(spot.spotLight);
            scene.remove(spot.object);
        });

        scene.remove(cannon.object);
    }
    else if(level === 3) {
        level3.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                blocksToRemove.push(child);
            }
        });

        scene.remove(enemy4.object);
        scene.remove(enemy4.lifeBar);
        scene.remove(enemy5.object);
        scene.remove(enemy5.lifeBar);
        scene.remove(enemy6.object);
        scene.remove(enemy6.lifeBar);

        Bullet.forEach((bullet) => {
            scene.remove(bullet.obj);
        });
    }

    if(resetLevel) {
        loadLevels(loadLevel, resetPlayer);
    }
};

// Redimensionamento da câmera utilizando zoom.
var zoom = 1;
var lastWidth = window.innerWidth;
window.addEventListener('resize', function() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.camera.aspect = aspect;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(lastWidth < window.innerWidth) {
        zoom += (window.innerWidth - lastWidth)*0.0007;
    } else if(lastWidth > window.innerWidth) {
        zoom -= (lastWidth - window.innerWidth)*0.0007;
    }
    camera.camera.zoom = zoom;
    camera.camera.updateProjectionMatrix();
    lastWidth = window.innerWidth;
});

// Adicionando evento que detecta o scrool do mouse.
window.addEventListener('wheel', function(event) {
    camera.handleUpdate(event);
});

// Função para setar cor do Projetil
let Color = null;
export function gotSecondPowerUp() {
    Color = 0xFFFF00;
    setTimeout(() => {
        Color = 0xFFFFFF;
    }, 10000); //  10 segundos 
};



// Função para verificar o pressionamento de teclas.
function keyboardPress() {
    let keyboard = new KeyboardState();
    keyboard.update();

    // Mudaça do OrbitControls da Câmera.
    if(keyboard.down("O")) {
        camera.swapOrbitControls();
    }
    if(keyboard.down("G")){
        player.godMode();
    }
    if(keyboard.down("space")) {
        if( levelType == 1){
            Bullet.push(CriaBala(player.object, enemy1, enemy1, enemy1, 1, 0, null, Color));
            scene.add(Bullet[Bullet.length-1].obj);
            PlayAudio(1);
        }
        else if(levelType == 3){
            Bullet.push(CriaBala(player.object, enemy2, enemy3, cannon, 2, 0, null, Color));
            scene.add(Bullet[Bullet.length-1].obj);
            PlayAudio(1);
        }
        else if(levelType == 5){
            Bullet.push(CriaBala(player.object, enemy4, enemy5, enemy6, 3, 0, null, Color));
            scene.add(Bullet[Bullet.length-1].obj);
            PlayAudio(1, 0.5);
        }
    }
};

// Função de atualização dos níveis.
function updateLevels() {
    if(player.object.position.x > 68.5 && player.object.position.x < 88) {
        if(levelType === 1) {
            levelType = 2;
            moveGates[1] = 1;
        }
    }
    else if(player.object.position.x > 88 && player.object.position.x < 156.5) {
        if(levelType === 2) {
            levelType = 3;
            unloadLevels(1, 0, false, false);
        }
    }
    else if(player.object.position.x > 156.5 && player.object.position.x < 176.5) {
        if(levelType === 3) {
            levelType = 4;
            moveGates[3] = 1; 
        }
    }
    else if(player.object.position.x > 176.5) {
        if(levelType === 4) {
            levelType = 5;
            unloadLevels(2, 0, false, false);
        }
    }
};

var moveGates = [0, 0, 0, 0];
function updateGates() {
    // Portão 1, do mapa 1 para o 2.
    if(moveGates[0] === 1) {
        level1.children[2].position.y -= 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para baixo
    }
    if(moveGates[0] === 2 && levelType === 2) {
        level1.children[2].position.y += 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para cima
    }
    if(level1.children[2].position.y < -3.5) moveGates[0] = 2;
    if(level1.children[2].position.y > 0) moveGates[0] = 0;

    // Portão 2, do mapa 1 para o 2.
    if(moveGates[1] === 1) {
        level2.children[2].position.y -= 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para baixo
    }
    if(moveGates[1] === 2 && levelType === 3) {
        level2.children[2].position.y += 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para cima
    }
    if(level2.children[2].position.y < -3.5) moveGates[1] = 2;
    if(level2.children[2].position.y > 0) moveGates[1] = 0;

    // Portão 1, do mapa 2 para o 3.
    if(moveGates[2] === 1) {
        level2.children[3].position.y -= 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para baixo
    }
    if(moveGates[2] === 2 && levelType === 4) {
        level2.children[3].position.y += 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para cima
    }
    if(level2.children[3].position.y < -3.5) moveGates[2] = 2;
    if(level2.children[3].position.y > 0) moveGates[2] = 0;

    // Portão 3, do mapa 2 para o 3.
    if(moveGates[3] === 1) {
        level3.children[3].position.y -= 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para baixo
    }
    if(moveGates[3] === 2 && levelType === 5) {
        level3.children[3].position.y += 0.02;
        PlayAudio(4, 0.02); // Toca o som quando o portão se move para cima
    }
    if(level3.children[3].position.y < -3.5) moveGates[3] = 2;
    if(level3.children[3].position.y > 0) moveGates[3] = 0;
};

    
// Função de atualização das paredes móveis.
var wallsDirections = [0, 0, 0];
function updateMovingWalls() {
    // Definindo as velocidades das paredes móveis.
    let velMovingWall1 = 0.1;
    let velMovingWall2 = -0.05;
    let velMovingWall3 = 0.15;

    if(wallsDirections[0] == 1) {
        velMovingWall1 *= -1;
    }
    if(wallsDirections[1] == 1) {
        velMovingWall2 *= -1;
    }
    if(wallsDirections[2] == 1) {
        velMovingWall3 *= -1;
    }

    // Definindo constantes para as paredes móveis.
    const movingWall1 = level3.children[5];
    const movingWall2 = level3.children[6];
    const movingWall3 = level3.children[7];

    movingWall1.position.z += velMovingWall1;
    movingWall2.position.z += velMovingWall2;
    movingWall3.position.z += velMovingWall3;

    // Limita o movimento das paredes.
    if(movingWall1.position.z > 16) {
        wallsDirections[0] = 1;
    }
    if(movingWall1.position.z < -0.1) {
        wallsDirections[0] = 0;
    }
    if(movingWall2.position.z > 0.1) {
        wallsDirections[1] = 0;
    }
    if(movingWall2.position.z < -16) {
        wallsDirections[1] = 1;
    }
    if(movingWall3.position.z > 16) {
        wallsDirections[2] = 1;
    }
    if(movingWall3.position.z < -0.1) {
        wallsDirections[2] = 0;
    }
};

function BulletControl(Bullet) {
    if(levelType == 1) {
        if (Bullet.length === 0){
            return 0;
        }
        else{
            Bullet.forEach((bullet, index) => {
                let remove = BalaAnda(bullet);
                if(remove) { 
                    scene.remove(bullet.obj);
                    Bullet.splice(index, 1);
                };
            });
        }
    } else {
        if (Bullet.length === 0){
            return 0;
        }
        else{
            Bullet.forEach((bullet, index) => {
                let remove = BalaAnda(bullet);
                if(remove) { 
                    scene.remove(bullet.obj);
                    Bullet.splice(index, 1);
                };
            });
        }
    }
};

// Spawn dos powerups.
setInterval(() => {
    if(levelType == 1){
        spawnPowerUp(scene, 1);
    } else if(levelType == 3){
        spawnPowerUp(scene, 2);
    } else if(levelType == 5){
        spawnPowerUp(scene, 3);
    }
}, 11000); 

// Função play chamada na render atualiza a lógica do jogo.
function play() {
    keyboardPress();
    player.movePlayer(0, [level1, level2, level3]);
    player.lifeBar.position.set(player.object.position.x, player.object.position.y + 5, player.object.position.z);
    if(player.lifeBar.scale.x > 0) player.lifeBar.scale.set(player.life / 1000, player.lifeBar.scale.y, player.lifeBar.scale.z);

    // Verifica se o player morreu.
    if(player.getLife() === 0) {
        if(levelType === 1) {
            unloadLevels(1, 1, true, true);
        }
        else if(levelType === 3) {
            unloadLevels(2, 2, true, true);
        }
        else if(levelType === 5) {
            unloadLevels(3, 3, true, true);
        }
    }

    if(levelType === 1) {
        // Movimento do inimigo 1.
        // enemy1.movePlayer(1, [level1, level2, level3], player, Bullet, scene);

        // Atualiza as vidas dos tanques.
        enemy1.lifeBar.position.set(enemy1.object.position.x, enemy1.object.position.y + 5, enemy1.object.position.z);
        if(enemy1.lifeBar.scale.x > 0) enemy1.lifeBar.scale.set(enemy1.life / 1000, enemy1.lifeBar.scale.y, enemy1.lifeBar.scale.z);

        // Verifica se o inimigo 1 morreu.
        if(enemy1.getLife() <= 0) {
            enemy1.kill(scene);
            moveGates[0] = 1;
            loadLevels(2, false);
        }
    }
    else if(levelType === 3) {
        // Atualizando tempo de tiro.
        const currentTime = performance.now();
        shoot = false;
        if(currentTime - lastTime >= interval) {
            shoot = true;
            lastTime = currentTime;
        }

        // Atualizando a rotação do canhão.
        cannonControl.updateCannonRotation(Bullet, shoot, player, enemy2, enemy3, scene);

        // Movimentações dos inimigos.
        // enemy2.movePlayer(2, [level1, level2, level3], player, Bullet, scene, enemy3);
        // enemy3.movePlayer(3, [level1, level2, level3], player, Bullet, scene, enemy2);

        enemy2.lifeBar.position.set(enemy2.object.position.x, enemy2.object.position.y + 5, enemy2.object.position.z);
        if(enemy2.lifeBar.scale.x > 0) enemy2.lifeBar.scale.set(enemy2.life / 1000, enemy2.lifeBar.scale.y, enemy2.lifeBar.scale.z);
        
        enemy3.lifeBar.position.set(enemy3.object.position.x, enemy3.object.position.y + 5, enemy3.object.position.z);
        if(enemy3.lifeBar.scale.x > 0) enemy3.lifeBar.scale.set(enemy3.life / 1000, enemy3.lifeBar.scale.y, enemy3.lifeBar.scale.z);

        // Verifica se os inimigos 1 e 2 morreram.
        if(enemy2.getLife() === 0) {
            enemy2.kill(scene);
        }
        if(enemy3.getLife() === 0) {
            enemy3.kill(scene);
        }
        if(enemy2.isDead && enemy3.isDead) {
            moveGates[2] = 1;
            loadLevels(3, false);
            enemy2.isDead = enemy3.isDead = false;
        }
    }
    else if(levelType === 5) {
        // Movimentação dos tanques inimigos.
        // enemy4.movePlayer(4, [level1, level2, level3], player, Bullet, scene, enemy5, enemy6);
        // enemy5.movePlayer(5, [level1, level2, level3], player, Bullet, scene, enemy4, enemy6);
        // enemy6.movePlayer(6, [level1, level2, level3], player, Bullet, scene, enemy4, enemy5);

        enemy4.lifeBar.position.set(enemy4.object.position.x, enemy4.object.position.y + 5, enemy4.object.position.z);
        if(enemy4.lifeBar.scale.x > 0) enemy4.lifeBar.scale.set(enemy4.life / 1000, enemy4.lifeBar.scale.y, enemy4.lifeBar.scale.z);
        enemy5.lifeBar.position.set(enemy5.object.position.x, enemy5.object.position.y + 5, enemy5.object.position.z);
        if(enemy5.lifeBar.scale.x > 0) enemy5.lifeBar.scale.set(enemy5.life / 1000, enemy5.lifeBar.scale.y, enemy5.lifeBar.scale.z);
        enemy6.lifeBar.position.set(enemy6.object.position.x, enemy6.object.position.y + 5, enemy6.object.position.z);
        if(enemy6.lifeBar.scale.x > 0) enemy6.lifeBar.scale.set(enemy6.life / 1000, enemy6.lifeBar.scale.y, enemy6.lifeBar.scale.z);

        // Mexe as paredes móveis.
        updateMovingWalls();

        // Verifica se os inimigos morreram.
        if(enemy4.getLife() === 0) {
            enemy4.kill(scene);
        }
        if(enemy5.getLife() === 0) {
            enemy5.kill(scene);
        }
        if(enemy6.getLife() === 0) {
            enemy6.kill(scene);
        }

        if(enemy4.isDead && enemy5.isDead && enemy6.isDead) {
            endGame();
        }
    }

    camera.update(player.object.getWorldPosition(new THREE.Vector3));
    
    updateGates();
    updateLevels();

    // Atualiza a animação dos power-ups.
    animatePowerUps();

    // Verifica a colisão do jogador com power-ups.
    checkPlayerCollisionPower(player, scene);

    BulletControl(Bullet);

    if(blocksToReveal.length > 0) revealBlocks();
    if(blocksToRemove.length > 0) removeBlocks();
};

// Função que revela os blocos.
function revealBlocks() {
    // Quantos blocos revelar por frame.
    const blocksPerFrame = 2;

    for(let i = 0; i < blocksPerFrame; i++) {
        if(blocksToReveal.length > 0) {
            let block = blocksToReveal.shift(); // Retira o primeiro bloco da lista.
            
            block.visible = true;

            if(block.position.x == 116 || block.position.x == 120) {
                if(block.position.z == 20 || block.position.z == 24) {
                    if(block.position.y > 1) block.visible = false;
                }
            }
        } else {
            break;
        }
    }
};

// Função que remove os blocos.
function removeBlocks() {
    // Quantos blocos remover por frame.
    const blocksPerFrame = 2;

    for(let i = 0; i < blocksPerFrame; i++) {
        if(blocksToRemove.length > 0) {
            let block = blocksToRemove.shift(); // Retira o primeiro bloco da lista.
            
            block.visible = false;
        } else {
            break;
        }
    }
};

loadLevels(1, true);
render();
function render() {
    if(gameStarted) play();
    requestAnimationFrame(render);
    renderer.render(scene, camera.camera);
};