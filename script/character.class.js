
class Character extends DrawableObject {
    speed = 7;
    speedY = 0;
    acceleration = 2;
    isJumping = false;
    isWalking = false;
    isThrowing = false;
    isAttacking = false;
    invincibility = false;
    isPlaying = false;
    isHurt = false;
    direction = 'right';
    health = 10;
    movingDirection = 0;
    currentAnimationFrame = 0;
    bottleInventory = 5;
    animationCounter = 0;

    constructor() {
        super();
        this.x = 100;
        this.y = 264;
        this.width = 100;
        this.height = 200;
        this.speedY = 0;
        this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };

        this.loadImages(character.idleImages);
        this.loadImages(character.walkImages);
        this.loadImages(character.jumpImages);
        this.loadImages(character.attackImages);
        this.loadImages(character.throwImages);
        this.loadImages(character.hurtImages);
        this.loadImages(character.deadImages);
        this.updateAnimation();
        this.applyGravity();

        this.img = this.imageCache[character.idleImages[0]];
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 264;
                this.speedY = 0;
                this.isJumping = false;
            }
        }, 1000 / 22);
    }

    isAboveGround() {
        return this.y < 264;
    }

    jump() {
        if (!this.isJumping) {
            this.speedY = 22;
            this.setState('isJumping');
        }
    }

    attack() {
        if (!this.isAttacking && !this.isJumping && !this.isWalking) {
            this.setState('isAttacking');
        }
    }

    throwBottle() {
        if (!this.isAttacking && !this.isJumping && this.bottleInventory > 0) {
            this.setState('isThrowing');
        }
    }

    setState(state) {
        this[state] = true;
        this.animationTimer = 0;
    }

    updateAnimation() {
        this.checkAnimation();
        if (this.isAttacking || this.isThrowing) {
            this.characterAnimation(this.imagesToUse, 3);
            if (this.checkEndAnimation()) {
                this.triggerEndFrameActions();
            }
        } else {
            this.characterAnimation(this.imagesToUse, 10);
        }
    }

    triggerEndFrameActions() {
        this.isAttacking = false;
        if (this.isThrowing) {
            this.bottleInventory -= 1;
            console.log('Flasche geworfen! Verbleibender Vorrat:', this.bottleInventory);
            this.spawnBottle();
            this.isThrowing = false;
        }
        this.animationTimer = 0;
        this.checkAnimation();
    }

    get attackBox() {
        let attackRange = 35;
        let xOffset = (this.direction === 'right') ? 80 : -20;
        return {
            x: this.x + xOffset,
            y: this.y + 100,
            width: attackRange,
            height: 80
        }
    }

    spawnBottle() {
        let bottle = new SalsaBottle(
            this.x + (this.direction === 'right' ? 50 : 0),
            this.y + 50,
            this.direction,
        );
        this.world.throwableObjects.push(bottle);
    }

    recieveDamage() {
        if (this.invincibility) return;
        this.health -= 1;
        if (this.health <= 0) {
            this.isDead = true;
            return
        }
        console.log(`Character health: ${this.health}`);
        this.isHurt = true;
        this.invincibility = true;
        setTimeout(() => {
            this.isHurt = false;
            this.invincibility = false;
        }, 500);
    }

    characterAnimation(imagesToUse, timer = 10) {
        this.getAnimationFrame('animationTimer', timer);
        if (this.newFrame) {
            this.setCurrentImage(imagesToUse);
            if (this.isDead && this.checkEndAnimation()) {
                console.log(`Ende`);
                this.world.gameStopped = true;
            };
            this.checkHasAttacked();
        }
    }

    checkHasAttacked() {
        if (this.isAttacking && this.currentAnimationFrame >= 8) {
            this.hasAttacked = true
        }
        else
            this.hasAttacked = false;
    }

    checkAnimation() {
        if (this.isDead) {
            this.imagesToUse = character.deadImages;
        } else if (this.isHurt) {
            this.imagesToUse = character.hurtImages;
        } else if (this.isJumping) {
            this.imagesToUse = character.jumpImages;
        } else if (this.isThrowing) {
            this.imagesToUse = character.throwImages;
        } else if (this.isAttacking) {
            this.imagesToUse = character.attackImages;
        } else if (this.isWalking) {
            this.imagesToUse = character.walkImages;
        } else {
            this.imagesToUse = character.idleImages;
        }
    }

    moveLeft() {
        this.isAttacking = false;
        this.isWalking = true;
        this.movingDirection = -1;
        this.direction = 'left';
        this.x -= this.speed;
        this.collisionOffset = { top: 100, left: 30, right: 20, bottom: 10 };
    }

    moveRight() {
        this.isAttacking = false;
        this.isWalking = true;
        this.movingDirection = 1;
        this.direction = 'right';
        this.x += this.speed;
        this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };
    }

    stopWalking() {
        this.isWalking = false;
        this.movingDirection = 0;
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;
    }

    drawManual(ctx, cameraOffset) {
        if (this.direction === 'left') {
            ctx.save();
            ctx.translate(this.x + cameraOffset + this.width / 2, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.width / 2, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x + cameraOffset, this.y, this.width, this.height);
        }
    }
    // drawHitbox(ctx, cameraOffset) {
    //     ctx.beginPath();
    //     ctx.rect(this.x + this.collisionOffset.left + cameraOffset, this.y + this.collisionOffset.top,
    //         this.width - this.collisionOffset.left - this.collisionOffset.right,
    //         this.height - this.collisionOffset.top - this.collisionOffset.bottom);
    //     ctx.stroke();
    // }
}