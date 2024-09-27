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
    DamagePLayerBullet.setVolume(volume * 1);
    DamageEnemy.setVolume(volume * 1);
}

// Criação dos objetos de som
const Music = new THREE.Audio(listener);
const PlayerBullet = new THREE.Audio(listener);
const DamagePLayerBullet = new THREE.Audio(listener);
const DamageEnemy = new THREE.Audio(listener);
const Gate = new THREE.Audio(listener);

// Carregando a Música
audioLoader.load('./audio/GameMusic.mp3', function (buffer) {
    Music.setBuffer(buffer);
    Music.setLoop(true); // Música de fundo em loop
    Music.setVolume(0.5); // Volume da música de fundo ajustado
    Music.play(); // Tocar música de fundo automaticamente
});

// Carregando o som do Tiro do Canhão
audioLoader.load('./audio/TiroTank.mp3', function (buffer) {
    PlayerBullet.setBuffer(buffer);
    PlayerBullet.setLoop(false);
});

// Carregando o som do Dano no Player
audioLoader.load('./audio/AtingiuPlayer.mp3', function (buffer) {
    DamagePLayerBullet.setBuffer(buffer);
    DamagePLayerBullet.setLoop(false);
});

// Carregando o som do Dano no Inimigo
audioLoader.load('./audio/AtingiuEnemy.mp3', function (buffer) {
    DamageEnemy.setBuffer(buffer);
    DamageEnemy.setLoop(false);
});

// Carregando o som do Portão
audioLoader.load('./audio/PortãoCortado.mp3', function (buffer) {
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
        newBulletSound.setBuffer(DamagePLayerBullet.buffer);
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(isMuted ? 0 : volume); // Verifica se está mutado
        newBulletSound.play();
    } else if (id === 3) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(DamageEnemy.buffer);
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

export function audioOff() {
    toggleMute(); // Alterna audio.
};