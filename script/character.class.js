
class Character extends DrawableObject {
    speed = 10;
    speedY = 0;
    acceleration = 2;
    isJumping = false;
    isWalking = false;
    direction = 'right';
    movingDirection = 0;
    currentAnimationFrame = 0;
    idleImages = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',];
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
        'img/2_character_pepe/6_attack/A-1.png',
        'img/2_character_pepe/6_attack/A-2.png',
        'img/2_character_pepe/6_attack/A-3.png',
        'img/2_character_pepe/6_attack/A-4.png',
        'img/2_character_pepe/6_attack/A-5.png',
        'img/2_character_pepe/6_attack/A-6.png',
        'img/2_character_pepe/6_attack/A-7.png',
        'img/2_character_pepe/6_attack/A-8.png',
        'img/2_character_pepe/6_attack/A-9.png',
        'img/2_character_pepe/6_attack/A-10.png',
    ]

    animationCounter = 0;

    constructor() {
        super();
        this.x = 100;
        this.y = 264;
        this.width = 100;
        this.height = 200;
        this.speedY = 0;

        this.loadImages(this.idleImages);
        this.loadImages(this.walkImages);
        this.loadImages(this.jumpImages);
        this.loadImages(this.attackImages);
        this.updateAnimation()
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
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.animationTimer = 0;
        }
    }

    updateAnimation() {
        let imagesToUse = this.checkAnimation();

        if (this.isWalking !== this.wasWalkingLastFrame) {
            this.animationTimer = 0;
        }
        this.wasWalkingLastFrame = this.isWalking;
        if (this.isAttacking) {
            this.characterAnimation(imagesToUse, 7);
        } else {
            this.characterAnimation(imagesToUse, 20);
        }
        if (this.isAttacking) {
            if (this.currentAnimationFrame >= this.attackImages.length - 1) {
                this.isAttacking = false;
                this.currentAnimationFrame = 0;
                this.animationTimer = 0;
                imagesToUse = this.checkAnimation();
            }
        }
    }

    characterAnimation(imagesToUse, timer = 20) {
        this.animationTimer = (this.animationTimer || 0) + 1;
        if (this.animationTimer % timer !== 0) return;
        this.currentAnimationFrame = ((this.animationTimer / timer));
        let i = (this.currentAnimationFrame % imagesToUse.length);
        let path = imagesToUse[i];
        this.img = this.imageCache[path];
    }

    checkAnimation() {
        if (this.isJumping) {
            return this.imagesToUse = this.jumpImages;
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
            this.isWalking = true;
        }
    }

    moveRight() {
        if (!this.isAttacking) {
            this.movingDirection = 1;
            this.direction = 'right';
            this.isWalking = true;
        }
    }

    stopWalking() {
        this.isWalking = false;
        this.movingDirection = 0;
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;
    }

    draw(ctx) {
        if (this.direction === 'left') {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.width / 2, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
