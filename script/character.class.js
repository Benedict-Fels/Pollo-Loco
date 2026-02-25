
class Character extends DrawableObject {
    speed = 10;
    speedY = 0;
    acceleration = 2;
    isJumping = false;
    isWalking = false;
    isThrowing = false;
    isAttacking = false;
    invincibility = false;
    isPlaying = false;
    direction = 'right';
    health = 10;
    movingDirection = 0;
    currentAnimationFrame = 0;
    bottleInventory = 5;

    idleImages = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    walkImages = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];
    jumpImages = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];
    attackImages = [
        'img/2_character_pepe/6_attack/A-1-flipped.png',
        'img/2_character_pepe/6_attack/A-2-flipped.png',
        'img/2_character_pepe/6_attack/A-3-flipped.png',
        'img/2_character_pepe/6_attack/A-4-flipped.png',
        'img/2_character_pepe/6_attack/A-5-flipped.png',
        'img/2_character_pepe/6_attack/A-6-flipped.png',
        'img/2_character_pepe/6_attack/A-7-flipped.png',
        'img/2_character_pepe/6_attack/A-8-flipped.png',
        'img/2_character_pepe/6_attack/A-9-flipped.png',
        'img/2_character_pepe/6_attack/A-10-flipped.png',
    ]

    throwImages = [
        'img/2_character_pepe/6_attack/A-1-flipped.png',
        'img/2_character_pepe/6_attack/A-2-flipped.png',
        'img/2_character_pepe/6_attack/A-3-flipped.png',
        'img/2_character_pepe/6_attack/A-4-flipped.png',
        'img/2_character_pepe/6_attack/A-5-flipped.png',
        'img/2_character_pepe/6_attack/A-6-flipped.png',
        'img/2_character_pepe/6_attack/A-7-flipped.png',

    ]

    animationCounter = 0;

    constructor() {
        super();
        this.x = 100;
        this.y = 264;
        this.width = 100;
        this.height = 200;
        this.speedY = 0;
        this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };

        this.loadImages(this.idleImages);
        this.loadImages(this.walkImages);
        this.loadImages(this.jumpImages);
        this.loadImages(this.attackImages);
        this.loadImages(this.throwImages);
        this.updateAnimation();
        this.applyGravity();

        this.img = this.imageCache[this.idleImages[0]];
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
            this.isJumping = true;
            this.animationTimer = 0;
        }
    }

    attack() {
        if (!this.isAttacking && !this.isJumping) {
            // this.collisionOffset[this.direction] = -20;
            this.isAttacking = true;
            this.animationTimer = 0;
        }
    }

    throwBottle() {
        if (!this.isAttacking && !this.isJumping && this.bottleInventory > 0) {
            this.isThrowing = true;
            this.animationTimer = 0;
        }
    }

    updateAnimation() {
        let imagesToUse = this.checkAnimation();
        if (this.isWalking !== this.wasWalkingLastFrame) {
            this.animationTimer = 0;
        }
        this.wasWalkingLastFrame = this.isWalking;
        if (this.isAttacking || this.isThrowing) {
            this.characterAnimation(imagesToUse, 7);
        } else {
            this.characterAnimation(imagesToUse, 20);
        }
        if (this.isAttacking || this.isThrowing) {
            if (this.currentAnimationFrame >= this.imagesToUse.length - 1) {
                // this.collisionOffset[this.direction] = 30;
                this.isAttacking = false;
                if (this.isThrowing) {
                    this.bottleInventory -= 1;
                    console.log('Flasche geworfen! Verbleibender Vorrat:', this.bottleInventory);
                    this.spawnBottle();
                    this.isThrowing = false;
                }
                this.animationTimer = 0;
                imagesToUse = this.checkAnimation();
            }
        }
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
        console.log(`Character health: ${this.health}`);
        this.invincibility = true;
        setTimeout(() => {
            this.invincibility = false;
        }, 1000);
    }

    characterAnimation(imagesToUse, timer = 20) {
        this.animateImages(imagesToUse, timer)
        if (this.isAttacking && this.currentAnimationFrame >= 8) {
            this.hasAttacked = true
        }
        else
            this.hasAttacked = false;
    }

    checkAnimation() {
        if (this.isJumping) {
            return this.imagesToUse = this.jumpImages;
        } else if (this.isThrowing) {
            return this.imagesToUse = this.throwImages;
        } else if (this.isAttacking) {
            return this.imagesToUse = this.attackImages;
        } else if (this.isWalking) {
            return this.imagesToUse = this.walkImages;
        } else {
            return this.imagesToUse = this.idleImages;
        }
    }

    moveLeft() {
        if (!this.isAttacking) {
            this.movingDirection = -1;
            this.direction = 'left';
            this.x -= this.speed;
            this.isWalking = true;
            this.collisionOffset = { top: 100, left: 30, right: 20, bottom: 10 };
        }
    }

    moveRight() {
        if (!this.isAttacking) {
            this.movingDirection = 1;
            this.direction = 'right';
            this.x += this.speed;
            this.isWalking = true;
            this.collisionOffset = { top: 100, left: 20, right: 30, bottom: 10 };
        }
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

    drawHitbox(ctx, cameraOffset) {
        ctx.beginPath();
        ctx.rect(this.x + this.collisionOffset.left + cameraOffset, this.y + this.collisionOffset.top,
            this.width - this.collisionOffset.left - this.collisionOffset.right,
            this.height - this.collisionOffset.top - this.collisionOffset.bottom);
        ctx.stroke();
    }
}