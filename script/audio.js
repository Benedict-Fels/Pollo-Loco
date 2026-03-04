
const bossChickenDamageSound = new Audio('./sound/bossChicken/chicken_hurt.mp3');
const bossChickenStompSound = new Audio('./sound/bossChicken/stomp.mp3');
const eggCrackSound = new Audio('./sound/bossChicken/egg_crack.mp3');
const chickenDeadSound = new Audio('./sound/chicken_dead.mp3');
const bottleBreakSound = new Audio('./sound/bottle_break.mp3');
const throwSound = new Audio('./sound/throw.mp3');
const collectSound = new Audio('./sound/collect.wav');
const music = new Audio('./sound/spagetti_western.ogg');
const characterHurtSound = new Audio('./sound/character/character_damage.mp3');
const characterDeadSound = new Audio('./sound/character/character_dead.wav');

bossChickenDamageSound.volume = 0.25;
bossChickenStompSound.volume = 0.25;
eggCrackSound.volume = 0.25;
bottleBreakSound.volume = 0.25;
throwSound.volume = 0.25;
collectSound.volume = 0.25;
chickenDeadSound.volume = 0.25;
characterHurtSound.volume = 0.25;
characterDeadSound.volume = 0.25;
music.volume = 0.125;
music.loop = true;