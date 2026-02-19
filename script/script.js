const canvas = document.getElementById('canvasID');
const keyboard = new KeyboardInput();
const world = new World(canvas, keyboard);

world.gameLoop();
