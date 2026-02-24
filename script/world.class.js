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
        for (let i = 0; i < 5; i++) {
            let xBottlePos = 400 + Math.random() * 2000;
            this.collectableBottles.push(new CollectableBottle(xBottlePos, this.groundLevel));
        }
        this.level = new levelOne();
        this.level.world = this;
    }

    update() {
        this.character.stopWalking();
        this.getKeyboardInput();
        this.character.updateAnimation();
        this.enemies.forEach(enemy => {
            enemy.chickenAnimation();
            enemy.moveChicken();
        });
        this.clouds.moveClouds();
        this.cameraOffset = 100 - this.character.x;

        this.level.update();
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkBottleCollection();
        this.cleanUpObjects();
    }

    getKeyboardInput() {
        if (this.keyboard.right) this.character.moveRight();
        if (this.keyboard.left) this.character.moveLeft();
        if (this.keyboard.up) this.character.jump();
        if (this.keyboard.attack) this.character.attack();
        if (this.keyboard.throw) this.character.throwBottle();
    }

    checkThrowObjects() {
        if (this.keyboard.throw && !this.character.isThrowing && !this.character.isJumping) {
            this.character.throwBottle();
            this.keyboard.throw = false;
        }
    }

    checkCollisions() {
        this.enemies.forEach((enemy) => {
            if (enemy.isDead) return;
            if (this.character.hasAttacked) {
                let box = this.character.attackBox;
                if (box.x + box.width > enemy.x + enemy.collisionOffset.left &&
                    box.y + box.height > enemy.y + enemy.collisionOffset.top &&
                    box.x < enemy.x + enemy.width - enemy.collisionOffset.right &&
                    box.y < enemy.y + enemy.height - enemy.collisionOffset.bottom) {
                    this.dealDamage(enemy)
                }
            }
            if (this.character.isColliding(enemy) && !this.character.invincibility) {
                this.character.recieveDamage();
            }
            this.throwableObjects.forEach(obj => {
                if (obj.isColliding(enemy) && !obj.isSplashing) {
                    enemy.health -= 1;
                    console.log('Lebenspunkte', enemy.health);
                    if (enemy.health == 0) {
                        enemy.isDead = true;
                    }
                    obj.isSplashing = true;
                }
            });
        });
    }

    dealDamage(enemy) {
        if (enemy.takenDamage) {
            return;
        }
        enemy.health -= 1;
        if (enemy.health == 0) {
            enemy.isDead = true;
            return;
        }
        console.log('Lebenspunkte', enemy.health);
        enemy.takenDamage = true;
        setTimeout(() => {
            enemy.takenDamage = false;
        }, 500);
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
        this.enemies = this.enemies.filter(enemy => {
            let isOffScreenLeft = enemy.x < this.character.x - this.WIDTH * 2;
            return !enemy.isGone && !isOffScreenLeft;
        });
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
        if (this.character.hasAttacked) {
            let box = this.character.attackBox;
            this.ctx.strokeStyle = 'blue';
            this.ctx.strokeRect(box.x + this.cameraOffset, box.y, box.width, box.height);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}