import * as THREE from 'three';

// Criação do listener de áudio
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

// Variável que controla se o áudio está mutado ou não
let isMuted = false;

// Função para alternar o estado de mute
function toggleMute() {
    isMuted = !isMuted;
    // Atualiza os volumes de acordo com o estado de mute
    const volume = isMuted ? 0 : 1; // 0 para mutado, 1 para desmutado (pode ser ajustado conforme necessário)
    Music.setVolume(volume * 0.5); // Multiplica pelo volume original
    PlayerBullet.setVolume(volume * 1);
    EnemiesBullet.setVolume(volume * 1);
    DamageBullet.setVolume(volume * 1);
}

// Criação dos objetos de som
const Music = new THREE.Audio(listener);
const PlayerBullet = new THREE.Audio(listener);
const EnemiesBullet = new THREE.Audio(listener);
const DamageBullet = new THREE.Audio(listener);
const Gate = new THREE.Audio(listener);

// Carregando a Música
audioLoader.load('./audio/Music.mp3', function (buffer) {
    Music.setBuffer(buffer);
    Music.setLoop(true); // Música de fundo em loop
    Music.setVolume(0.5); // Volume da música de fundo ajustado
    Music.play(); // Tocar música de fundo automaticamente
});

// Carregando o som do Player
audioLoader.load('./audio/Player.mp3', function (buffer) {
    PlayerBullet.setBuffer(buffer);
    PlayerBullet.setLoop(false);
});

// Carregando o som do Inimigo
audioLoader.load('./audio/Inimigo.mp3', function (buffer) {
    EnemiesBullet.setBuffer(buffer);
    EnemiesBullet.setLoop(false);
});

// Carregando o som do Dano
audioLoader.load('./audio/TomouTiro.mp3', function (buffer) {
    DamageBullet.setBuffer(buffer);
    DamageBullet.setLoop(false);
});

// Carregando o som do Portão
audioLoader.load('./audio/Portão.mp3', function (buffer) {
    Gate.setBuffer(buffer);
    Gate.setLoop(false);
})

// Função para tocar o áudio
export function PlayAudio(id, volume = 1) {
    if (id === 0) {
        if (!Music.isPlaying) {
            Music.play();
        }
    } else if (id === 1) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(PlayerBullet.buffer);
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(isMuted ? 0 : volume); // Verifica se está mutado
        newBulletSound.play();
    } else if (id === 2) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(EnemiesBullet.buffer);
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(isMuted ? 0 : volume); // Verifica se está mutado
        newBulletSound.play();
    } else if (id === 3) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(DamageBullet.buffer);
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(isMuted ? 0 : volume); // Verifica se está mutado
        newBulletSound.play();
    }  else if (id === 4) {
        const newGateSound = new THREE.Audio(listener);
        newGateSound.setBuffer(Gate.buffer);
        newGateSound.setLoop(false);
        newGateSound.setVolume(isMuted ? 0 : volume); // Verifica se está mutado
        newGateSound.play();
    }
    
}

// Listener para a tecla 'P' para alternar mute/desmute
window.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'p') {
        toggleMute(); // Alterna entre mute e desmute ao pressionar 'P'
    }
});
