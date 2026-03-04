const canvas = document.getElementById('canvasID');
const startDivRef = document.getElementById('startDivID');
const outroDivRef = document.getElementById('outroDivID');
const woodSignRef = document.getElementById('woodSignID');
let controlsWoodSign = false;
let soundsWoodSign = false;
let world;
let keyboard;

function toggleFullscreen() {
    let container = document.querySelector('.game-container'); // Wir nehmen den gesamten Container
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
    woodSignRef.classList.toggle('visible');
    soundsWoodSign = !soundsWoodSign;
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

function restartGame(){
    console.log('restart Game');
    startDivRef.classList.remove('vis-none');
    outroDivRef.classList.add('vis-none');
    canvas.classList.add('vis-none');
    woodSignRef.classList.remove('visible');
    world = null;
}

function controlsTemplate() {
    woodSignRef.innerHTML = `
     <h2>Controls</h2>
     <p>Left: a / ←</p >
     <p>Right: d / →</p>
     <p>Jump: space / w/ ↑</p>
     <p>Throw Bottle: q</p>
     <p>Attack: LMB / e</p>`
}
function soundsTemplate() {
    woodSignRef.innerHTML = `
     <h2>Sound</h2>
         <div class="sound-controller">
             <span>General</span><input type="range" min="1" max="100" value="50">
         </div>
         <div class="sound-controller">
             <span>Music</span><input type="range" min="1" max="100" value="50">
         </div>
         <div class="sound-controller">
             <span>Effects</span><input type="range" min="1" max="100" value="50">
         </div>`
}


