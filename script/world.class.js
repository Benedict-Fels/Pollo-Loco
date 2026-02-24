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
    collectableBottles = [];
    enemies = [];
    groundLevel = 404;

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
        this.character.world = this;
        this.backgrounds = this.layerPaths.map(layer => {
            let bg = new Background(
                `img/5_background/layers/${layer.name}/full.png`,
                layer.parallax
            );
            return bg;
        });
        this.clouds = new Clouds(this.WIDTH, this.HEIGHT);
        this.spawnBottles();
    }

    update() {
        this.character.stopWalking();
        if (this.keyboard.right) this.character.moveRight();
        if (this.keyboard.left) this.character.moveLeft();
        if (this.keyboard.up) this.character.jump();
        if (this.keyboard.attack) this.character.attack();
        if (this.keyboard.throw) this.character.throwBottle();

        this.character.updateAnimation();
        this.enemies.forEach(enemy => {
            enemy.chickenAnimation();
            enemy.moveChicken();
        });
        this.clouds.moveClouds();
        this.cameraOffset = 100 - this.character.x;

        this.checkFirstMovement();

        this.checkThrowObjects();
        this.checkCollisions();
        this.checkBottleCollection();
        this.cleanUpObjects();
    }

    checkFirstMovement() {
        if (this.character.movingDirection !== 0 && !this.character.isPlaying) {
            this.character.isPlaying = true;
            this.startLevel();
        }
    }

    spawnBottles() {
        for (let i = 0; i < 5; i++) {
            let xBottlePos = 400 + Math.random() * 2000;
            this.collectableBottles.push(new CollectableBottle(xBottlePos, this.groundLevel));
        }
    }

    startLevel() {
        for (let i = 0; i < 3; i++) {
            let xPos = 2000 + (i * 500);
            this.enemies.push(new Chicken(xPos));
        }

    }

    checkThrowObjects() {
        if (this.keyboard.throw && !this.character.isThrowing && !this.character.isJumping) {
            this.character.throwBottle();
            this.keyboard.throw = false;
        }
    }

    checkCollisions() {
        this.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isAttacking && !enemy.isDead) {
                this.character.recieveDamage()
            }
            if (this.character.isAttacking && this.character.isColliding(enemy)) {
                enemy.isDead = true;
                console.log('Chicken wurde attackiert');

            }
            if (this.throwableObjects.some(obj => obj.isColliding(enemy) && !obj.isGone && !obj.isSplashing)) {
                console.log('Chicken wurde getroffen!');
                enemy.isDead = true;
            }
        });
    }

    checkBottleCollection() {
        this.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottleInventory += 1;
                console.log('Flasche eingesammelt! Vorrat:', this.character.bottleInventory);
                this.collectableBottles.splice(index, 1);
            }
        });
    }

    cleanUpObjects() {
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.isGone);
        this.enemies = this.enemies.filter(chicken => !chicken.isGone);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.clouds.draw(this.ctx);
        this.backgrounds.forEach(bg => {
            bg.draw(this.ctx, this.cameraOffset);
        });
        this.character.updateAnimation();
        this.character.drawManual(this.ctx, this.cameraOffset);
        this.character.drawHitbox(this.ctx, this.cameraOffset);
        this.enemies.forEach(chicken => {
            chicken.drawManual(this.ctx, this.cameraOffset);
            chicken.drawHitbox(this.ctx, this.cameraOffset);
        });
        this.collectableBottles.forEach(bottle => {
            bottle.drawManual(this.ctx, this.cameraOffset);
        });
        this.throwableObjects.forEach(obj => {
            obj.draw(this.ctx, this.cameraOffset);
            obj.drawHitbox(this.ctx, this.cameraOffset);
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}