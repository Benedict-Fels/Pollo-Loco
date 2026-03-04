
const soundFiles = {
    bossChickenDamageSound: './sound/bossChicken/chicken_hurt.mp3',
    bossChickenStompSound: './sound/bossChicken/stomp.mp3',
    eggCrackSound: './sound/bossChicken/egg_crack.mp3',
    chickenDeadSound: './sound/chicken_dead.mp3',
    bottleBreakSound: './sound/bottle_break.mp3',
    throwSound: './sound/throw.mp3',
    collectSound: './sound/collect.wav',
    characterHurtSound: './sound/character/character_damage.mp3',
    characterDeadSound: './sound/character/character_dead.wav'
}; 
Object.keys(soundFiles).forEach(key => {
    let audio = new Audio(soundFiles[key]); 
    window[key] = audio; 
    audio.volume = 0.15;
});

const music = new Audio('./sound/spagetti_western.ogg');
music.volume = 0.15;
music.loop = true;