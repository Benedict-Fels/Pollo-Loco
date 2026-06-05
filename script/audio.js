
const soundFiles = {
    bossChickenDamageSound: './sound/bossChicken/chicken_hurt.mp3',
    bossChickenStompSound: './sound/bossChicken/stomp.mp3',
    eggCrackSound: './sound/bossChicken/egg_crack.mp3',
    chickenDeadSound: './sound/chicken_dead.mp3',
    bottleBreakSound: './sound/bottle_break.mp3',
    throwSound: './sound/throw.mp3',
    collectSound: './sound/collect.wav',
    characterHurtSound: './sound/character/character_damage.mp3',
    characterDeadSound: './sound/character/character_dead.wav',
    characterJumpSound: './sound/character/character_jump.mp3',
    characterAttackSound: './sound/character/swish_4.wav',
    characterSleepingSound: './sound/character/character_snoring.mp3'
}; 
Object.keys(soundFiles).forEach(key => {
    let audio = new Audio(soundFiles[key]); 
    window[key] = audio; 
    audio.volume = 0.15;
});

const music = new Audio('./sound/spagetti_western.ogg');
music.volume = 0.15;
music.loop = true;
let volSettings = { general: 0.5, effects: 0.5, music: 0.5, soundMuted: false };
let volSettingsCopy = {};
let musicStarted = false;

function loadVolSettings() {
    let savedData = localStorage.getItem('gameSoundSettings');
    if (savedData) {
        volSettings = JSON.parse(savedData);
        updateVolume();
    }
}

function processSoundClick() {
    if (volSettings.soundMuted) {
        unmuteSound();
    } else {
        muteSound();
    }
    updateSoundIcon();
}

function updateSoundIcon() {
    if (volSettings.soundMuted) iconRefs.sound.src = './img/12_icons/muted.png';
    else iconRefs.sound.src = './img/12_icons/volume.png';
}

function muteSound() {
    volSettingsCopy = {
        general: volSettings.general,
        music: volSettings.music,
        effects: volSettings.effects
    };
    volSettings.general = 0;
    volSettings.soundMuted = true;
    updateVolume();
}

function unmuteSound() {
    if (volSettingsCopy.general !== undefined) {
        volSettings.general = volSettingsCopy.general;
        volSettings.music = volSettingsCopy.music;
        volSettings.effects = volSettingsCopy.effects;
    } else {
        volSettings.general = 0.5;
    }
    volSettings.soundMuted = false;
    updateVolume();
}

function getVolume() {
    volSettings.general = document.getElementById('generalInputID').value / 100;
    volSettings.music = document.getElementById('musicInputID').value / 100;
    volSettings.effects = document.getElementById('soundInputID').value / 100;
    if (volSettings.general > 0){
        volSettings.soundMuted = false;
        updateSoundIcon();
    }
    updateVolume();
}

function updateVolume() {
    let generalFactor = 0.3;
    let gen = volSettings.general || 0;
    let mus = volSettings.music || 0;
    let eff = volSettings.effects || 0;
    if (music) {
        music.volume = mus * gen * generalFactor;
    }
    Object.keys(soundFiles).forEach(soundName => {
        let audioObject = window[soundName];
        if (audioObject) {
            audioObject.volume = eff * gen * generalFactor;
        }
    });
    saveSoundSettings();
}

function saveSoundSettings() {
    localStorage.setItem('gameSoundSettings', JSON.stringify(volSettings));
}

function startMusic() {
    if (!musicStarted) {
        music.play();
        musicStarted = true;
    }
}