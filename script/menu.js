
function openSettings() {
    if (controlsWoodSign || soundsWoodSign || imprintWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openSettingsSign();
            controlsWoodSign = false;
            soundsWoodSign = false;
            imprintWoodSign = false;
        }, 300);
    } else {
        openSettingsSign();
    }
}

function openSettingsSign() {
    settingsTemplate();
    woodSignRef.classList.toggle('visible');
    settingsWoodSign = !settingsWoodSign;
    startMusic();
}


function processControlsClick() {
    if (soundsWoodSign || settingsWoodSign || imprintWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openControlsSign();
            soundsWoodSign = false;
            settingsWoodSign = false;
            imprintWoodSign = false;
        }, 300);
    } else {
        openControlsSign();
    }
}

function openControlsSign() {
    controlsTemplate();
    woodSignRef.classList.toggle('visible');
    controlsWoodSign = !controlsWoodSign;
    startMusic();
}

function processSoundsClick() {
    if (controlsWoodSign || settingsWoodSign || imprintWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openSoundsSign();
            controlsWoodSign = false;
            settingsWoodSign = false;
            imprintWoodSign = false;
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


function processImprintClick() {
    if (soundsWoodSign || settingsWoodSign || controlsWoodSign) {
        woodSignRef.classList.remove('visible');
        setTimeout(() => {
            openImprintSign();
            soundsWoodSign = false;
            settingsWoodSign = false;
            controlsWoodSign = false;
        }, 300);
    } else {
        openImprintSign();
    }
}

function openImprintSign() {
    imprintTemplate();
    woodSignRef.classList.toggle('visible');
    imprintWoodSign = !imprintWoodSign;
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
function imprintTemplate() {
    woodSignRef.innerHTML = `
     <h2>Imprint</h2>
         <div class="imprint-content">
             <p>Game developed by Benedict Fels</p>
             <p>email: benedictfels@example.com</p>
             <p>phone: +49 123 456 789</p>
             <p>Musterstraße 1, 12345 Musterstadt</p>
             <p>icons from https://www.icon8.com</p>
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