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
let imprintWoodSign = false;
let settingsWoodSign = false;
let world;
let keyboard;
let debugMode = false;
let touchControl = false;

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

function startGame() {
    woodSignRef.classList.remove('visible');
    controlsWoodSign = false;
    settingsWoodSign = false;
    soundsWoodSign = false;
    imprintWoodSign = false;
    iconRefs.settings.classList.remove('dis-none');
    startDivRef.classList.add('dis-none');
    canvas.classList.remove('dis-none');
    keyboard = new KeyboardInput();
    if (isMobileDevice()) {
        setupMobileControls();
        addMobileEvents();
        mobileControlsRef.classList.remove('dis-none');
        iconRefs.touch.classList.remove('dis-none');
    }
    startMusic();
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
    }, 800);
}

function showReturnSign() {
    woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top_small2.png)';
    woodSignRef.style.paddingTop = '9%'
    woodSignRef.innerHTML = `<div class="dis-flex"><h3 class="restart-button" onclick="returnToMainpage()">Return</h3></div>`;
    woodSignRef.classList.add('visible');

}

function returnToMainpage() {
    console.log('returning to main page');
    startDivRef.classList.remove('dis-none');
    outroDivRef.classList.add('dis-none');
    canvas.classList.add('dis-none');
    woodSignRef.style.backgroundImage = 'url(./img/9_intro_outro_screens/start/wooden_sign_top2.png)';
    woodSignRef.style.paddingTop = '16%'
    woodSignRef.classList.remove('visible');
    if (isMobileDevice()) {
        mobileControlsRef.classList.add('dis-none');
        iconRefs.touch.classList.add('dis-none');
    }
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
        touchControl = true;
    }
}

function toggleTouchControl() {
    mobileControlsRef.classList.toggle('dis-none');
    touchControl = !touchControl;
    if (touchControl) {
        iconRefs.touch.src = "./img/12_icons/tap.png";
    } else {
        iconRefs.touch.src = "./img/12_icons/no_tap.png";
    }
}
