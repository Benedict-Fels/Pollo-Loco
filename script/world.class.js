class World {
    canvas;
    ctx;
    character;
    backgrounds = [];
    keyboard;
    cameraOffset = 0;
    nextTileX = 0;
    layerPaths = [
        { name: '3_third_layer', parallax: 0.2 },
        { name: '2_second_layer', parallax: 0.5 },
        { name: '1_first_layer', parallax: 1.0 }
    ];
    throwableObjects = [];

    WIDTH = 960;
    HEIGHT = 540;
    TILE_WIDTH = 1920;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;

        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        this.initializeWorld();
    }

    initializeWorld() {
        this.character = new Character();
        this.chicken = new Chicken();
        this.character.world = this;
        this.backgrounds = this.layerPaths.map(layer => {
            let bg = new Background(
                `img/5_background/layers/${layer.name}/full.png`,
                layer.parallax
            );
            return bg;
        });
        this.clouds = new Clouds(this.WIDTH, this.HEIGHT);
    }

    update() {
        this.character.stopWalking();
        if (this.keyboard.right) this.character.moveRight();
        if (this.keyboard.left) this.character.moveLeft();
        if (this.keyboard.up) this.character.jump();
        if (this.keyboard.attack) this.character.attack();
        if (this.keyboard.throw) this.character.throwBottle();

        this.character.updateAnimation();
        this.chicken.chickenAnimation();
        this.clouds.moveClouds();
        this.cameraOffset += this.character.movingDirection * this.character.speed;
        this.chicken.moveChicken(this.cameraOffset);
        this.checkThrowObjects();
        this.checkCollisions();
        this.cleanUpObjects();
    }

    checkThrowObjects() {
        if (this.keyboard.D && !this.character.isThrowing && !this.character.isJumping) {
            this.character.throwBottle();
            this.keyboard.D = false;
        }
    }

    checkCollisions() {
        if (this.character.isColliding(this.chicken)) {
            console.log('Kollision mit Chicken!');
        }
    }

    cleanUpObjects() {
    this.throwableObjects = this.throwableObjects.filter(obj => !obj.isGone);
}

    draw() {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.clouds.draw(this.ctx);
        this.backgrounds.forEach(bg => {
            bg.draw(this.ctx, this.cameraOffset);
        });
        this.character.updateAnimation();
        this.character.draw(this.ctx);
        this.character.drawHitbox(this.ctx);
        this.chicken.draw(this.ctx);
        this.chicken.drawHitbox(this.ctx);
        this.throwableObjects.forEach(obj => {
            obj.draw(this.ctx);
            obj.drawHitbox(this.ctx);
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}