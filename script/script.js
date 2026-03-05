const canvas = document.getElementById('canvasID');
const startDivRef = document.getElementById('startDivID');
const outroDivRef = document.getElementById('outroDivID');
const woodSignRef = document.getElementById('woodSignID');
const mobileControlsRef = document.getElementById('mobileControls');
const iconRefs = {
    settings: document.getElementById('settingsIconID'),
    touch: document.getElementById('touchIconID'),
    sound: document.getElementById('soundIconID'),
    fullscreen: document.getElementById('fullscreenIconID')
};
let settingsOpen = false;
let controlsWoodSign = false;
let soundsWoodSign = false;
let settingsWoodSign = false;
let world;
let keyboard;
let volSettings = { general: 0.5, effects: 0.5, music: 0.5, soundMuted: false };
let volSettingsCopy = {};

function loadVolSettings() {
    let savedData = localStorage.getItem('gameSoundSettings');
    if (savedData) {
        volSettings = JSON.parse(savedData);
        updateVolume();
    }
}

function toggleFullscreen() {
    let container = document.querySelector('.game-container');
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) { /* Safari */
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) { /* IE11 */
            container.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function registerClick(icon) {
    iconRefs[icon].classList.add('inverted-color');
}

function resetClick(icon) {
    iconRefs[icon].classList.remove('inverted-color');
}

function openSettings() {
    if (controlsWoodSign || soundsWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openSettingsSign();
            controlsWoodSign = false;
            soundsWoodSign = false;
        }, 300);
    } else {
        openSettingsSign();
    }
}

function openSettingsSign() {
    settingsTemplate();
    woodSignRef.classList.toggle('visible');
    settingsWoodSign = !settingsWoodSign;
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

function processControlsClick() {
    if (soundsWoodSign || settingsWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openControlsSign();
            soundsWoodSign = false;
            settingsWoodSign = false;
        }, 300);
    } else {
        openControlsSign();
    }
}

function openControlsSign() {
    controlsTemplate();
    woodSignRef.classList.toggle('visible');
    controlsWoodSign = !controlsWoodSign;
}

function processSoundsClick() {
    if (controlsWoodSign || settingsWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openSoundsSign();
            controlsWoodSign = false;
            settingsWoodSign = false;
        }, 300);
    } else {
        openSoundsSign();
    }
}

function openSoundsSign() {
    soundsTemplate();
    requestAnimationFrame(() => {
        document.getElementById('generalInputID').addEventListener('input', getVolume);
        document.getElementById('musicInputID').addEventListener('input', getVolume);
        document.getElementById('soundInputID').addEventListener('input', getVolume);
    })
    woodSignRef.classList.toggle('visible');
    soundsWoodSign = !soundsWoodSign;
}

function getVolume() {
    volSettings.general = document.getElementById('generalInputID').value / 100;
    volSettings.music = document.getElementById('musicInputID').value / 100;
    volSettings.effects = document.getElementById('soundInputID').value / 100;
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

function startGame() {
    woodSignRef.classList.remove('visible');
    controlsWoodSign = false;
    settingsWoodSign = false;
    soundsWoodSign = false;
    iconRefs.settings.classList.remove('dis-none');
    startDivRef.classList.add('dis-none');
    canvas.classList.remove('dis-none');
    keyboard = new KeyboardInput();
    if (isMobileDevice()) {
        mobileControlsRef.classList.remove('dis-none');
        iconRefs.touch.classList.remove('dis-none');
    }
    music.play();
    loadVolSettings();
    world = new World(canvas, keyboard);
    world.gameLoop();
}

function setOutroDiv(outcome) {
    const outroImageRef = document.getElementById('outroImageID');
    if (outcome === 'lost') outroImageRef.src = './img/9_intro_outro_screens/game_over2.png';
    if (outcome === 'won') outroImageRef.src = './img/9_intro_outro_screens/you_win.png';
    setTimeout(() => {
        showReturnSign();
    }, 1000);
}

function showReturnSign() {
    woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top_small2.png)';
    woodSignRef.style.paddingTop = '9%'
    woodSignRef.innerHTML = `<h3 class="restart-button" onclick="restartGame()">Return</h3>`
    woodSignRef.classList.add('visible');

}

function restartGame() {
    console.log('restart Game');
    startDivRef.classList.remove('dis-none');
    outroDivRef.classList.add('dis-none');
    canvas.classList.add('dis-none');
    woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top2.png)';
    woodSignRef.style.paddingTop = '16%'
    woodSignRef.classList.remove('visible');
    if (world) {
        world.stopGame();
    }
    world = null;
}

function addMobileEvents() {
    const btnIds = {
        'btnLeft': 'left',
        'btnRight': 'right',
        'btnJump': 'up',
        'btnAttack': 'attack',
        'btnThrow': 'throw'
    };
    Object.keys(btnIds).forEach(id => {
        const element = document.getElementById(id);
        const key = btnIds[id];
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[key] = true;
        });
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[key] = false;
        });
    });
}

function isMobileDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

function setupMobileControls() {
    if (isMobileDevice()) {
        mobileControlsRef.innerHTML = `
            <div class="move-controls">
                <p id="btnLeft" class="key-box">←</p>
                <p id="btnRight" class="key-box">→</p>
            </div>
            <div class="action-controls">
                <p id="btnThrow" class="key-box">Q</p>
                <p id="btnAttack" class="key-box">E</p>
                <p id="btnJump" class="key-box">↑</p>
            </div>
        `;
        // bindMobileEvents();
    }
}

function controlsTemplate() {
    woodSignRef.innerHTML = `
     <h2>Controls</h2>
     <div><p>Left: <span class="key-box"> A</span>  <span class="key-box bold"> ←</span></p>
     <p>Right: <span class="key-box"> D</span>  <span class="key-box bold"> →</span></p>
     <p>Jump: <span class="key-box"> Space</span> <span class="key-box"> W</span> <span class="key-box bold"> ↑</span></p>
     <p>Throw Bottle: <span class="key-box">Q</span></p>
     <p>Attack: <span class="key-box">LMB</span> <span class="key-box">E</span></p>`
}

function soundsTemplate() {
    woodSignRef.innerHTML = `
     <h2>Sound</h2>
         <div class="sound-controller">
             <span>General</span><input id="generalInputID" type="range" min="0" max="100" value="${volSettings.general * 100}">
         </div>
         <div class="sound-controller">
             <span>Music</span><input id="musicInputID" type="range" min="0" max="100" value="${volSettings.music * 100}">
         </div>
         <div class="sound-controller">
             <span>Effects</span><input id="soundInputID" type="range" min="0" max="100" value="${volSettings.effects * 100}">
         </div>`
}

function settingsTemplate() {
    woodSignRef.innerHTML = `
             <h2>Settings</h2>
             <div class="quick-settings">
             <p onclick="processSoundsClick()">Sounds</p>
             <p onclick="processControlsClick()">Controls</p>
             <p onclick="restartGame()">Return to Mainpage</p>
             </div>
             `
}

