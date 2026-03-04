const canvas = document.getElementById('canvasID');
const startDivRef = document.getElementById('startDivID');
const outroDivRef = document.getElementById('outroDivID');
const woodSignRef = document.getElementById('woodSignID');
let controlsWoodSign = false;
let soundsWoodSign = false;
let world;
let keyboard;
let volSettings = { general: 0.5, music: 0.5, effects: 0.5};

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

function processControlsClick() {
    if (soundsWoodSign) {
        woodSignRef.classList.remove('visible');
        soundsWoodSign = false;
        setTimeout(() => {
            openControlsSign();
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
    if (controlsWoodSign) {
        woodSignRef.classList.remove('visible');
        controlsWoodSign = false;
        setTimeout(() => {
            openSoundsSign();
        }, 300);
    } else {
        openSoundsSign();
    }
}

function openSoundsSign() {
    soundsTemplate();
    requestAnimationFrame(() => {
        document.getElementById('generalInputID').addEventListener('input', updateVolume);
        document.getElementById('musicInputID').addEventListener('input', updateVolume);
        document.getElementById('soundInputID').addEventListener('input', updateVolume);
    })
    woodSignRef.classList.toggle('visible');
    soundsWoodSign = !soundsWoodSign;
}

function updateVolume() {
    volSettings.general = document.getElementById('generalInputID').value / 100;
    volSettings.music = document.getElementById('musicInputID').value / 100;
    volSettings.effects = document.getElementById('soundInputID').value / 100;
    let generalFactor = 0.3;
    if (music) {
        music.volume = volSettings.music * volSettings.general * generalFactor;
    }
    Object.keys(soundFiles).forEach(soundName => {
        {
            let audioObject = window[soundName];
            if (audioObject) {
                audioObject.volume = volSettings.effects * volSettings.general * generalFactor;
            }
        }
    });
}

function startGame() {
    woodSignRef.classList.remove('visible');
    startDivRef.classList.add('vis-none');
    canvas.classList.remove('vis-none');
    keyboard = new KeyboardInput();
    music.play();
    world = new World(canvas, keyboard);
    world.gameLoop();
}

function setOutroDiv(outcome) {
    const outroImageRef = document.getElementById('outroImageID');
    if (outcome === 'lost') {
        console.log('you lost');
        outroImageRef.src = './img/9_intro_outro_screens/game_over2.png';
    }
    if (outcome === 'won') {
        outroImageRef.src = './img/9_intro_outro_screens/you_win.png';
        console.log('you won');
    }
    setTimeout(() => {
        woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top_small2.png)';
        woodSignRef.style.paddingTop = '9%'
        woodSignRef.innerHTML = `<h3 class="restart-button" onclick="restartGame()">Return</h3>`
        woodSignRef.classList.add('visible');
    }, 1000);
}

function restartGame() {
    console.log('restart Game');
    startDivRef.classList.remove('vis-none');
    outroDivRef.classList.add('vis-none');
    canvas.classList.add('vis-none');
    woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top2.png)';
    woodSignRef.style.paddingTop = '16%'
    woodSignRef.classList.remove('visible');
    world = null;
}

function controlsTemplate() {
    woodSignRef.innerHTML = `
     <h2>Controls</h2>
     <div><p>Left: <span class="key-box"> A</span>  <span class="key-box"> ←</span></p>
     <p>Right: <span class="key-box"> D</span>  <span class="key-box"> →</span></p>
     <p>Jump: <span class="key-box"> Space</span> <span class="key-box"> W</span> <span class="key-box"> ↑</span></p>
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


