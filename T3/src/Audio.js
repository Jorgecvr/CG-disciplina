import * as THREE from 'three';

// Criação do listener de áudio
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

// Criação do objeto de som
const Music = new THREE.Audio(listener);
const PlayerBullet = new THREE.Audio(listener);
const EnemiesBullet = new THREE.Audio(listener);
const DamageBullet = new THREE.Audio(listener);

// Carregando a Música
audioLoader.load('./audio/Music.mp3', function (buffer) {
    Music.setBuffer(buffer);
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


// Função para tocar o áudio
export function PlayAudio(id, volume = 1) {
    if(id === 0){
        if (!Music.isPlaying) {
            Music.play();
        }
    }
    else if (id === 1) {
        // Cria uma nova instância para permitir sobreposição
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(PlayerBullet.buffer); 
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(volume); 
        newBulletSound.play();
    }
    else if(id === 2) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(EnemiesBullet.buffer); 
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(volume); 
        newBulletSound.play();
    }
    else if(id === 3) {
        const newBulletSound = new THREE.Audio(listener);
        newBulletSound.setBuffer(DamageBullet.buffer); 
        newBulletSound.setLoop(false);
        newBulletSound.setVolume(volume); 
        newBulletSound.play();
    }
}
